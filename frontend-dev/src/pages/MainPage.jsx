import {Button} from "primereact/button";
import {Link} from "react-router-dom";

import LastIncidents from "./IncidentPage/LastIncidents";
import PublicReceptionMap from "./IncidentPage/PublicReceptionMap";
import PromoBlock from "./IncidentPage/PromoBlock";

const Steps = () => {
    const stepsClasses = `
        .step {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 130px;
            height: 130px;
            border-radius: 50%;
            margin: 0 50px;
            cursor: pointer;
            transition: opacity .3s;
            user-select: none;
            &:hover {
                opacity: .6;
            }
        }
        
        .step > p {
            text-align: center;
            color: #0f2240;
            padding: 0 10px;
            font-weight: 600;
        }
        
        .step > p {
            margin: 5px 0;
        }
                      
        .first {
            border: 2px dashed #0f2240;
            background-color: #fff;
        }
                
        .second {
            border: 2px dashed #0f2240;
            background-color: #e5effb;
        }
        
        .third {
            border: 3px solid #1d2749;
            background-color: #e5effb;
        }
        
        .fourth {
            background-color: #1d2749;
        }
        
    `

    return (
        <>
            <style>{stepsClasses}</style>
            <div className={"d-flex justify-center"} style={{height: "500px", width: "100%", position: "relative", overflow: "hidden"}}>
                <div className={"d-flex justify-center"} style={{width: "1280px", padding: "25px 0"}}>
                    <div style={{position: "relative", zIndex:"1", marginTop: "50px", textAlign: "center"}}>
                        <span style={{fontSize: "2rem", fontWeight: "600"}}>Как это работает</span>
                        <div className={"d-flex align-center"} style={{marginTop: "65px"}}>
                            <div className={"d-flex flex-direction-column align-center"}>
                                <div className={"step first"}>
                                    <span className={"pi pi-pen-to-square"} style={{fontSize: "1.3rem", color: "#0f2240"}}></span>
                                    <p>Вы пишете обращение</p>
                                </div>
                            </div>

                            <span className={"pi pi-angle-right"} style={{color: "#1b206b"}}></span>

                            <div className={"d-flex flex-direction-column align-center"}>
                                <div className={"step second"}>
                                    <span className={"pi pi-send"} style={{fontSize: "1.3rem", color: "#1b206b"}}></span>
                                    <p>Мы делаем официальный запрос</p>
                                </div>
                            </div>

                            <span className={"pi pi-angle-right"} style={{color: "#1b206b"}}></span>

                            <div className={"d-flex flex-direction-column align-center"}>
                                <div className={"step third"}>
                                    <span className={"pi pi-clock"} style={{fontSize: "1.3rem", color: "#1b206b"}}></span>
                                    <p>Ожидание ответа</p>
                                </div>
                            </div>

                            <span className={"pi pi-angle-right"} style={{color: "#1b206b"}}></span>

                            <div className={"d-flex flex-direction-column align-center"}>
                                <div className={"step fourth"}>
                                    <span className={"pi pi-check-square"} style={{fontSize: "1.3rem", color: "#fff"}}></span>
                                    <p style={{color: "#fff"}}>Следим за исполнением</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"d-flex"} style={{
                    transform: "rotate(5deg) scale(.6)",
                    position: "absolute",
                    left: "-50%",
                    top: "-65%",
                    opacity: ".08",
                    width: "250%",
                    height: "250%",
                    background: `repeat url(${process.env.PUBLIC_URL}/img/bg3.avif)`
                }}></div>
            </div>
        </>
    )
}

const MainPage = () => {
    return (
        <>
            <PromoBlock/>
            <Steps />
            <div style={{height: "250px", background: "linear-gradient(-45deg, #0F2240, #1F0A1E)", boxShadow: "rgb(136, 136, 136) 0px 6px 15px 5px"}}>
                <div className={"d-flex justify-center"}>
                    <div className={"d-flex"}>
                        <div className={""} style={{flex: "3"}}>
                            <p className={"title"} style={{fontSize: "2rem", color: "#ffffff"}}>Проект реализован по
                                инициативе <b style={{color: "#06b6d4"}}>Панченко Олега Петровича</b></p>
                            <p className={"big-text"} style={{color: "#fff"}}>Депутата 7 созыва Красноярского городского
                                Совета депутатов и помощника депутата Государственной думы РФ</p>
                        </div>
                        <div className={"d-flex justify-end"} style={{flex: "2", position: "relative", }}>
                            <div style={{
                                background: `no-repeat center url(${process.env.PUBLIC_URL}/img/oleg2.png)`,
                                backgroundSize: 'cover',
                                width: "200px",
                                height: "300px",
                                position: "absolute",
                                top: "-50px"
                            }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className={"d-flex justify-center"}>
                    <div className={"content-container"} style={{marginTop: "45px"}}>
                        <h2 style={{textAlign: "center", color: "#333", margin: "45px 0"}}>Последние опубликованные обащения</h2>
                        <LastIncidents />
                        <div className={"d-flex justify-center"} style={{marginTop: "55px"}}>
                            <Link to={'/incidents'}>
                                <Button rounded label={'Посмотреть остальные'} style={{width: "350px", height: "50px"}}/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <PublicReceptionMap/>
            {/*<div className={"d-flex align-center justify-center"} style={{backgroundColor: "#06b6d4", height: "500px"}}>*/}
            {/*    <div style={{width: "1280px"}}>*/}
            {/*        <span style={{color: "#fff", fontSize: "1.2rem"}}>*/}
            {/*            На всей территории нашего района располагается множество жилых и промышленных объектов,*/}
            {/*            общественных пространств, скверов и парков, объектов инфраструктуры, дорог и проездов,*/}
            {/*            а так же запущенных и заброшенных территорий. И мне как депутату избранному от Ленинского района,*/}
            {/*            очень хотелось, что бы все эти территории и объекты находились в исправном и безопасном техническом состоянии.*/}
            {/*            Поэтому нашей командой был придуман и реализован проект, посредством которого, с вашей помошью,*/}
            {/*            будут опубликованы на интерактивной карте района различные дефекты, неисправности, технические и техногенные аварии.*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
};

export default MainPage;