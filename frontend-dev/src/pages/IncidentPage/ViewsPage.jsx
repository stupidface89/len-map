import React from 'react';

const ViewsPage = ({date_created}) => {
	let count = null;
	const today = new Date();
	const getViews = () => {
		if(date_created) {
			count = (Math.round((today - new Date(date_created)) / 500000)).toLocaleString('ru-RU');
		}
	}

	getViews()

	return (
		<>
			{count ?
				<div className={"d-flex"} style={{fontSize: ".8rem", opacity: ".6", height: "fit-content"}}>
					<span className={"pi pi-eye"} style={{color: "#888"}}></span>
					<span style={{margin: "0 5px"}}>Просмотров</span>
					<span>{count}</span>
				</div>
				: null
			}
		</>
	);
};

export default ViewsPage;