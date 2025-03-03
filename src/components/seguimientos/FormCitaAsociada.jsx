import { IonPage, IonToolbar, IonButtons, IonDatetime, IonSelectOption, IonSelect, IonBackButton, IonTitle, IonContent, IonRow, IonGrid, IonCol, IonItem, IonLabel, IonList, IonInput, IonText, IonTextarea, IonButton, IonRouterLink, IonAlert, IonLoading, useIonViewWillLeave, useIonViewWillEnter, IonIcon } from '@ionic/react'
import React from 'react'
import { arrowBackOutline, trash } from 'ionicons/icons';
import Auth from '../../Login/Auth';
import AxiosPersonas from '../../Services/AxiosPersonas';
import AxiosCitas from '../../Services/AxiosCitas';

export default class FormAgendadoCita extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cita: {},
            editMode: null,
            pacientes: []
        }

    }

    processCitaData() {
        let date = new Date(this.state.cita.date).toISOString();
        let start = new Date(this.state.cita.start).toISOString();
        let end = new Date(this.state.cita.end).toISOString();
        let medico = Auth.getDataUser().cedula;
        let inicio_cita = date.split("T")[0] + "T" + start.split("T")[1];
        let fin_cita = date.split("T")[0] + "T" + end.split("T")[1];
        return { fin_cita, inicio_cita, medico, estado: "P" }
    }

    getRoute(posFix = "") {
        if (Auth.isMedico()) return "/medico" + posFix;
        if (Auth.isPaciente()) return "/paciente" + posFix;
        return "/cuidador" + posFix;
    }

    componentDidMount() {
        this.setState({...this.props.match.params });
    }



    saveCita() {
        this.setState({ loading: true });
        console.log({ ...this.state.cita, ...this.processCitaData() })
        AxiosCitas.agendarCita({ ...this.state.cita, ...this.processCitaData() }).then(resp => {
            console.log(resp);
            this.setState({ loading: false, alerta: true, cita: {} });
        }).catch(err => {
            console.log(err);
            this.setState({ loading: false });
        });
    }

    handleChange(e) {
        this.setState({
            cita: {
                ...this.state.cita,
                [e.target.name]: e.target.value
            }
        });
    }


    render() {
        return (
            <IonPage>
                <IonToolbar color="primary">
                    <IonButtons slot="start">

                        <IonButton routerLink={this.getRoute("/seguimiento/citasasociadas/") + this.props.match.params.seguimiento}>
                            <IonIcon slot="icon-only" icon={arrowBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle >  {this.state.editMode ? 'Editar Cita' : 'Agendar Cita'} </IonTitle>
                </IonToolbar>

                <IonContent fullscreen>
                    <form onSubmit={(e) => { e.preventDefault(); console.log(this.state.cita); this.setState({ confirmSave: true }) }}>
                        <IonList>
                            <IonGrid>
                                <IonRow class="ion-text-center">
                                    <IonCol>
                                        <img style={{ marginTop: 20, marginBottom: 20 }} src="./assets/img/icons/usuarios/usuario.png" alt="usuario" />
                                    </IonCol>
                                </IonRow>


                                <IonRow>
                                    <IonCol>
                                        <IonItem>
                                            <IonLabel position="stacked">Fecha de la Cita<IonText color="danger">*</IonText></IonLabel>
                                            <IonDatetime onIonChange={e => this.handleChange(e)} name="date" value={this.state.cita.date ? this.state.cita.date : ""} placeholder="Seleccione una fecha"></IonDatetime>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonItem>
                                            <IonLabel position="stacked">Hora Inicio de la Cita<IonText color="danger">*</IonText></IonLabel>
                                            <IonDatetime onIonChange={e => this.handleChange(e)} name="start" value={this.state.cita.start ? this.state.cita.start : ""} displayFormat="h:mm A" pickerFormat="h:mm A" placeholder="Seleccione una hora"></IonDatetime>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonItem>
                                            <IonLabel position="stacked">Hoa Fin de la Cita<IonText color="danger">*</IonText></IonLabel>
                                            <IonDatetime onIonChange={e => this.handleChange(e)} name="end" value={this.state.cita.end ? this.state.cita.end : ""} displayFormat="h:mm A" pickerFormat="h:mm A" placeholder="Seleccione una hora"></IonDatetime>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonItem>
                                            <IonLabel position="stacked">Comentario<IonText color="danger">*</IonText></IonLabel>
                                            <IonTextarea rows={2} className="ion-margin-top" name="init_comment" disabled={false} value={this.state.cita.init_comment} onIonChange={e => this.handleChange(e)} ></IonTextarea>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                <IonRow style={{ marginTop: 20 }} className="ion-text-center">
                                    <IonCol>
                                        <IonButton color="primary" type="submit" class="ion-no-margin">{!this.state.editMode ? 'Agendar cita' : 'Guaradar cambios'}</IonButton>
                                    </IonCol>
                                    <IonCol>
                                        <IonButton routerLink={this.getRoute("/seguimiento/citasasociadas/") + this.props.match.params.seguimiento} color="danger" class="ion-no-margin">
                                            Cancelar
                                        </IonButton>
                                    </IonCol>
                                </IonRow>

                            </IonGrid>
                        </IonList>
                    </form>

                    <IonAlert
                        isOpen={this.state.confirmSave}
                        onDidDismiss={() => this.setState({ confirmSave: false })}
                        header={'Confirmación'}
                        message={this.state.editMode ? '¿Desea guardar los nuevos cambios?' : '¿Está seguro agendar esta nueva cita?'}
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'danger',
                                handler: (e) => {
                                    this.setState({ confirmSave: false })
                                }
                            },
                            {
                                cssClass: 'success',
                                text: 'Aceptar',
                                handler: () => {
                                    if (this.state.editMode) {
                                        this.updateCita();
                                    } else {
                                        this.saveCita();
                                    }

                                }
                            }
                        ]}
                    />

                    <IonLoading
                        isOpen={this.state.loading}
                        message={this.state.editMode ? 'Guardando datos. Espere por favor...' : 'Registrando Información. Espere por favor...'}
                    />

                    <IonLoading
                        isOpen={this.state.isLoadingGet}
                        message={'Cargando datos. Espere por favor...'}
                    />

                    <IonAlert
                        isOpen={this.state.alerta}
                        onDidDismiss={() => this.setState({ alerta: false })}
                        header={"Cita Guardada"}
                        buttons={[
                            {
                                text: 'Aceptar',
                                handler: () => {
                                    this.props.history.push(this.getRoute("/seguimiento/citasasociadas/") + this.props.match.params.seguimiento);
                                }
                            }
                        ]}
                    />
                </IonContent>

            </IonPage>
        );
    }
}