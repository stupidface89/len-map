import {memo} from 'react';
import {Link} from "react-router-dom";
import StatusTag from "../../components/StatusTag/StatusTag";

const IncidentItem = memo(({data}) => {
	const incidentItemClasses = `
		.incident-block {
			min-width: 350px;
			max-width: 420px;
			border: 1px solid #ededed;
			border-radius: 10px;
			box-shadow: 3px 3px 8px 0 #e3e3e3;
			transition: transform .3s, box-shadow .3s;
			
			&:hover {
				box-shadow: 1px 1px 8px 0 #e3e3e3;
				transform: scale(1.03)
			}
		}
	
	`

	const date_created = new Date(data.date_created).toLocaleDateString('ru-RU', {day: "2-digit", month: "long", year: "2-digit"}) + " " + new Date(data.date_created).toLocaleTimeString('ru-RU', {hour: "2-digit", minute: "2-digit"})
	const views_count = Math.round((new Date() - new Date(data.date_created)) / 500000).toLocaleString('ru-RU');

	return(
		<>
			<style>{incidentItemClasses}</style>
			<Link to={`/incidents/${data.id}`}>
				<div className='incident-block'>
					<div style={{width: "100%"}}>
						<div style={{background: `no-repeat center url(${process.env.REACT_APP_MEDIA_FOLDER + data.photo[0]?.path})`, backgroundSize: "cover", width: "100%", height: "200px", borderRadius: "10px"}}/>
					</div>
					<div className={"d-flex justify-between align-center"}
						 style={{marginTop: "10px", padding: "5px 15px"}}>
						<span>Обращение № {data.number}</span>
						<StatusTag status={data.status}/>
					</div>
					<div style={{height: "150px", padding: "10px 15px"}}>
						<span style={{fontSize: ".85rem", opacity: ".5"}}>Текст обращения:</span>
						<div>
							<span style={{fontSize: ".85rem",}}>{data.text.slice(0, 200)}</span>
						</div>
					</div>
					<div className={"d-flex justify-between"} style={{alignItems: "center", padding: "10px 15px", height: "40px"}}>
						<span style={{fontSize: "0.85rem", opacity:".6"}}>{date_created}</span>
						<div className={"d-flex align-center"} style={{opacity:".6"}}>
							<span className={"pi pi-eye"} style={{color: "#888", margin: "0 5px"}}></span>
							<span style={{fontSize: "0.85rem", }}>{views_count}</span>
						</div>
					</div>
				</div>
			</Link>
		</>
	)
});

export default IncidentItem;