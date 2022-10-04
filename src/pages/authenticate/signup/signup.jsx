import {
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonGrid,
  IonButton,
} from "@ionic/react";

const Signup = () => {
  return (
    <form>
      <IonGrid>
        <IonRow color="primary" justify-content-center>
          <IonCol align-self-center size-md="6" size-lg="5" size-xs="12">
            <div text-center>
              <h3>Create your account!</h3>
            </div>
            <div padding>
              <IonItem>
                <IonInput
                  name="name"
                  type="text"
                  placeholder="Name"
                  ngModel
                  required
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  ngModel
                  required
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  ngModel
                  required
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  name="confirm"
                  type="password"
                  placeholder="Password again"
                  ngModel
                  required
                ></IonInput>
              </IonItem>
            </div>
            <div padding>
              <IonButton size="large" type="submit" expand="block">
                Register
              </IonButton>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </form>
  );
};
export default Signup;
