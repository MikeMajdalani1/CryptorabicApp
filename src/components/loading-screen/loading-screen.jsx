import { IonSpinner } from '@ionic/react';

const loadingScreen = () => {
  return (
    <div className="center-page">
      <IonSpinner
        className="spinner"
        color="light"
        name="crescent"
      ></IonSpinner>
    </div>
  );
};

export default loadingScreen;
