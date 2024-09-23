import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useFetch from "../../hooks/useFetch";
import {client, urls} from "../../api/client";

import ViewsPage from "./ViewsPage";
import Image from "../../components/Image/Image";
import StatusTag from "../../components/StatusTag/StatusTag";
import ProgressSteps from "./ProgressSteps";

const RequestDoc = ({data}) => {
	const date_request = new Date(data.date_send_request).toLocaleDateString('ru-RU', {day: "2-digit", month: "long", year: "numeric"});

	return (
		<div>
			<div style={{backgroundColor: "rgb(255,243,235)", padding: "15px 20px", borderRadius: "5px"}}>
				<span>Запрос отправлен:</span>
				<div>
					{data.date_send_request ?
						<span style={{fontSize: ".9rem", opacity: ".8"}}>Дата отправки {date_request}</span>
						: null
					}
				</div>
				<div style={{margin: "10px 0"}}>
					<a href={data.request_doc} className={"d-flex align-center"} style={{width: "fit-content"}}>
						<img src={process.env.PUBLIC_URL + '/img/icon-doc.svg'} alt="" style={{filter: "hue-rotate(335deg)"}} width={"35px"}/>
						<span style={{
							margin: "0 10px",
							textDecoration: "underline",
							fontSize: ".9rem"
						}}>Запрос для {data.executor.title}</span>
					</a>
				</div>
			</div>
		</div>
	)
}
const ResponseDoc = ({data}) => {
	const date_response = new Date(data.date_get_response).toLocaleDateString('ru-RU', {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});

	return (
		<div style={{marginTop: "15px"}}>
			<div style={{backgroundColor: "rgb(238,255,235)", padding: "15px 20px", borderRadius: "5px"}}>
				<span>Ответ получен:</span>
				<div>
					{data.date_send_request ?
						<span style={{fontSize: ".9rem", opacity: ".8"}}>Дата получения {date_response}</span>
						: null
					}
				</div>
				<div style={{margin: "10px 0"}}>
					<a href={data.response_doc} className={"d-flex align-center"} style={{width: "fit-content"}}>
						<img src={process.env.PUBLIC_URL + '/img/icon-doc.svg'} style={{filter: "hue-rotate(335deg)"}} alt="" width={"35px"}/>
						<div>
							<span style={{
								margin: "0 10px",
								textDecoration: "underline",
								fontSize: ".9rem"
							}}>Ответ от {data.executor.title}</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	)
}

const IncidentPage = () => {
	const params = useParams();
	const [incidentData, setIncidentData] = useState(null);

	const time_created = new Date(incidentData?.date_created).toLocaleTimeString('ru-RU', {hour: "2-digit", minute: "2-digit"});
	const date_created = new Date(incidentData?.date_created).toLocaleDateString('ru-RU', {day: "2-digit", month: "long", year: "numeric"}) + " " + time_created

	const [getIncident, isLoadingIncident, errorIncident] = useFetch(async () => {
		const url = urls.retrieve_update_delete_incident.replace('{incident_id}', params.id)
		const response = await client.get(url);
		if (response.status === 200 && response.data) {
			setIncidentData(response.data)
		}
	})

	useEffect(() => {
		getIncident()
	}, []);

	return (
		<div>
			{getIncident && !errorIncident ?
				<>
					<div className={"container"}>
						<div className={"content-container"} style={{padding: "25px", maxWidth: "1280px", minHeight: "100vh"}}>
							{!isLoadingIncident?
								<div style={{display: "flex", justifyContent: "center",  margin: "0 10px 35px 0"}}>
									<div style={{display: "flex", width: "1280px", justifyContent: "space-between"}}>
										<div>
											<div>
												<h3 style={{margin: "0"}}>Обращение № {incidentData?.number}</h3>
											</div>
											<div style={{margin: "5px 0"}}>
												<span style={{opacity: ".6"}}>от {date_created}</span>
											</div>

										</div>
										<div className={"d-flex justify-end"}>
											{incidentData?.status !== "NEW" ?
												<ViewsPage date_created={incidentData?.date_created}/>
												: null
											}
										</div>
									</div>
								</div>
								: null
							}
							<div className={"decorate-container"} style={{display: "grid", gridTemplateColumns: "500px 680px", overflow: "hidden", justifyContent: "center"}}>
								<div>
									<div style={{width: "100%", height: "310px"}}>
										{incidentData && !isLoadingIncident ?
											<Image src={process.env.REACT_APP_MEDIA_FOLDER + incidentData?.photo[0].path} styles={{borderRadius: "10px"}}/>
											:null
										}
									</div>
									<div className={"d-flex"} style={{margin: "10px 0 0 0"}}>
										{incidentData?.photo.slice(1, ).map((item, index) => {
											return (
												<div key={index} style={{width: "100px", height: "100px", margin: "0 5px 0 0"}}>
													<Image src={process.env.REACT_APP_MEDIA_FOLDER + item?.path} styles={{height: "100%", borderRadius: "8px"}}/>
												</div>
											)
										})}
									</div>
								</div>
								<div style={{padding: "0 25px"}}>
									<div>
										<h3 style={{margin: "0 0 20px 0"}}>Ход исполнение обращения</h3>
									</div>
									<div style={{marginTop: "10px"}}>
										<StatusTag status={incidentData?.status}/>
									</div>
									<div>
										<ProgressSteps status={incidentData?.status}/>
									</div>
									<div style={{marginTop: "45px"}}>
										<p style={{margin: "0", fontSize: "1rem", fontWeight: "600", opacity: ".6"}}>Адрес:</p>
										<span style={{fontSize: ".9rem",}}>{incidentData?.address}</span>
									</div>
									<div style={{marginTop: "20px"}}>
										<div className={"d-flex align-center"}>
											<span style={{fontSize: "1rem", fontWeight: "600", opacity: ".6"}}>Текст обращения:</span>
										</div>
										<div style={{marginTop: "5px", backgroundColor: "#eaf0ff", fontSize: ".9rem", padding: "15px 20px", borderRadius: "5px"}}>
											<span>{incidentData?.text}</span>
										</div>
									</div>
									<div className={"d-flex justify-end"} style={{marginTop: "10px"}}>
										<Link to={`/map?lat=${incidentData?.latitude}&long=${incidentData?.longitude}&zoom=17`}>
											<div className={"d-flex align-center"} style={{color: "#4263b7", width: "fit-content", padding: "5px 10px", fontSize: ".8rem"}}>
												<span className={"pi pi-map-marker"} style={{fontSize: ".7rem"}}></span>
												<span style={{margin: "0 5px"}}>Посмотреть на карте</span>
											</div>
										</Link>
									</div>
									<div style={{marginTop: "25px"}}>
										{incidentData?.executor.map((item, index) => {
											return(
												<div key={index}>
													{item.request_doc ?
														<RequestDoc data={item}/>
														: null
													}

													{item.response_doc ?
														<ResponseDoc data={item}/>
														: null
													}
												</div>
											)
										})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
				: null
			}
		</div>
	);
};

export default IncidentPage;