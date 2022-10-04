import {
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonLabel,
} from "@ionic/react";
import { useContext, useState, useRef } from "react";
import { UserContext } from "../../../App";
import Signup from "../signup/signup";
import "./login.css";
import { Route } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import { OverlayEventDetail } from "@ionic/core/components";

const Login = () => {
  const user = useContext(UserContext);

  const loginClick = () => {
    user.setIsLoggedIn(true);
  };

  const modal = useRef();
  const input = useRef();

  const [message, setMessage] = useState(
    "This modal example uses triggers to automatically open a modal when the button is clicked."
  );

  function confirm() {
    modal.current?.dismiss(input.current?.value, "confirm");
  }

  function onWillDismiss(ev) {
    if (ev.detail.role === "confirm") {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }

  return (
    <div className="container">
      <div className="info">
        <div className="logoandtext">
          <img alt="logo" width={120} height={120} src="assets/logofalet.png" />
          <h3>Be part of our beloved crypto community by signing in</h3>
        </div>
        <form className="form">
          <IonItem className="border">
            <IonInput
              name="email"
              type="email"
              placeholder="Email"
              required
            ></IonInput>
          </IonItem>
          <IonItem className="border">
            <IonInput
              name="password"
              type="password"
              placeholder="Password"
              required
            ></IonInput>
          </IonItem>

          <IonButton
            size="large"
            type="submit"
            onSubmit={loginClick}
            expand="block"
          >
            Sign In
          </IonButton>
          <span className="forgot">Forgot password?</span>
        </form>

        <div className="signup">
          <h4> New to Cryptorabic?</h4>{" "}
          <IonButton id="open-modal">Sign Up</IonButton>
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger="open-modal"
        onWillDismiss={(ev) => onWillDismiss(ev)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle>Welcome</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => confirm()}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="stacked">Enter your name</IonLabel>
            <IonInput ref={input} type="text" placeholder="Your name" />
          </IonItem>
        </IonContent>
      </IonModal>
    </div>
  );
};
export default Login;
