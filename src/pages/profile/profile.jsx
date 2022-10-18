import {
  IonContent,
  IonAvatar,
  IonHeader,
  IonPage,
  useIonAlert,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import {
  getAuth,
  signOut,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import Header from '../../components/header/header';
import './profile.css';
import {
  query,
  collection,
  doc,
  getDocs,
  deleteDoc,
  where,
  updateDoc,
} from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useState, useEffect } from 'react';
import { database } from '../../utils/firebaseConfig';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  cloudUploadOutline,
  checkmarkCircleOutline,
  alertOutline,
  settingsOutline,
  settings,
  caretUpCircle,
} from 'ionicons/icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Profile = () => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [label, setLabel] = useState('');
  const [photo, setPhoto] = useState('/');
  const [settingsTrigger, setsettingsTrigger] = useState(false);

  const [ProfileInputs, setProfileInputs] = useState({
    email: '',
    phone: '',
    label: '',
  });

  const [passwordInput, SetPasswordInput] = useState({
    password: '',
  });

  const [reAuth] = useIonAlert();
  const [presentToast] = useIonToast();

  const db = collection(database, 'users');
  const history = useHistory();

  const chooseImage = async () => {
    try {
      const data = await takePicture();
      console.log(data);
      setPhoto(data.webPath);
    } catch (error) {
      alert(error.message);
    }
  };

  const takePicture = () => {
    const image = Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      promptLabelPhoto: 'Gallery',
      promptLabelPicture: 'Camera',
      promptLabelHeader: 'Cancel',
    });
    return image;
  };

  const singOut = async () => {
    await signOut(auth);
    history.replace('/');
    window.location.reload();
  };

  const handleProfileChange = (e) => {
    setProfileInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };
  const handlePasswordChange = (e) => {
    SetPasswordInput((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };
  const fetchData = async () => {
    try {
      const q = query(
        collection(database, 'users'),
        where('__name__', '==', user?.uid)
      );
      const doc = await getDocs(q);

      const data = doc.docs[0].data();

      setName(data.username);
      setPhone(data.phone);

      setLabel(data.label);
      setProfileInputs({
        email: auth.currentUser.email,
        phone: data.phone,
        label: data.label,
      });
      console.log(ProfileInputs);
    } catch (err) {
      console.error(err);
      presentToast({
        message: 'An Error has occured, restart the app',
        duration: 3000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
      alert('An error occured while fetching user data');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const updateData = async (field) => {
    let dataToUpdate = doc(database, 'users', user?.uid);
    switch (field) {
      //-------------------------------------------------
      case 'email':
        const regex =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if (!regex.test(String(ProfileInputs.email).toLowerCase())) {
          presentToast({
            message: 'Wrong email address input',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        }
        if (auth.currentUser.email === ProfileInputs.email) {
          presentToast({
            message: 'Same email address got provided',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else if (ProfileInputs.email === '') {
          presentToast({
            message: 'Please provide an email address',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else {
          reAuth({
            header: 'Attention',
            message: 'Enter your current password to proceed',

            inputs: [
              {
                name: 'oldPassword',
                placeholder: 'Password',
              },
            ],
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {},
              },
              {
                text: 'Confirm',
                role: 'confirm',
                handler: async (alertData) => {
                  const oldPassword = alertData.oldPassword;
                  console.log(oldPassword);
                  if (oldPassword === '') {
                    presentToast({
                      message: 'Please enter your current password',
                      duration: 2000,
                      icon: alertOutline,
                      cssClass: 'redToast',
                    });
                    return false;
                  } else {
                    const credential = EmailAuthProvider.credential(
                      auth.currentUser.email,
                      oldPassword
                    );
                    try {
                      const res = await reauthenticateWithCredential(
                        auth.currentUser,
                        credential
                      );
                      console.log(res);
                      _changeEmail(ProfileInputs.email);
                    } catch (error) {
                      console.log('ReAuth error' + error.message);

                      presentToast({
                        message: 'Wrong Password',
                        duration: 1500,
                        icon: alertOutline,
                        cssClass: 'redToast',
                      });
                    }
                  }
                },
              },
            ],
            onDidDismiss: () => {
              console.log('dismised');
            },
          });
          break;
        }
      //-------------------------------------------------

      //-------------------------------------------------
      case 'phone':
        if (phone === ProfileInputs.phone) {
          presentToast({
            message: 'Same phone number got provided',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else if (ProfileInputs.phone === '') {
          presentToast({
            message: 'Please provide a phone number',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else {
          try {
            const res = await updateDoc(dataToUpdate, {
              phone: ProfileInputs.phone,
            });

            console.log(res);
            fetchData();
            presentToast({
              message: 'Data Successfully Updated',
              duration: 1500,
              icon: checkmarkCircleOutline,
            });
          } catch (error) {
            console.log('UpdatePhone error' + error.message);
            presentToast({
              message: 'Error Updating Data',
              duration: 1500,
              icon: alertOutline,
              cssClass: 'redToast',
            });
          } finally {
            break;
          }
        }
      //-------------------------------------------------

      //-------------------------------------------------
      case 'label':
        if (label === ProfileInputs.label) {
          presentToast({
            message: 'Same label got provided',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else if (ProfileInputs.label === '') {
          presentToast({
            message: 'Please provide a label',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else {
          try {
            const res = await updateDoc(dataToUpdate, {
              label: ProfileInputs.label,
            });

            console.log(res);
            fetchData();
            presentToast({
              message: 'Data Successfully Updated',
              duration: 1500,
              icon: checkmarkCircleOutline,
            });
          } catch (error) {
            console.log('UpdateLabel error' + error.message);
            presentToast({
              message: 'Error Updating Data',
              duration: 1500,
              icon: alertOutline,
              cssClass: 'redToast',
            });
          } finally {
            break;
          }
        }
      //-------------------------------------------------

      case 'email':
        return console.log('lol');
    }
  };

  const changePassword = (newPassword) => {
    if (newPassword === '') {
      presentToast({
        message: 'Please enter a new password if you wish to change it',
        duration: 2500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      reAuth({
        header: 'Attention',
        message: 'Enter your current password to proceed',

        inputs: [
          {
            name: 'oldPassword',
            placeholder: 'Password',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {},
          },
          {
            text: 'Confirm',
            role: 'confirm',
            handler: (alertData) => {
              const oldPassword = alertData.oldPassword;
              console.log(oldPassword);
              if (oldPassword === '') {
                presentToast({
                  message: 'Please enter your current password',
                  duration: 2000,
                  icon: alertOutline,
                  cssClass: 'redToast',
                });
                return false;
              } else {
                _changePassword(oldPassword, newPassword);
              }
            },
          },
        ],
        onDidDismiss: () => {
          console.log('dismised');
          SetPasswordInput({ password: '' });
        },
      });
    }
  };

  const _changePassword = async (oldPassword, newPassword) => {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    );
    try {
      const res = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );
      console.log(res);
      try {
        const res = await updatePassword(auth.currentUser, newPassword);
        console.log(res);

        presentToast({
          message: 'Password Changed Successfully',
          duration: 2500,
          icon: checkmarkCircleOutline,
        });
      } catch (error) {
        console.log('UpdatePassword error' + error.message);
        presentToast({
          message: 'Wrong Password',
          duration: 1500,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      }
    } catch (error) {
      console.log('ReAuth error' + error.message);

      presentToast({
        message: 'Wrong Password',
        duration: 1500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  const _changeEmail = async (newEmail) => {
    console.log(newEmail);
    try {
      const res = await updateEmail(user, newEmail);
      console.log(res);
      presentToast({
        message: 'Email Updated',
        duration: 1500,
        icon: checkmarkCircleOutline,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteData = async () => {
    reAuth({
      header: 'Attention',
      message: 'Enter your current password to proceed',

      inputs: [
        {
          name: 'oldPassword',
          placeholder: 'Password',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: (alertData) => {
            const oldPassword = alertData.oldPassword;
            console.log(oldPassword);
            if (oldPassword === '') {
              presentToast({
                message: 'Please enter your current password',
                duration: 2000,
                icon: alertOutline,
                cssClass: 'redToast',
              });
              return false;
            } else {
              _deleteData(oldPassword);
            }
          },
        },
      ],
      onDidDismiss: () => {
        console.log('dismised');
        SetPasswordInput({ password: '' });
      },
    });
  };

  const _deleteData = async (oldPassword) => {
    let dataToDelete = doc(database, 'users', user?.uid);

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword
    );
    try {
      const res = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      );
      console.log(res);
      try {
        const res = await deleteDoc(dataToDelete);
        console.log(res);
        try {
          await user.delete();
          history.replace('/');
          window.location.reload();
        } catch (error) {
          console.log(error.message);
          presentToast({
            message: 'Error accured, please contact admins',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
        }
      } catch (error) {
        console.log(error.message);
        presentToast({
          message: 'Error accured, please contact admins',
          duration: 1500,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      }
    } catch (error) {
      console.log('ReAuth error' + error.message);

      presentToast({
        message: 'Wrong Password',
        duration: 1500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <div className="profilecontainer">
          <div className="center">
            <div className="ImageContainer">
              <IonAvatar>
                <img
                  alt="Silhouette of a person's head"
                  src="assets/joenassar.png"
                />
              </IonAvatar>

              <div
                className="UploadIcon"
                onClick={() => {
                  console.log('hi');
                }}
              >
                <IonIcon icon={cloudUploadOutline} />
              </div>

              {name ? (
                <IonLabel className="username">{name}</IonLabel>
              ) : (
                <div className="skeletonForName">
                  <Skeleton
                    baseColor="#102835"
                    highlightColor="#286ab7"
                    duration={1.3}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="detailscontainer">
            <div className="detailslist">
              <div
                onClick={() => setsettingsTrigger(!settingsTrigger)}
                className="settingsIcon"
              >
                <IonIcon icon={!settingsTrigger ? settingsOutline : settings} />
              </div>
              {!settingsTrigger ? (
                <>
                  {' '}
                  <IonLabel>Email Address</IonLabel>
                  {phone ? (
                    <IonItem>
                      <IonInput
                        name="email"
                        value={auth.currentUser.email}
                        disabled
                      ></IonInput>
                    </IonItem>
                  ) : (
                    <Skeleton
                      baseColor="#102835"
                      highlightColor="#286ab7"
                      duration={1.3}
                      className="skeleton"
                    />
                  )}
                  <hr />
                  <hr />
                  <IonLabel>Phone Number</IonLabel>
                  {phone ? (
                    <IonItem>
                      <IonInput value={phone} name="phone" disabled></IonInput>
                    </IonItem>
                  ) : (
                    <Skeleton
                      baseColor="#102835"
                      highlightColor="#286ab7"
                      duration={1.3}
                      className="skeleton"
                    />
                  )}
                  <hr />
                  <hr />
                  <IonLabel>Label</IonLabel>
                  {label ? (
                    <IonItem>
                      <IonInput name="label" value={label} disabled></IonInput>
                    </IonItem>
                  ) : (
                    <Skeleton
                      baseColor="#102835"
                      highlightColor="#286ab7"
                      duration={1.3}
                      className="skeleton"
                    />
                  )}
                  <hr />
                  <hr />
                  <div className="guides">
                    <div className="guidesItem">
                      <IonIcon
                        className="guidesIcon"
                        icon={settingsOutline}
                      ></IonIcon>
                      <IonLabel> Settings View </IonLabel>
                    </div>
                    <div className="guidesItem">
                      <IonIcon
                        className="guidesIcon"
                        icon={caretUpCircle}
                      ></IonIcon>
                      <IonLabel> Update Data </IonLabel>
                    </div>
                    <div className="guidesItem">
                      <IonIcon
                        className="guidesIcon"
                        icon={cloudUploadOutline}
                      ></IonIcon>
                      <IonLabel> Change Profile Picture </IonLabel>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {' '}
                  <IonLabel>Email Address</IonLabel>
                  <div className="updateContent">
                    {phone ? (
                      <IonItem>
                        <IonInput
                          className="nopadding"
                          name="email"
                          value={ProfileInputs.email}
                          onIonInput={handleProfileChange}
                          placeholder="Email Address"
                        ></IonInput>
                      </IonItem>
                    ) : (
                      <Skeleton
                        baseColor="#102835"
                        highlightColor="#286ab7"
                        duration={1.3}
                        className="skeleton"
                      />
                    )}
                    <div
                      className="updateIcon"
                      onClick={() => updateData('email')}
                    >
                      <IonIcon icon={caretUpCircle}></IonIcon>
                    </div>
                  </div>
                  <hr />
                  <hr />
                  <IonLabel>Phone Number</IonLabel>
                  <div className="updateContent">
                    {phone ? (
                      <IonItem>
                        <IonInput
                          className="nopadding"
                          name="phone"
                          value={ProfileInputs.phone}
                          onIonInput={handleProfileChange}
                          placeholder="Phone Number"
                        ></IonInput>
                      </IonItem>
                    ) : (
                      <Skeleton
                        baseColor="#102835"
                        highlightColor="#286ab7"
                        duration={1.3}
                        className="skeleton"
                      />
                    )}
                    <div
                      className="updateIcon"
                      onClick={() => updateData('phone')}
                    >
                      <IonIcon icon={caretUpCircle}></IonIcon>
                    </div>
                  </div>
                  <hr />
                  <hr />
                  <IonLabel>Label</IonLabel>
                  <div className="updateContent">
                    {label ? (
                      <IonItem>
                        <IonInput
                          className="nopadding"
                          name="label"
                          value={ProfileInputs.label}
                          onIonInput={handleProfileChange}
                          placeholder="Ex: The Dip Buyer"
                        ></IonInput>
                      </IonItem>
                    ) : (
                      <Skeleton
                        baseColor="#102835"
                        highlightColor="#286ab7"
                        duration={1.3}
                        className="skeleton"
                      />
                    )}
                    <div
                      className="updateIcon"
                      onClick={() => updateData('label')}
                    >
                      <IonIcon icon={caretUpCircle}></IonIcon>
                    </div>
                  </div>
                  <hr />
                  <hr />
                  <IonLabel>Change Password</IonLabel>
                  <div className="updateContent">
                    <IonItem>
                      <IonInput
                        className="nopadding"
                        name="password"
                        value={passwordInput.password}
                        onIonInput={handlePasswordChange}
                        placeholder="Enter New Password"
                      ></IonInput>
                    </IonItem>

                    <div
                      className="updateIcon"
                      onClick={() => changePassword(passwordInput.password)}
                    >
                      <IonIcon icon={caretUpCircle}></IonIcon>
                    </div>
                  </div>
                  <hr />
                  <hr />
                  <IonButton color="primary" onClick={singOut} expand="block">
                    Sign Out
                  </IonButton>
                  <IonButton color="danger" expand="block" onClick={deleteData}>
                    Delete Account
                  </IonButton>
                </>
              )}
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
