import {
  IonContent,
  IonAvatar,
  IonHeader,
  IonPage,
  IonList,
  IonLabel,
  IonItem,
  IonInput,
} from "@ionic/react";

import Header from "../../components/header/header";
import "./profile.css";

const Profile: React.FC = () => {
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
            <IonLabel>Joe Nassar, 24</IonLabel>
          </div>
          <div className="detailscontainer">
            <div className="detailslist">
              <IonList>
                <IonItem>
                  <IonInput
                    value="t"
                    placeholder="Enter Input"
                    clearInput
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    value="t"
                    placeholder="Enter Input"
                    clearInput
                  ></IonInput>
                </IonItem>
              </IonList>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
