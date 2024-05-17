import {useState} from 'react';

import {Placemark} from "@pbe/react-yandex-maps";
import {Sidebar} from "primereact/sidebar";

import {Link} from 'react-router-dom';
import useFetch from "../../../hooks/useFetch";
import {urls, client} from "../../../api/client";
import StatusTag from "../../StatusTag/StatusTag";
import CarouselPhoto from "./CarouselPhoto";
import {Button} from "primereact/button";


const MapIncident = ({data}) => {
	const [isVisibleSidebar, setIsVisibleSidebar] = useState(false);
	const [incidentData, setIncidentData] = useState(null);

	const [retrieveIncident, isLoadingIncident, errorIncident] = useFetch(async () => {
		const url = urls.retrieve_update_delete_incident.replace('{incident_id}', data.id);
		const response = await client.get(url);
		if(response.status === 200 && response.data) {
			setIncidentData({...response.data});
		}
	});

	const date_created = `${new Date(incidentData?.date_created).toLocaleDateString('ru-RU', {day:"2-digit", month: "long", year: "numeric"})} ${new Date(incidentData?.date_created).toLocaleTimeString('ru-RU', {hour: "2-digit", minute: "2-digit"})}`
	const showData = async () => {
		setIsVisibleSidebar(true);
		await retrieveIncident();
	}

	const placemarkIcon = {
		NEW: `${process.env.PUBLIC_URL}img/map-icon-green.svg`,
		PUBLISHED: `${process.env.PUBLIC_URL}img/map-icon-gray.svg`,
		SENT: `${process.env.PUBLIC_URL}img/map-icon-blue.svg`,
		INWORK: `${process.env.PUBLIC_URL}img/map-icon-yellow.svg`,
		DONE: `${process.env.PUBLIC_URL}img/map-icon-green.svg`,
		FAIL: `${process.env.PUBLIC_URL}img/map-icon-red.svg`,
	}

	const sidebarClass = `
		.sidebar {
			width: 380px;
		}
		
		.sidebar .incident-list-photo {
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			list-style: none;
			padding: 0;
		}
		
		.incident-list-photo li {
			width: 100px;
			height: 100px;
			margin: 0 5px;
		}
	
		.incident-message {
			padding: 10px 15px;
			background-color: #eaf0ff;
			border-radius: 5px;
		}
		
		@media only screen and (max-width: 420px) {
			.sidebar {
				width: 100%;
			}
		}
	`

	const IsLoadingOrError = () => {
		return (
			<>

				{isLoadingIncident ?
					<div className={"d-flex align-center flex-direction-column"} style={{marginTop: "20%"}}>
						<i className={"pi pi-spin pi-spinner"} style={{fontSize: "2rem", opacity: ".6"}}></i>
					</div>
					:null
				}

				{errorIncident ?
					<>
						<div style={{textAlign: "center"}}>
							<p style={{fontSize: "1.6rem", margin: "0", color: "red"}}>Ой, </p>
							<span>что то пошло не так.</span>
						</div>
						<div style={{
							background: `no-repeat center url(${process.env.PUBLIC_URL}img/going-wrong.png)`,
							backgroundSize: "contain",
							width: "250px",
							height: "250px",
							marginTop: "20px"
						}}></div>
					</>
					:null
				}
			</>
		)
	}

	return (
		<>
			<style>{sidebarClass}</style>
			<Sidebar onHide={setIsVisibleSidebar} visible={isVisibleSidebar} className={'sidebar'}>
				<IsLoadingOrError/>
					<div>
						<h3 style={{margin: "0 0 15px 0"}}>Обращение № {incidentData?.number}</h3>
						<div>
							<div className={"d-flex"}>
								<span style={{fontSize: ".9rem", opacity: ".8"}}>{date_created}</span>
							</div>
							<StatusTag status={incidentData?.status}/>
						</div>
						<div style={{margin: "30px 0 10px 0"}}>
							<label>Адрес:</label>
							<span style={{fontSize: ".9rem"}}>{incidentData?.address}</span>
						</div>
						<div>
							<div className={"incident-message"}>
								<span style={{fontSize: ".9rem"}}>{incidentData?.text}</span>
							</div>
						</div>
						<div style={{marginTop: "15px"}}>
							<span style={{fontSize: ".9rem"}}>Фото проблемы</span>
							<CarouselPhoto data={incidentData?.photo}/>
						</div>
						<div style={{marginTop: "35px"}}>
							<Link to={`/incidents/${incidentData?.id}`}>
								<Button label={'Подробнее'} style={{width: "100%"}}/>
							</Link>
						</div>
					</div>
			</Sidebar>

			<Placemark
				onClick={async () => await showData()}
				defaultGeometry={data.coords}
				options={{
					iconImageSize: [35, 45],
					iconLayout: 'default#image',
					preset: 'islands#circleDotIcon',
					iconImageHref: placemarkIcon[data.status],
				}}
			/>
		</>
	);
};

export default MapIncident;