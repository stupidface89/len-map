import React, {useState} from 'react';
import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import {Button} from "primereact/button";

const mapReceptionClass = `
	.map-reception {
		position: relative;
		height: 600px;
		margin: 95px 0 0 0;
	}
	
	.map-note {
		position: absolute;
		background-color: rgba(255, 255, 255, .7);
		top: 50px;
		left: 10%;
		width: 350px;
		padding: 20px 20px;
		border-radius: 10px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(7.7px);
		border: 1px solid rgba(255, 255, 255, 0.13);
	}
	
	@media only screen and (max-width: 440px){
		.map-note{
			left: 0%;
			width: 100%;
		}
	}
`


const PublicReceptionMap = () => {
	const [isVisibleNote, setIsVisibleNote] = useState(true);

	return (
		<>
			<style>{mapReceptionClass}</style>
			<div className={"map-reception"}>
				<YMaps query={{load: "package.standard", lang: "ru_RU"}}>
					<Map
						instanceRef={ref => {
							ref && ref.behaviors.disable('scrollZoom');
						}}
						width="100%"
						height="100%"
						modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
						defaultState={{
							center: [56.018735337108396, 92.99447335556685],
							zoom: 16,
							controls: [],
						}}
						options={{
							minZoom: 8,
							copyrightLogoVisible: false,
							restrictMapArea: [[55.87943455156041, 92.53684646720032], [56.175499162666824, 93.28254348868465]]
						}}
					>
						<Placemark
							geometry={[56.018735337108396, 92.99447335556685]}
							options={{
								iconImageHref: `${process.env.PUBLIC_URL}img/map-icon-red.svg`,
								iconImageSize: [50, 65],
								iconOffset: [-10, -25],
								iconLayout: 'default#image',
								preset: 'islands#circleDotIcon',
							}}
						/>
					</Map>
				</YMaps>
				{isVisibleNote ?
					<div className={"map-note"}>
						<span className={"pi pi-times"} style={{position: "absolute", right: "20px", cursor: "pointer"}} onClick={() => setIsVisibleNote(false)}></span>
						<div>
							<p style={{fontSize: "1.2rem"}}>Общественная приемная</p>
							<div>
								<p style={{margin: "5px 0"}}>Адрес:</p>
								<span style={{fontSize: ".9rem"}}>г. Красноярск, проспект имени Газеты Красноярский Рабочий, 32</span>
							</div>
							<div style={{marginTop: "15px"}}>
								<p style={{margin: "5px 0"}}>Телефон:</p>
								<span style={{fontSize: ".9rem"}}>+7 904 569 48-02</span>
							</div>
							<div style={{marginTop: "15px"}}>
								<p style={{margin: "5px 0"}}>График приема</p>
								<span style={{fontSize: ".9rem"}}>
									Пн. - Пт.
									10 <sup>00</sup> - 17 <sup>00</sup>
								</span>
							</div>
						</div>
					</div>
					:
					<div className={"d-flex align-center"} style={{position: "absolute", top: "50px", left: "0", width: "25px", height: "50px"}} >
						<Button icon={"pi pi-angle-right"} onClick={() => setIsVisibleNote(true)}/>
					</div>
				}
			</div>
		</>
	);
};

export default PublicReceptionMap;