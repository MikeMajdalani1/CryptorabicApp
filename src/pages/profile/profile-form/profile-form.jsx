import {
  changeEmail,
  changePasswordFn,
  deleteUserFn,
  signOutUser,
  updateDocument,
} from '../../../utils/firebase-functions';
import {
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSkeletonText,
} from '@ionic/react';
import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { emailRegex } from '../../../utils/regexes';
import { MainContext } from '../../../utils/Context';
import { useHistory } from 'react-router-dom';
import { checkFullNumber } from '../../../utils/functions';
import {
  cloudUploadOutline,
  checkmarkCircleOutline,
  alertOutline,
  settingsOutline,
  settings,
  caretUpCircle,
} from 'ionicons/icons';
import { reauthenticateWithCredentials } from '../../../utils/firebase-functions';
function ProfileForm() {
  const {
    reAuth,
    presentToast,
    user,
    auth,
    fetchUserData,
    name,
    label,
    phone,
    email,
  } = useContext(MainContext);
  const [settingsTrigger, setsettingsTrigger] = useState(false);
  const [ProfileInputs, setProfileInputs] = useState({
    email: '',
    phone: '',
    label: '',
  });
  const [passwordInput, SetPasswordInput] = useState({
    password: '',
  });
  const history = useHistory();

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

  const singOut = async () => {
    const res = await signOutUser();
    if (res.success) {
      history.replace('/');
    }
  };

  //function to change password
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
                const res = await reauthenticateWithCredentials(oldPassword);
                if (res.success) {
                  const res2 = await changePasswordFn(newPassword);
                  if (res2.success) {
                    presentToast({
                      message: 'Password Changed Successfully',
                      duration: 2500,
                      icon: checkmarkCircleOutline,
                    });
                  } else {
                    presentToast({
                      message: 'Error accured, please contact admins',
                      duration: 1500,
                      icon: alertOutline,
                      cssClass: 'redToast',
                    });
                  }
                } else {
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
          SetPasswordInput({ password: '' });
        },
      });
    }
  };

  const updateEmailCallback = async (alertData) => {
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
      const res = await reauthenticateWithCredentials(oldPassword);
      if (res.success) {
        const res2 = await changeEmail(ProfileInputs.email);
        if (res2.success) {
          presentToast({
            message: 'Email got changed',
            duration: 1500,
            icon: checkmarkCircleOutline,
          });
        } else {
          presentToast({
            message: 'Error has occured',
            duration: 1500,
            icon: alertOutline,
            cssClass: 'redToast',
          });
        }
      } else {
        presentToast({
          message: 'Wrong Password',
          duration: 1500,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      }
    }
  };
  //function to handle all data updates
  const updateData = async (field) => {
    switch (field) {
      //-------------------------------------------------
      case 'email':
        if (!emailRegex.test(String(ProfileInputs.email).toLowerCase())) {
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
                handler: updateEmailCallback,
              },
            ],
            onDidDismiss: () => {},
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
          const res = await updateDocument('users', user?.uid, {
            phone: ProfileInputs.phone,
          });
          if (res.success) {
            fetchUserData();
            presentToast({
              message: 'Data Successfully Updated',
              duration: 1500,
              icon: checkmarkCircleOutline,
            });
            break;
          } else {
            presentToast({
              message: 'Error Updating Data',
              duration: 1500,
              icon: alertOutline,
              cssClass: 'redToast',
            });
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
          const res = await updateDocument('users', user?.uid, {
            label: ProfileInputs.label,
          });
          if (res.success) {
            fetchUserData();
            presentToast({
              message: 'Data Successfully Updated',
              duration: 1500,
              icon: checkmarkCircleOutline,
            });
            break;
          } else {
            presentToast({
              message: 'Error Updating Data',
              duration: 1500,
              icon: alertOutline,
              cssClass: 'redToast',
            });
            break;
          }
        }
      default:
        break;
      //-------------------------------------------------
    }
  };

  //function to delete user
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
              const res = await reauthenticateWithCredentials(oldPassword);
              if (res.success) {
                const res2 = await deleteUserFn();
                if (res2.success) {
                  history.replace('/');
                } else {
                  presentToast({
                    message: 'Error accured, please contact admins',
                    duration: 1500,
                    icon: alertOutline,
                    cssClass: 'redToast',
                  });
                }
              } else {
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
        SetPasswordInput({ password: '' });
      },
    });
  };

  return (
    <div className="profile__form">
      <div className="profile__form__list">
        <div
          onClick={() => {
            setsettingsTrigger(!settingsTrigger);
          }}
          className="profile__form__list__settings-icon"
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
            <div className="profile__form__list__guides">
              <div className="profile__form__list__guides__items">
                <IonIcon
                  className="profile__form__list__guides__icon"
                  icon={settingsOutline}
                ></IonIcon>
                <IonLabel> Settings View </IonLabel>
              </div>
              <div className="profile__form__list__guides__items">
                <IonIcon
                  className="profile__form__list__guides__icon"
                  icon={caretUpCircle}
                ></IonIcon>
                <IonLabel> Update Data </IonLabel>
              </div>
              <div className="profile__form__list__guides__items">
                <IonIcon
                  className="profile__form__list__guides__icon"
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
            <div className="profile__form__list__update-content">
              {phone ? (
                <IonItem>
                  <IonInput
                    className="profile__form__list__update-content--nopadding"
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
                className="profile__form__list__update-icon"
                onClick={() => updateData('email')}
              >
                <IonIcon icon={caretUpCircle}></IonIcon>
              </div>
            </div>
            <hr />
            <hr />
            <IonLabel>Phone Number</IonLabel>
            <div className="profile__form__list__update-content">
              {phone ? (
                <IonItem>
                  <IonInput
                    className="profile__form__list__update-content--nopadding"
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
                className="profile__form__list__update-icon"
                onClick={() => updateData('phone')}
              >
                <IonIcon icon={caretUpCircle}></IonIcon>
              </div>
            </div>
            <hr />
            <hr />
            <IonLabel>Label</IonLabel>
            <div className="profile__form__list__update-content">
              {label ? (
                <IonItem>
                  <IonInput
                    className="profile__form__list__update-content--nopadding"
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
                className="profile__form__list__update-icon"
                onClick={() => updateData('label')}
              >
                <IonIcon icon={caretUpCircle}></IonIcon>
              </div>
            </div>
            <hr />
            <hr />
            <IonLabel>Change Password</IonLabel>
            <div className="profile__form__list__update-content">
              <IonItem>
                <IonInput
                  className="profile__form__list__update-content--nopadding"
                  name="password"
                  value={passwordInput.password}
                  onIonInput={handlePasswordChange}
                  placeholder="Enter New Password"
                ></IonInput>
              </IonItem>

              <div
                className="profile__form__list__update-icon"
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
  );
}
export default ProfileForm;
