import {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {client, urls} from "../../api/client";

const incidentItemClass = `
	.incident-item-mini {
		box-shadow: 3px 3px 8px 0 #e3e3e3; 
		border-radius: 10px;
		transition: transform .3s;
		
		&:hover {
			transform: scale(1.03);
		}
	}
`


const LastIncidents = () => {
	const [incidentsList, setIncidentsList] = useState([]);

    const [getLast, isLoadingLast, errorLast] = useFetch(async () => {
        const response = await client.get(urls.get_create_incidents);
        if (response.status === 200 && response.data.data) {
            setIncidentsList([...response.data.data].sort((a, b) => new Date(b.date_created) - new Date(a.date_created)).slice(0, 3))
        }
    })

    useEffect(() => {
        getLast()
    }, []);

    return (
        <div>
            <style>{incidentItemClass}</style>
            <div style={{
                display: "grid",
                gridTemplateColumns: "400px 400px 400px",
                gridColumnGap: "20px",
                justifyContent: "center"
            }}>
                {incidentsList.map(item => {
                    const date_created = new Date(item.date_created).toLocaleDateString('ru-RU', {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    })
                    const views_count = Math.round((new Date() - new Date(item.date_created)) / 500000).toLocaleString('ru-RU');

                    return (
                        <Link key={item.id} to={`/incidents/${item.id}`}>
                            <div className={"incident-item-mini"}>
                                <div style={{
                                    background: `no-repeat center url(${process.env.REACT_APP_MEDIA_FOLDER + item.photo[0]?.path})`,
                                    backgroundSize: "cover",
                                    width: "100%",
                                    height: "250px",
                                    borderRadius: "10px"
                                }}>
                                </div>
                                <div className={"d-flex justify-between"} style={{padding: "10px 15px"}}>
                                    <span style={{fontSize: "0.85rem", opacity: ".6"}}>{date_created}</span>
                                    <div className={"d-flex align-center"} style={{opacity: ".6"}}>
                                                        <span className={"pi pi-eye"}
                                                              style={{color: "#888", margin: "0 5px"}}></span>
                                        <span style={{fontSize: "0.85rem",}}>{views_count}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default LastIncidents;