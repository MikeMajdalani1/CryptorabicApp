import {
  IonContent,
  IonHeader,
  IonLabel,
  IonIcon,
  IonButton,
  IonModal,
  IonToolbar,
  IonButtons,
  IonItem,
  IonInput,
  IonTextarea,
} from '@ionic/react';
import { alertOutline, closeOutline, newspaper } from 'ionicons/icons';
import { useState, useContext } from 'react';
import { storage } from '../../../../utils/firebaseConfig';
import { MainContext } from '../../../../utils/Context';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addDocument } from '../../../../utils/firebase-functions';
function NewsModal({ isNewslModalOpen, setNewslModalOpen }) {
  const [NewsInputs, setNewsInputs] = useState({
    title: '',
    content: '',
    link: '',
  });
  const [isUploadingImage, setisUploadingImage] = useState(false);
  const { presentToast } = useContext(MainContext);
  const handleNewsChange = (e) => {
    setNewsInputs((previousState) => ({
      ...previousState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNewsRegister = async (e) => {
    e.preventDefault();

    if (NewsInputs.title === '' || NewsInputs.content === '') {
      presentToast({
        message: 'Please provide the required inputs',
        duration: 4000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      let imagePath;
      try {
        const starsRefDownload = ref(
          storage,
          `/files/${NewsInputs.title.replace(' ', '_')}.png`
        );

        imagePath = await getDownloadURL(starsRefDownload);
      } catch (error) {
        imagePath = '';
      }
      const data = {
        title: NewsInputs.title,
        content: NewsInputs.content,
        link: NewsInputs.link,
        imageURL: imagePath,
      };

      const res = await addDocument('news', data);
      if (res.success) {
        setNewslModalOpen(false);
      } else {
        presentToast({
          message: 'An Error has occured, restart the app',
          duration: 2000,
          icon: alertOutline,
          cssClass: 'redToast',
        });
      }
    }
  };
  const chooseImage = async () => {
    if (NewsInputs.title !== '') {
      try {
        setisUploadingImage(true);
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Photos,
        });

        const rawData = atob(image.base64String);
        const bytes = new Array(rawData.length);
        for (var x = 0; x < rawData.length; x++) {
          bytes[x] = rawData.charCodeAt(x);
        }
        const arr = new Uint8Array(bytes);
        const blob = new Blob([arr], { type: 'image/png' });

        const storageRef = ref(
          storage,
          `/files/${NewsInputs.title.replace(' ', '_')}.png`
        );

        await uploadBytesResumable(storageRef, blob);
        setisUploadingImage(false);
      } catch (error) {
        alert(error.message);
      }
    } else {
      presentToast({
        message: 'Insert a title before uploading image',
        duration: 1500,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    }
  };

  return (
    <IonModal
      isOpen={isNewslModalOpen}
      content="container"
      onWillDismiss={() => {
        setNewsInputs({
          title: '',
          content: '',
          link: '',
        });
      }}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setNewslModalOpen(false)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="news-modal">
          <div className="modal-container">
            <div className="modal-container__header">
              <IonIcon style={{ fontSize: '60px' }} icon={newspaper}></IonIcon>
              <h3>Add News</h3>
            </div>
            <IonItem>
              <div className="modal-container__form">
                <IonItem className="border">
                  <IonInput
                    name="title"
                    value={NewsInputs.title}
                    placeholder="* Title"
                    required
                    onIonInput={handleNewsChange}
                  ></IonInput>
                </IonItem>

                <IonItem className="border">
                  <IonTextarea
                    value={NewsInputs.content}
                    name="content"
                    placeholder="* Content"
                    autoGrow
                    onIonChange={handleNewsChange}
                  ></IonTextarea>
                </IonItem>
                <IonButton
                  disabled={isUploadingImage}
                  size="default"
                  onClick={chooseImage}
                >
                  {isUploadingImage ? 'Uploading...' : 'Attach Image'}
                </IonButton>
                <IonItem className="border">
                  <IonInput
                    value={NewsInputs.link}
                    name="link"
                    placeholder="Link"
                    onIonInput={handleNewsChange}
                  ></IonInput>
                </IonItem>

                <IonButton
                  disabled={isUploadingImage}
                  size="large"
                  onClick={handleNewsRegister}
                >
                  Add News
                </IonButton>
              </div>
            </IonItem>

            <IonLabel class="modal-container__disclaimer ">
              * Required Field
              <br />
              <br />
              Please not that in this version of the app, you can't update your
              news after it is published
            </IonLabel>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
export default NewsModal;
