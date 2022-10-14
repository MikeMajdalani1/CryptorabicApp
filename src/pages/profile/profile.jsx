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
} from '@ionic/react';
import { getAuth, signOut } from 'firebase/auth';
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
import { Puff } from 'react-loader-spinner';

const Profile = () => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [ProfileInputs, setProfileInputs] = useState({
    email: '',
    phone: '',
    label: '',
  });

  const [presentAlert] = useIonAlert();

  const db = collection(database, 'users');
  const history = useHistory();
  const singOut = () => {
    signOut(auth);
    history.replace('/login');
  };

  const handleProfileChange = (e) => {
    setProfileInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchUserName = async () => {
    try {
      const q = query(
        collection(database, 'users'),
        where('__name__', '==', user?.uid)
      );
      const doc = await getDocs(q);

      const data = doc.docs[0].data();

      setName(data.username);
      setPhone(data.phone);
      setEmail(data.email);
      setProfileInputs({
        email: data.email,
        phone: data.phone,
        label: '',
      });
      console.log(ProfileInputs);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };
  useEffect(() => {
    fetchUserName();
  }, []);

  const deleteData = async () => {
    let dataToDelete = doc(database, 'users', user?.uid);
    try {
      const res = await deleteDoc(dataToDelete);
      console.log(res);
    } catch (error) {
      alert(error.message);
    }
    try {
      user.delete();
    } catch (error) {
      alert(error.message);
    }
    history.replace('/login');
  };

  const updateData = async () => {
    let dataToUpdate = doc(db, 'users', user?.uid);
    try {
      const res = await updateDoc(dataToUpdate, {
        phone: ProfileInputs.phone,
        label: ProfileInputs.name,
      });
      console.log(res);
    } catch (error) {
      alert(error.message);
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
            <IonAvatar>
              <img
                alt="Silhouette of a person's head"
                src="assets/joenassar.png"
              />
            </IonAvatar>
            {name ? (
              <IonLabel className="username">{name}</IonLabel>
            ) : (
              <Puff
                height="40"
                width="40"
                radius={1}
                color="#fff"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            )}
          </div>
          <div className="detailscontainer">
            <div className="detailslist">
              <IonLabel>Email Address</IonLabel>
              <IonItem>
                <IonInput
                  name="email"
                  value={ProfileInputs.email}
                  onIonInput={handleProfileChange}
                  placeholder="Email Address"
                ></IonInput>
              </IonItem>
              <hr />
              <hr />

              <IonLabel>Phone Number</IonLabel>
              <IonItem>
                <IonInput
                  value={ProfileInputs.phone}
                  name="phone"
                  onIonInput={handleProfileChange}
                  placeholder="Phone Number"
                ></IonInput>
              </IonItem>
              <hr />
              <hr />

              <IonLabel>Label</IonLabel>
              <IonItem>
                <IonInput
                  name="label"
                  value={ProfileInputs.label}
                  onIonInput={handleProfileChange}
                  placeholder="Ex: The Dip Buyer"
                ></IonInput>
              </IonItem>
              <hr />
              <hr />
              <IonButton className="gridstretch" onClick={updateData}>
                Update Info
              </IonButton>

              <IonButton color="dark" onClick={singOut} expand="block">
                Sign Out
              </IonButton>
              <IonButton
                color="danger"
                expand="block"
                onClick={() =>
                  presentAlert({
                    header: 'Alert',
                    message: 'Are you sure you want to delete your account?',
                    buttons: [
                      {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {},
                      },
                      {
                        text: 'Delete',
                        role: 'confirm',
                        handler: () => {
                          deleteData();
                        },
                      },
                    ],
                    onDidDismiss: () => console.log('dismiised'),
                  })
                }
              >
                Delete Account
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
