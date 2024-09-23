import React from 'react';

const StatusTag = ({status}) => {

	const statuses = {
		NEW: 'Новое обращение',
		PUBLISHED: 'Опубликовано',
		SENT: 'Отправлено',
		INWORK: 'Дан ответ',
		DONE: 'Выполнено',
		FAIL: 'Не выполнено'
	}

	let status_value;

	let tag_style = {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "30px",
		width: "fit-content",
		borderRadius: "5px",
		padding: "5px 15px",
		fontSize: ".8rem",
		userSelect: "none",
		cursor: "pointer",
	}

	switch (status){
		case "NEW":
			tag_style = {...tag_style, backgroundColor: "#cee0ff", color: "#4263B7"};
			status_value = statuses[status]
			break;
		case "PUBLISHED":
			tag_style = {...tag_style, backgroundColor: "#ececec", color: "#696969"};
			status_value = statuses[status]
			break;
		case "SENT":
			tag_style = {...tag_style, backgroundColor: "#cee0ff", color: "#4263B7"};
			status_value = statuses[status]
			break;
		case "INWORK":
			tag_style = {...tag_style, backgroundColor: "#ffebd2", color: "#d77300"};
			status_value = statuses[status]
			break;
		case "DONE":
			tag_style = {...tag_style, backgroundColor: "#d9ffce", color: "#2d8200"};
			status_value = statuses[status]
			break;
		case "FAIL":
			tag_style = {...tag_style, backgroundColor: "#ffcece", color: "#b74242"};
			status_value = statuses[status]
			break;

		default:
			break;
	}

	return (
		<>
			<div style={{margin:"5px 0px"}}>
				<div style={tag_style}>
					<span>{status_value} </span>
				</div>
			</div>
		</>
	);
};

export default StatusTag;