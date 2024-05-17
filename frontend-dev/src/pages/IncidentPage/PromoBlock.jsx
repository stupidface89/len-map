import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {Button} from "primereact/button";

const PromoBlock = () => {
    const addParallaxEffect = () => {
        let point_1 = document.querySelector('#map-point-1');
        let point_2 = document.querySelector('#map-point-2');
        let point_3 = document.querySelector('#map-point-3');

        window.addEventListener('mousemove', function(e) {
            let x = e.clientX / window.innerWidth;
            let y = e.clientY / window.innerHeight;
            point_1.style.transform = 'rotate(-12deg) translate(-' + x * 75 + 'px, -' + y * 100 + 'px)';
            point_2.style.transform = 'rotate(-30deg) translate(-' + x * 25 + 'px, -' + y * 25 + 'px)';
            point_3.style.transform = 'rotate(30deg) translate(-' + x * 15 + 'px, -' + y * 15 + 'px)';
        });

    }

useEffect(() => {
    addParallaxEffect()
}, []);

    return(
        <>
            <div className={"d-flex align-center justify-center"} style={{position: "relative", width: "100%", boxShadow: "0 0 15px 5px #888"}}>
                <div className={'bg-main'} style={{background: `no-repeat center url(${process.env.PUBLIC_URL}/img/gorod.jpg`}}>
                    <div className={'bg-filter'}></div>
                </div>
                <div className={'promo-block'}>
                    <div className={'left-block'}>
                        <div>
                            <h1 className={"promo-title"} style={{margin: "0 0 35px 0"}}>Карта проблем Ленинского района</h1>

                            <p className={"promo-description"}>
                                Сервис позволяет жителем Ленинского района взаимодействовать с
                                органами власти напрямую, для решения проблем ЖКХ, дорожных, экологических и других,
                                мешающих комфортному существованию в нашем городе!
                            </p>
                        </div>
                        <div style={{marginTop: "30px"}}>
                            <div className={"d-flex justify-start"}>
                                <Link to={'/map/?create-new=true'}>
                                    <Button rounded label={'Создать обращение'} style={{width: "350px", height: "50px"}}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={'right-block'}>
                        <div>
                            <div id="map-point-1" className={"promo-map-point"}>
                                <div style={{background: `no-repeat center url(${process.env.PUBLIC_URL}/img/drop-point.png)`, backgroundSize: "contain", userSelect: "none", width: "100%", height: "100%"}}/>
                                <div style={{left: "160px", bottom: "-100px", rotate: "6deg", opacity: ".1", boxShadow: "0 0 10px 5px #000", position: "absolute", width: "60px", height: "20px", backgroundColor: "#000", borderRadius: "50%"}}></div>
                            </div>

                            <div id="map-point-2" className={"promo-map-point"}>
                                <div style={{background: `no-repeat center url(${process.env.PUBLIC_URL}/img/drop-point.png)`, backgroundSize: "contain", userSelect: "none", width: "100%", height: "100%"}}/>
                                <div style={{left: "120px", bottom: "-100px", rotate: "18deg", opacity: ".3", boxShadow: "0 0 10px 5px #000", position: "absolute", width: "45px", height: "20px", backgroundColor: "#000", borderRadius: "50%"}}></div>
                            </div>

                            <div id="map-point-3" className={"promo-map-point"}>
                                <div style={{background: `no-repeat center url(${process.env.PUBLIC_URL}/img/drop-point.png)`, backgroundSize: "contain", userSelect: "none", width: "100%", height: "100%"}}/>
                                <div style={{left: "90px", bottom: "-100px", rotate: "-25deg", opacity: ".2", boxShadow: "0 0 10px 5px #000", position: "absolute", width: "50px", height: "10px", backgroundColor: "#000", borderRadius: "50%"}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PromoBlock;