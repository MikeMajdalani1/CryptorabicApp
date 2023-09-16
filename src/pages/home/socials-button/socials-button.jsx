import { logoTiktok, logoInstagram, caretUp } from 'ionicons/icons';
import { IonFab, IonFabButton, IonIcon, IonFabList } from '@ionic/react';
function SocialsButton() {
  return (
    <IonFab horizontal="end" vertical="bottom" slot="fixed">
      <IonFabButton color="secondary">
        <IonIcon icon={caretUp}></IonIcon>
      </IonFabButton>
      <IonFabList side="top">
        <IonFabButton href="https://tiktok.com/@cryptorabic" color="primary">
          <IonIcon icon={logoTiktok}></IonIcon>
        </IonFabButton>
        <IonFabButton href="https://instagram.com/cryptorabic" color="primary">
          <IonIcon icon={logoInstagram}></IonIcon>
        </IonFabButton>
      </IonFabList>
    </IonFab>
  );
}
export default SocialsButton;
