import './header.css';
import { IonTitle, IonToolbar } from '@ionic/react';

const Header = () => {
  return (
    <IonToolbar>
      <IonTitle class="ion-text-center header-title">
        <img alt="logo" width={80} height={80} src="assets/logofalet.png" />
      </IonTitle>
    </IonToolbar>
  );
};

export default Header;
