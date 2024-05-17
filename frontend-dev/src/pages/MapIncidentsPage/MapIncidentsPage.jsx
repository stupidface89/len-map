import YaMap from "../../components/YaMap/YaMap";
import {Button} from "primereact/button";
import {Sidebar} from "primereact/sidebar";
import {Toast} from "primereact/toast";
import React, {useEffect, useRef, useState} from "react";
import {useFormik} from "formik";

import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {InputMask} from "primereact/inputmask";
import Image from "../../components/Image/Image"

import {urls, client} from "../../api/client";
import useSubmitForm from "../../hooks/useSubmitForm";
import fileToBase64 from "../../tools/fileToBase64";
import bytesForHuman from "../../tools/bytesForHuman";
import {Checkbox} from "primereact/checkbox";
import {Tag} from "primereact/tag";
import {Link} from "react-router-dom";
import {Dialog} from "primereact/dialog";


const mapFormClass = `
    .sidebar {
        width: 380px;
    }
    
    label {
        display: block;
        margin: 5px 0;
        font-size: .9rem;
        opacity: .7;
    }
    
    .p-inputtext-sm::placeholder {
        opacity: .4
    }
    
    .upload-file-button {
        padding: 10px 10px;
        background-color: #ff2828;
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        width: fit-content;
        border-radius: 5px;
        transition: background-color .3s, opacity .3s, box-shadow .3s;
        &:hover {
            background-color: #b51414;
        }
        &:active {
            box-shadow: 0 0 0px 2px white, 
                        0 0 0 4px red;
        }
    }
`

const IncidentsMap = () => {
    const [data, setData] = useState(null);
    const [createdIncident, setCreatedIncident] = useState()
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [isVisibleSidebar, setIsVisibleSidebar] = useState(false);
    const [isVisibleSuccess, setIsVisibleSuccess] = useState(false);
    const [isVisibleSidebarForm, setIsVisibleSidebarForm] = useState(false);

    const [acceptConfidentialData, setAcceptConfidentialData] = useState(false);
    const messageRef = useRef();

    const [submitForm, isLoadingForm, errorForm] = useSubmitForm(async (formData) => {
        const response = await client.post(urls.get_create_incidents, formData);
        if(response.status === 201 && response.data){
            setCreatedIncident(response.data);
            formik.resetForm()
        }
    });


    useEffect(()=> {
        if(createdIncident) {
            setIsVisibleSidebar(false);
            setIsCreateMode(false);
            setIsVisibleSuccess(true);
        }
    },[createdIncident]);

    useEffect(() => {
        // При переходе по ссылке, включается "режим" создания обращения
        const params = new URLSearchParams(window.location.search)
        if(params.get('create-new') === 'true'){
            setIsCreateMode(true);
            setAcceptConfidentialData(false);
            showMessage();
        }
    }, []);

    const initValues = {
        text: "",
        full_name: "",
        phone_number: "",
        address: null,
        latitude: null,
        longitude: null,
        photo: [],
    }

    const validator = (values) => {
        const errors = {}

        Object.keys(values).forEach(key => {
            if(values[key] === null || values[key] === '') {
                errors[key] = 'Поле не может быть пустым';

            } else if(typeof values[key] === 'string' && values[key].length < 5){
                errors[key] = 'В поле не может быть менее чем 5 символов'
            } else if(key === 'photo' && values[key].length === 0){
                errors[key] = 'Загрузите хотя бы одну фотографию'
            }

            if(values.text.length > 350) {
                errors['text'] = `В поле не может быть более 350 символов, сейчас ${values.text.length}`;
            }

        });

        return errors;
    }

    const formik= useFormik({
        validate: validator,
        validateOnChange: false,
        validateOnBlur: false,
        initialValues: initValues,
        onSubmit: async (values) => {
            await submitForm(values)
        }
    })

    const showMessage = () => {
        messageRef.current.clear()
        messageRef.current.show({
            severity: 'warn',
            summary: 'Выберите место с проблемой на карте, о которой Вы хотели бы сообщить.',
            sticky: true,
            content: (props) => (
                <div className="flex flex-column align-items-left" style={{flex: '1'}}>
                    <i className={"pi pi-map-marker"} style={{marginRight: "5px"}}></i>
                    <span style={{fontWeight: "600"}}>Для того, чтобы создать обращение:</span>
                    <div className="font-medium my-3 text-900" style={{marginTop: ".5rem", fontSize: ".9rem"}}>
                        <span style={{fontWeight: 600}}> Шаг 1. </span>
                        <span>{props.message.summary}</span>
                    </div>
                </div>
            )
        });
    };

    useEffect(() => {
        if(isCreateMode === false) {
            formik.resetForm()
            setAcceptConfidentialData(false);
            setIsVisibleSidebarForm(false);
        }
    }, [isCreateMode]);


    useEffect(() => {
        if(data?.address) {
            setIsVisibleSidebar(true);
            formik.setFieldValue('address', data.address)
            formik.setFieldValue('latitude', data.coords[0])
            formik.setFieldValue('longitude', data.coords[1])
        }
    }, [data]);

    const validateImage = (file) => {
        const size_limit = 14.9 * 1024 * 1024;

        if(file?.size > size_limit){
            formik.setErrors({photo: `Размер файла превыешает допустимый ${bytesForHuman(size_limit)}`});
            return false
        }
        return true
    }

    const handlePhoto = (e) => {
        if(e.target.files[0]) {
            if(!validateImage(e.target?.files[0])) {

            } else {
                fileToBase64(e.target.files[0]).then(base64 => {
                    formik.setFieldValue('photo',
                        [
                            ...formik.values.photo,
                            {
                                base64: base64,
                                size: e.target.files[0].size
                            }
                        ]);
                });
            }
        }
    }

    return (
        <>
            <style>{mapFormClass}</style>
            <div style={{width: "100vw", height: "100vh", position: "relative", boxSizing: "border-box", overflow: "hidden"}}>
                <Dialog
                    style={{width: "400px"}}
                    modal
                    visible={isVisibleSuccess}
                    onHide={setIsVisibleSuccess}
                    content={() => {
                        return(
                            <div style={{backgroundColor: "#fff", padding: "25px", borderRadius: "15px"}}>
                                <div className={"d-flex flex-direction-column align-center"}>
                                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%", width: "100px", height:"100px", backgroundColor: "#17c400"}}>
                                        <span className={"pi pi-check"} style={{fontSize:"4rem", color: "#fff"}}></span>
                                    </div>
                                    <h3 style={{textAlign: "center", margin: "25px 0 10px 0"}}>Мы приняли ваше обращение</h3>
                                    <b style={{fontSize: "2rem", color: "#222"}}>№ {createdIncident?.number}</b>
                                    <p>В ближайшее время мы опубликуем его.</p>
                                    <p style={{margin: "0", textAlign: "center"}}>Вы можете следить за ходом исполнения Вашего обращения
                                        <Link to={`/incidents/${createdIncident?.id}`} style={{fontSize: "1.2rem", fontWeight:"700", color: "#06b6d4"}}> по ссылке</Link>
                                    </p>
                                </div>
                            </div>
                        )
                    }}
                />


                <Toast ref={messageRef} position="top-center"
                       onHide={() => setIsCreateMode(false)}
                       pt={{
                           content: {style: {display: "flex", alignItems: "center"}},
                           root: {style: {top: "70px", maxWidth: "45rem"}}
                       }}
                />

                <Sidebar
                    onHide={() => {
                        setIsVisibleSidebar(false)
                    }}
                    visible={isVisibleSidebar}
                    className={'sidebar'}
                    pt={{header: {style: {padding: "15px 15px 5px 15px"}}}}
                >
                    {isVisibleSidebarForm && acceptConfidentialData ?
                        <div>
                            <h3>Шаг 3.</h3>
                            <p style={{fontSize: "1.2rem", margin: "5px 0"}}>
                                Форма обращения
                            </p>
                            {errorForm ?
                                <div style={{backgroundColor: "rgba(255,0,0,0.19)", padding: "5px 10px", borderRadius: "5px"}}>
                                    <span style={{color: "#e25252", fontSize: ".9rem"}}>Не удалось создать обращение. Внутреняя ошибка. Попробуйте позже.</span>
                                </div>
                                :null
                            }
                            <div style={{marginTop: "15px", width: "100%"}}>
                                <div>
                                    <label>Адрес проблемы</label>
                                    <span style={{fontSize: ".9rem", fontWeight: "600", textDecoration: "underline"}}>{data?.address}</span>
                                </div>
                                <div style={{marginTop: "15px"}}>
                                    <label>Ваше имя и фамилия</label>
                                    <InputText className="p-inputtext-sm"
                                               value={formik.values.full_name}
                                               placeholder={'Сергей Васильевич Смирнов'}
                                               onChange={(e) => formik.setFieldValue('full_name', e.target.value)}
                                               pt={{root: {style: {width: "100%"}}}}
                                    />
                                    <div>
                                        <span className={'error-message'}>{formik.errors.full_name}</span>
                                    </div>
                                </div>
                                <div style={{marginTop: "15px"}}>
                                    <label>Ваш номер телефона</label>
                                    <InputMask mask={'+7 999 999 99 99'}
                                               placeholder={"+7 999 987 65 43"}
                                               value={formik.values.phone_number}
                                               slotChar={' '}
                                               onChange={(e) => formik.setFieldValue('phone_number', e.target.value)}
                                               className="p-inputtext-sm"
                                               unmask
                                               pt={{root: {style: {width: "100%"}}}}
                                    />
                                    <div>
                                        <span className={'error-message'}>{formik.errors.phone_number}</span>
                                    </div>
                                </div>
                                <div style={{marginTop: "15px"}}>
                                    <label>Опишите проблему</label>
                                    <InputTextarea
                                        value={formik.values.text}
                                        onChange={e => formik.setFieldValue('text', e.target.value)}
                                        rows={6}
                                        autoResize
                                        style={{width: "100%"}}
                                    />
                                    <div>
                                        <span className={'error-message'}>{formik.errors.text}</span>
                                    </div>
                                </div>
                                <div className="card" style={{marginTop: "15px"}}>
                                    <label>Фото с места</label>
                                    <span style={{fontSize: ".88rem"}}>Объем загружаемых файлов не должен превышать 50мб. Допустимо не более 4 фотографий.</span>
                                    <div>
                                        {formik.values.photo?.map((item, index) => {
                                            return (
                                                <div key={index} style={{margin: "10px 0", backgroundColor: "#f1f1f1", borderRadius: "5px", padding: "10px"}}>
                                                    <div className={"d-flex justify-between align-center"}>
                                                        <Image src={item.base64} height='75px' width='75px' styles={{borderRadius: "10px", flex: "1"}} preview />
                                                        <div style={{flex: "2", margin: "0 10px"}}>
                                                            <p style={{margin: "0", textAlign: "left", fontSize: ".8rem"}}>Загруженное фото № {index+1}</p>
                                                            <div className={"d-flex justify-between align-center"} style={{}}>
                                                                <Tag value={bytesForHuman(item.size)}  style={{margin: "0 10px", opacity: ".8"}}/>
                                                                <Button size={"small"} pt={{root: {style: {padding: "1px"}}}}
                                                                        severity={"secondary"} icon={"pi pi-times"} rounded outlined text
                                                                        onClick={() => formik.setFieldValue('photo',
                                                                            formik.values.photo.filter(photo => photo.base64 !== item.base64)
                                                                        )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {formik.values.photo.length < 4 ?
                                        <div style={{marginTop: "15px"}}>
                                            <label htmlFor={"photo"} className={"upload-file-button"}>
                                                Выберите файл
                                            </label>
                                            <input id="photo" name="photo" type="file" accept={"image/*"} onChange={handlePhoto} style={{display: "none"}}/>
                                        </div>
                                        : null
                                    }
                                    <div>
                                        <span className={'error-message'}>{formik.errors.photo}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={"d-flex justify-end"} style={{marginTop: "15px"}}>
                            <Button label={'Отмена'} size="small" text outlined severity={'secondary'} style={{margin: "0 5px"}}
                                    onClick={() => {
                                        setIsVisibleSidebar(false)
                                    }}
                            />
                                <Button loading={isLoadingForm} label={'Отправить'} type={'submit'} size="small" style={{margin: "0 5px"}} onClick={() => formik.handleSubmit()}/>
                            </div>
                        </div>
                        :
                        <div>
                            <h3>Шаг 2.</h3>
                            <div style={{marginTop: "50px"}}>
                                <span>
                                    Администратор рассмотрит ваше обращение в ближайщее время,
                                    после чего, проблема будет опубликована на портале.
                                </span>
                                <p>Обращаем внимание, что ваши персональные данные на портале опубликованы <b>не будут</b>.</p>
                                <p>
                                    Обращение будет взято в работу депутатом <b>Панченко Олег Петрович</b>.
                                </p>
                                <p>
                                    На основе обращения будет сформирован и отправлен официальный запрос
                                    в ответственное ведомство или подрядную организацию.
                                </p>
                                <p>
                                    Все документы о ходе рассмотрения и исполнения вашего обращения будут опубликованы
                                    на портале.
                                </p>
                            </div>
                            <div>

                            </div>
                            <div className={"d-flex align-center"} style={{margin: "30px 0 20px 0"}}>
                                <Checkbox inputId='checkbox-accept-data' checked={acceptConfidentialData} onChange={() => setAcceptConfidentialData(prev => !prev)}/>
                                <label style={{margin: "0 10px"}} htmlFor={'checkbox-accept-data'}>Согласен на обработку персональных данных</label>
                            </div>
                            <div className={"d-flex justify-end"}>
                                <Button size={"small"} disabled={!acceptConfidentialData} severity={!acceptConfidentialData ? 'secondary' : null} label={"Продолжить"} icon={"pi pi-angle-right"} iconPos="right" onClick={() => {setIsVisibleSidebarForm(true)}}/>
                            </div>
                        </div>
                    }
                </Sidebar>
                <div style={{position: "absolute", top: "80px", left: "1rem", zIndex: "100"}}>
                    {isCreateMode  ?
                        data?.address ?
                            <Button icon={'pi pi-angle-right'} onClick={() => {setIsVisibleSidebar(true)}} severity={'secondary'}/>
                            : null
                            : <div>
                                <Button label={'Создать обращение'} onClick={() => {
                                    setIsCreateMode(true);
                                    showMessage()
                                }}/>
                             </div>
                    }
                </div>
                <YaMap isCreateMode={isCreateMode} setData={setData}/>
            </div>
        </>
    )
}

export default IncidentsMap;