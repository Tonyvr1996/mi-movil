import { IonPage, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonRow, IonGrid, IonCol, IonItem, IonLabel, IonList, IonInput, IonText, IonTextarea, IonButton, IonRouterLink, IonAlert, IonLoading, useIonViewWillLeave, useIonViewWillEnter, IonIcon} from '@ionic/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import {arrowBackOutline, trash} from 'ionicons/icons';
import AxiosDiscapacidades from '../../Services/AxiosDiscapacidades';

const FormularioDiscapacidades = (props:any) => {

    const [editionMode, setEditionMode] = React.useState(useParams<{id:string}>().id !== undefined);
    const [mostrarLoad, setMostrarLoad] = React.useState(false);
    const [nombre, setNombre] = React.useState("");
    const [descrip, setDescrip] = React.useState("");
    const [mensaje, setMensaje] = React.useState("");
    const [mostrarConfirmacion, setMostrarConfirmacion] = React.useState(false);
    const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = React.useState(false);
    const [cargando, setCargando] = React.useState(false);
    const [camposIncompletos, setCamposIncompletos] = React.useState(false);
    const [alerta, setAlerta] = React.useState(false);
    const [alertaEliminar, setAlertaEliminar] = React.useState(false);
    const [codigo, setCodigo] = React.useState("");

    const {id} = useParams<{id:string}>();

    useIonViewWillEnter(() => {
        //console.log('ionViewWillEnter event fired');
        if (editionMode){
            setCargando(true);
            obtener_discapacidad_por_id();
        }
    });

    const obtener_discapacidad_por_id = () => {
        AxiosDiscapacidades.obtener_discapacidad_por_id(id).then( response => {
          setNombre((response.data[0]).nombre);
        //   setNombreLargo((response.data[0]).nombreLargo);
          setCodigo((response.data[0]).codigo);
          setDescrip((response.data[0]).descrip);
          setCargando(false);
        });  
      }

    const actualizar_discapacidad = () => {
        AxiosDiscapacidades.actualizar_discapacidad({"id_discapacidad":id, "codigo":codigo, "nombre": nombre, "descrip": descrip}).then ( response => {
            setCargando(false);
            setMensaje("Registro actualizado satisfactoriamente");
            setAlerta(true);
        });
    }

    const validar = (e:any) => {
        e.preventDefault();
        if (!nombre.trim() || !codigo.trim() || !descrip.trim()){
            setCamposIncompletos(true);
            return;
        }else{
            setMostrarConfirmacion(true)
        }
    }

    useIonViewWillLeave(() => {
        console.log('ionViewWillLeave event fired');
        setNombre("");
        setDescrip("");
        setCodigo("");
    });

    const almacenar_discapacidad = () => {
        AxiosDiscapacidades.almacenar_discapacidad({codigo: codigo, nombre: nombre, descrip: descrip}).then((res:any)=>{
            console.log(res.data);
            setCargando(false);
            setMensaje("Registro almacenado satisfactoriamente")
            setAlerta(true);
        });
    }

    const eliminar = () => {
        setMostrarConfirmacionEliminar(false);
        setMostrarLoad(true);
        AxiosDiscapacidades.eliminar_discapacidad(id).then( res => {
            setMostrarLoad(false);
            setAlertaEliminar(true);
        });
    }

    return (
        <IonPage>
            <IonToolbar color="primary">
                <IonButtons slot="start">
                    {/* <IonBackButton defaultHref="/admin/homediscapacidades"></IonBackButton> */}
                    {/* <IonButton onClick = {() => props.history.push('/admin/homediscapacidades')}>
                        <IonIcon slot="icon-only" icon={arrowBackOutline} />
                    </IonButton> */}
                    <IonButton routerLink="/admin/homediscapacidades">
                        <IonIcon slot="icon-only" icon={arrowBackOutline} />
                    </IonButton>
                </IonButtons>
                <IonTitle >  {editionMode?'Editar Discapacidad':'Registrar discapacidad'} </IonTitle>
                {/* <IonButtons slot="end">
                    <IonButton hidden = {!editionMode?true:false} onClick = {() => setMostrarConfirmacionEliminar(true)} ><IonIcon icon={trash}></IonIcon></IonButton>
                </IonButtons> */}
            </IonToolbar>
            <IonContent fullscreen>
                <form onSubmit = {(e) => validar(e)}>
                    <IonList>
                        <IonGrid>
                            <IonRow class="ion-text-center">
                                <IonCol>
                                    <img style={{marginTop: 20, marginBottom:20 }} src="./assets/img/icons/discapacidades/discapacidad.png"  alt="medicina" />
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>            
                                    <IonItem>
                                        <IonLabel position="stacked">Nombre <IonText color="danger">*</IonText></IonLabel>
                                        <IonInput className = "ion-margin-top" required disabled = {false} type="text" value = {nombre} onIonChange={ (e:any) => setNombre(e.target.value)} ></IonInput>
                                    </IonItem>              
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>            
                                    <IonItem>
                                        <IonLabel position="stacked">Código<IonText color="danger">*</IonText></IonLabel>
                                        <IonInput className = "ion-margin-top" required disabled = {false} type="text" value = {codigo} onIonChange={ (e:any) => setCodigo(e.target.value)} ></IonInput>
                                    </IonItem>              
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>            
                                    <IonItem>
                                        <IonLabel position="stacked">Descripción<IonText color="danger">*</IonText></IonLabel>
                                        <IonTextarea rows = {5} className = "ion-margin-top" required disabled = {false} value = {descrip} onIonChange={ (e:any) => setDescrip(e.target.value)} ></IonTextarea>
                                    </IonItem>              
                                </IonCol>
                            </IonRow>

                            <IonRow style={{marginTop: 20 }} className = "ion-text-center">
                                <IonCol>
                                    <IonButton color="primary" type="submit" class="ion-no-margin">{editionMode?'Guardar cambios':'Guardar'}</IonButton>
                                </IonCol>
                                <IonCol>
                                    <IonButton routerLink="/admin/homemedicamentos" color="danger" class="ion-no-margin">
                                            Cancelar
                                    </IonButton>          
                                </IonCol>
                            </IonRow>

                        </IonGrid>
                    </IonList>
                </form>

                <IonAlert
                    isOpen={mostrarConfirmacion}
                    onDidDismiss={() => setMostrarConfirmacion(false)}
                    header={'Confirmación'}
                    message={editionMode?'¿Desea guardar los nuevos cambios?':'¿Está seguro de agregar esta nueva discapacidad?'}
                    buttons={[         
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'danger',
                        handler: (blah:any) => {
                        setMostrarConfirmacion(false);
                        }
                    },
                    {
                        cssClass: 'success',
                        text: 'Aceptar',
                        handler: () => {
                            if(editionMode){
                                actualizar_discapacidad();
                            }else{
                                almacenar_discapacidad();              
                            }
                        setCargando(true);
                        }
                    }        
                    ]}
                />

                <IonAlert
                    isOpen={camposIncompletos}
                    subHeader={'Datos faltantes:'}
                    message={"Faltan de ingresar datos, vuelva a intentar"}
                    buttons={[          
                    {
                        text: 'Ok',
                        handler: () => {
                        console.log('Aceptar');
                        setCamposIncompletos(false);
                        }
                    },
                    ]}
                />

                <IonLoading
                    isOpen={cargando}
                    message={editionMode?'Cargando datos. Espere por favor...':'Registrando Información. Espere por favor...'}
                />

                <IonAlert
                    isOpen={alerta}
                    onDidDismiss={() => setAlerta(false) }
                    header={mensaje}
                    buttons={[   
                        {
                          text: 'Aceptar',
                          handler: () => {
                            props.history.push('/admin/homediscapacidades');
                          }
                        }
                    ]}
                />

                <IonLoading
                    isOpen={mostrarLoad}
                    message={'Eliminando discapacidad. Espere por favor...'}
                />

                <IonAlert
                    onDidDismiss = {() => setMostrarConfirmacionEliminar(false)}
                    isOpen={mostrarConfirmacionEliminar}
                    header={"Eliminar Discapacidad"}
                    message={'¿Está seguro de eliminar esta discapacidad?'}
                    buttons={[
                        {
                            text: 'No',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                setMostrarConfirmacionEliminar(false);
                            }
                        },
                        {
                            text: 'Si',
                            handler: () => {
                                eliminar();
                            }
                        }
                    ]}
                />

                <IonAlert
                    isOpen={alertaEliminar}
                    onDidDismiss={() => setAlertaEliminar(false) }
                    header={"Registro eliminado satisfactoriamente"}
                    buttons={[   
                        {
                          text: 'Aceptar',
                          handler: () => {
                            props.history.push('/admin/homediscapacidades');
                          }
                        }
                    ]}
                />

            </IonContent>
        </IonPage>
    )
}

export default FormularioDiscapacidades
