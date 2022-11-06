import {
  IonContent,
  IonAvatar,
  IonHeader,
  IonPage,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSkeletonText,
} from '@ionic/react';
import {
  signOut,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import Header from '../../components/header/header';
import './profile.css';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { useLocation } from 'react-router-dom';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  cloudUploadOutline,
  checkmarkCircleOutline,
  alertOutline,
  settingsOutline,
  settings,
  caretUpCircle,
} from 'ionicons/icons';
import { checkFullNumber } from '../../utils/functions';
import { MainContext } from '../../utils/Context';
import { storage } from '../../utils/firebaseConfig';

const Profile = () => {
  const {
    reAuth,
    presentToast,
    database,
    user,
    auth,
    fetchUserData,
    name,
    label,
    phone,
    imageURL,
    email,
  } = useContext(MainContext);

  const history = useHistory();

  const [photoLoading, setPhotoloading] = useState(false);
  const [settingsTrigger, setsettingsTrigger] = useState(false);
  const [ProfileInputs, setProfileInputs] = useState({
    email: '',
    phone: '',
    label: '',
  });
  const [passwordInput, SetPasswordInput] = useState({
    password: '',
  });

  useEffect(() => {
    async function _fetchUserData() {
      await fetchUserData();
    }
    _fetchUserData();
    setProfileInputs({
      email: email,
      phone: phone,
      label: label,
    });
  }, [name, phone, label, settingsTrigger]);

  const chooseImage = async () => {
    let dataToUpdate = doc(database, 'users', user?.uid);

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });
      setPhotoloading(true);
      const rawData = atob(image.base64String);
      const bytes = new Array(rawData.length);
      for (var x = 0; x < rawData.length; x++) {
        bytes[x] = rawData.charCodeAt(x);
      }
      const arr = new Uint8Array(bytes);
      const blob = new Blob([arr], { type: 'image/png' });

      const storageRef = ref(storage, `/files/${name}.png`);

      await uploadBytesResumable(storageRef, blob);

      try {
        const starsRefDownload = ref(storage, `/files/${name}.png`);
        const imagePath = await getDownloadURL(starsRefDownload);

        await updateDoc(dataToUpdate, {
          imageURL: imagePath,
        });

        await fetchUserData();
        setPhotoloading(false);
        presentToast({
          message: 'Image Successfully Updated',
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
        setPhotoloading(false);
      }

      // setPhoto(imageUrl);
    } catch (error) {
      alert(error.message);
    }
  };

  const singOut = async () => {
    await signOut(auth);
    history.replace('/');
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

  //Listening to route change to reset the state of the settings page
  let location = useLocation();
  useEffect(() => {
    settingsTrigger && setsettingsTrigger(false);
  }, [location]);
  //-----------------------------------------------------------------

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
        } else if (checkFullNumber(ProfileInputs.phone)) {
          presentToast({
            message: 'Please provide a valid phone number',
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

            fetchUserData();
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
            duration: 2500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else if (ProfileInputs.label === '') {
          presentToast({
            message: 'Please provide a label',
            duration: 2500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else if (ProfileInputs.label.length > 20) {
          presentToast({
            message: 'Label should be shorter',
            duration: 2500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
          break;
        } else {
          try {
            const res = await updateDoc(dataToUpdate, {
              label: ProfileInputs.label,
            });

            fetchUserData();
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
    } else if (newPassword.length < 7) {
      presentToast({
        message: 'Password should be more than 6 characters',
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

      try {
        const res = await updatePassword(auth.currentUser, newPassword);

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

      try {
        const res = await deleteDoc(dataToDelete);

        try {
          await user.delete();
          history.replace('/');
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
              {!imageURL || photoLoading ? (
                <div>
                  <IonSkeletonText
                    animated={true}
                    style={{
                      height: '160px',
                      width: '160px',
                      borderRadius: '50%',
                    }}
                  ></IonSkeletonText>
                  <div style={{ height: '20px' }} />
                </div>
              ) : (
                <>
                  <IonAvatar>
                    <img src={imageURL} />
                  </IonAvatar>
                  <div className="UploadIcon" onClick={chooseImage}>
                    <IonIcon icon={cloudUploadOutline} />
                  </div>
                </>
              )}

              {name ? (
                <IonLabel className="username">{name}</IonLabel>
              ) : (
                <IonSkeletonText
                  animated={true}
                  style={{ height: '30px', width: '70%' }}
                ></IonSkeletonText>
              )}
            </div>
          </div>

          <div className="detailscontainer">
            <div className="detailslist">
              <div
                onClick={() => {
                  setsettingsTrigger(!settingsTrigger);
                }}
                className="settingsIcon"
              >
                <IonIcon icon={!settingsTrigger ? settingsOutline : settings} />
              </div>
              {!settingsTrigger ? (
                <>
                  {' '}
                  <IonLabel>Email Address</IonLabel>
                  {phone && auth.currentUser ? (
                    <IonItem>
                      <IonInput
                        name="email"
                        value={auth.currentUser.email}
                        disabled
                      ></IonInput>
                    </IonItem>
                  ) : (
                    <IonSkeletonText
                      style={{ height: '48px' }}
                      animated={true}
                    ></IonSkeletonText>
                  )}
                  <hr />
                  <hr />
                  <IonLabel>Phone Number</IonLabel>
                  {phone ? (
                    <IonItem>
                      <IonInput value={phone} name="phone" disabled></IonInput>
                    </IonItem>
                  ) : (
                    <IonSkeletonText
                      style={{ height: '48px' }}
                      animated={true}
                    ></IonSkeletonText>
                  )}
                  <hr />
                  <hr />
                  <IonLabel>Label</IonLabel>
                  {label ? (
                    <IonItem>
                      <IonInput name="label" value={label} disabled></IonInput>
                    </IonItem>
                  ) : (
                    <IonSkeletonText
                      style={{ height: '48px' }}
                      animated={true}
                    ></IonSkeletonText>
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
                      <IonSkeletonText
                        style={{ height: '48px' }}
                        animated={true}
                      ></IonSkeletonText>
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
                      <IonSkeletonText
                        style={{ height: '48px' }}
                        animated={true}
                      ></IonSkeletonText>
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
                      <IonSkeletonText
                        style={{ height: '48px' }}
                        animated={true}
                      ></IonSkeletonText>
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
