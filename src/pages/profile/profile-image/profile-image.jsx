import { MainContext } from '../../../utils/Context';
import { useContext, useState } from 'react';
import { IonSkeletonText, IonAvatar, IonLabel, IonIcon } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  cloudUploadOutline,
  checkmarkCircleOutline,
  alertOutline,
} from 'ionicons/icons';
import { storage } from '../../../utils/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
function ProfileImage() {
  const { name, imageURL, presentToast, fetchUserData, database, user } =
    useContext(MainContext);
  const [photoLoading, setPhotoloading] = useState(false);
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
        presentToast({
          message: 'Error Updating Data',
          duration: 1500,
          icon: alertOutline,
          cssClass: 'redToast',
        });
        setPhotoloading(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="profile__image">
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
            <img src={imageURL} alt="profile" />
          </IonAvatar>
          <div className="profile__image__upload-icon" onClick={chooseImage}>
            <IonIcon icon={cloudUploadOutline} />
          </div>
        </>
      )}

      {name ? (
        <IonLabel className="profile__image__username-label">{name}</IonLabel>
      ) : (
        <IonSkeletonText
          animated={true}
          style={{ height: '30px', width: '70%' }}
        ></IonSkeletonText>
      )}
    </div>
  );
}
export default ProfileImage;
