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
  IonRadioGroup,
  IonList,
  IonRadio,
} from '@ionic/react';
import { useState, useContext } from 'react';
import { MainContext } from '../../../../utils/Context';
import { alertOutline, closeOutline, trendingUp } from 'ionicons/icons';
import { addDocument } from '../../../../utils/firebase-functions';
function SignalModel({ isSignalModalOpen, setSignalModalOpen }) {
  const { presentToast, imageURL } = useContext(MainContext);

  const [SignalInputs, setSignalInputs] = useState({
    market: '',
    stoploss: '',
    risk: 'low',
    position: 'long',
    entry: '',
    tps: ['', '', '', ''],
  });

  const handleChange = (fieldName, e) => {
    setSignalInputs((previousState) => ({
      ...previousState,
      [fieldName]: e.target.value,
    }));
  };

  const handleTPChange = (e, index) => {
    setSignalInputs((previousState) => ({
      ...previousState,
      tps: SignalInputs.tps.map((tp, i) => {
        if (i === index) return e.target.value;
        return tp;
      }),
    }));
  };

  const handleSignalRegister = async (e) => {
    e.preventDefault();
    if (SignalInputs.market === '') {
      presentToast({
        message: 'The market input is required!',
        duration: 4000,
        icon: alertOutline,
        cssClass: 'redToast',
      });
    } else {
      const data = {
        imageURL: imageURL,
        market: SignalInputs.market,
        stoploss: SignalInputs.stoploss === '' ? 'NaN' : SignalInputs.stoploss,
        entry: SignalInputs.entry === '' ? 'NaN' : SignalInputs.entry,
        tps:
          SignalInputs.tps[0] === '' ? ['NaN', '', '', ''] : SignalInputs.tps,
        risk: SignalInputs.risk,
        position: SignalInputs.position,
      };

      const res = await addDocument('signals', data);
      if (res.success) {
        setSignalModalOpen(false);
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

  return (
    <IonModal
      isOpen={isSignalModalOpen}
      content="container"
      onWillDismiss={() =>
        setSignalInputs({
          market: '',
          stoploss: '',
          risk: 'low',
          position: 'long',
          entry: '',
          tps: ['', '', '', ''],
        })
      }
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setSignalModalOpen(false)}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="signal-modal">
          <div className="modal-container">
            <div className="modal-container__header">
              <IonIcon style={{ fontSize: '60px' }} icon={trendingUp}></IonIcon>
              <h3>Add a signal</h3>
            </div>
            <IonItem>
              <div className="modal-container__form">
                <IonItem className="border">
                  <IonInput
                    name="market"
                    value={SignalInputs.market}
                    placeholder="* Market"
                    required
                    onIonInput={(e) => handleChange('market', e)}
                  ></IonInput>
                </IonItem>
                <IonList>
                  <IonRadioGroup
                    allowEmptySelection={false}
                    onIonChange={(e) => handleChange('position', e)}
                    value={SignalInputs.position}
                  >
                    <IonItem>
                      <IonLabel style={{ lineHeight: '25px' }}>
                        Long Position
                      </IonLabel>
                      <IonRadio slot="end" value="long"></IonRadio>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Short Position</IonLabel>
                      <IonRadio slot="end" value="short"></IonRadio>
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
                <IonItem className="border">
                  <IonInput
                    value={SignalInputs.entry}
                    name="entry"
                    placeholder="Entry Price"
                    required
                    type="number"
                    onIonInput={(e) => handleChange('entry', e)}
                  ></IonInput>
                </IonItem>
                <IonItem className="border">
                  <IonInput
                    value={SignalInputs.stoploss}
                    name="stoploss"
                    type="number"
                    placeholder="Stop Loss"
                    required
                    onIonInput={(e) => handleChange('stoploss', e)}
                  ></IonInput>
                </IonItem>

                <IonList>
                  <IonRadioGroup
                    allowEmptySelection={false}
                    value={SignalInputs.risk}
                    onIonChange={(e) => handleChange('risk', e)}
                  >
                    <IonItem>
                      <IonLabel>Low Risk</IonLabel>
                      <IonRadio slot="end" value="low"></IonRadio>
                    </IonItem>

                    <IonItem>
                      <IonLabel>Medium Risk</IonLabel>
                      <IonRadio slot="end" value="medium"></IonRadio>
                    </IonItem>

                    <IonItem>
                      <IonLabel style={{ lineHeight: '25px' }}>
                        High Risk
                      </IonLabel>
                      <IonRadio slot="end" value="high"></IonRadio>
                    </IonItem>
                  </IonRadioGroup>
                </IonList>
                <div className="signal-model__tps">
                  <IonItem className="border">
                    <IonInput
                      value={SignalInputs.tps[0]}
                      type="number"
                      placeholder="TP1"
                      required
                      onIonInput={(e) => handleTPChange(e, 0)}
                    ></IonInput>
                  </IonItem>
                  <IonItem className="border">
                    <IonInput
                      value={SignalInputs.tps[1]}
                      type="number"
                      placeholder="TP2"
                      onIonInput={(e) => handleTPChange(e, 1)}
                    ></IonInput>
                  </IonItem>
                  <IonItem className="border">
                    <IonInput
                      value={SignalInputs.tps[2]}
                      type="number"
                      placeholder="TP3"
                      onIonInput={(e) => handleTPChange(e, 2)}
                    ></IonInput>
                  </IonItem>
                  <IonItem className="border">
                    <IonInput
                      value={SignalInputs.tps[3]}
                      type="number"
                      placeholder="TP4"
                      onIonInput={(e) => handleTPChange(e, 3)}
                    ></IonInput>
                  </IonItem>
                </div>

                <IonButton size="large" onClick={handleSignalRegister}>
                  Add Signal
                </IonButton>
              </div>
            </IonItem>
            <IonLabel class="modal-container__disclaimer">
              * Required Field
              <br />
              <br />
              Please not that in this version of the app, you can't update a
              signal after it is published
            </IonLabel>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
export default SignalModel;
