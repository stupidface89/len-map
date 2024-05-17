import React, {useEffect, useState, useRef} from 'react';

import {Paginator} from "primereact/paginator";
import FilterBar from "./FilterBar";
import IncidentItem from "./IncidentItem";
import useFetch from "../../hooks/useFetch";
import {client, urls} from "../../api/client";



const IncidentsListPage = () => {
	const [listIncidents, setListIncidents] = useState([]);
	const [statusFilterParams, setStatusFilterParams] = useState(null);

	const [countIncidence, setCountIncidence] = useState(null);
	const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);
	const [currentPage, setCurrentPage] = useState('0');
	const paginatorRef = useRef();

    const onPageChange = async (event) => {
        setFirst(event.first);
        setRows(event.rows);
		setCurrentPage(event.page);
    };

	const [getIncidents, isLoadingIncidents, errorIncidents] = useFetch(async () => {
		const url_params = new URLSearchParams();
		url_params.append('page', currentPage);

		if(statusFilterParams){
			Object.keys(statusFilterParams).forEach(key => {
				url_params.append('status', statusFilterParams[key])
			});
		}

		const response = await client.get(urls.get_create_incidents, {params: url_params});
		if(response.status === 200 && response.data.data) {
			setListIncidents([...response.data.data]);
			setCountIncidence(response.data.count);
		}
	});

	useEffect(() => {
		getIncidents();
	}, [currentPage]);

	useEffect(() => {
		setCurrentPage('0')
	}, [statusFilterParams]);

	return (
		<div style={{marginBottom: "150px"}}>
			<div className={"container"}>
				<div className={"content-container decorate-container"}>
					<h2 style={{fontWeight: "400"}}>Обращения граждан</h2>
					<FilterBar setFilterParams={setStatusFilterParams} fetchData={getIncidents}/>
				</div>
				<div className={"content-container decorate-container d-flex align-center flex-direction-column"}>
					{isLoadingIncidents ?
						<div className={"d-flex justify-center align-center"} style={{height: "60vh"}}>
							<span className={"pi pi-spin pi-spinner"} style={{fontSize: "3rem", opacity: ".3"}}></span>
						</div>
						:
						<>
							{errorIncidents ?
								<>
									<div className={"d-flex flex-direction-column justify-center"}>
										<div style={{textAlign: "center"}}>
											<p style={{fontSize: "1.6rem", margin: "0", color: "red"}}>Ой, </p>
											<span>что то пошло не так.</span>
										</div>
										<div style={{
											background: `no-repeat center url(${process.env.PUBLIC_URL}img/going-wrong.png)`,
											backgroundSize: "contain",
											width: "100%",
											height: "250px",
											marginTop: "30px",
											opacity: ".4"
										}}></div>
									</div>
								</>
								:
								<>
									<div className={"incidents-container d-flex justify-center"}>
										{getIncidents && listIncidents.map((item, index) => {
											return (
												<div key={index}>
													<IncidentItem data={item}/>
												</div>
											)
										})}
									</div>
									<div style={{marginTop :"25px"}}>
										{countIncidence > 12?
											<Paginator
												ref={paginatorRef}
												first={first}
												rows={rows}
												totalRecords={countIncidence}
												onPageChange={onPageChange}
												pt={{
													firstPageButton: {style: {display: "none"}},
													lastPageButton: {style: {display: "none"}}
												}}
											/>
											:null
										}
									</div>
								</>
							}
						</>
					}
				</div>
			</div>
		</div>
	);
};

export default IncidentsListPage;