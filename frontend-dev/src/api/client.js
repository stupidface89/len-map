import axios from "axios";

const BASE_URL = '/';

export const urls = {
	get_create_incidents: 'api/v1/incidents/',
    get_coords_incidents: 'api/v1/incidents/on-map/',
    retrieve_update_delete_incident: 'api/v1/incidents/{incident_id}',
}

export const client = axios.create({
    withCredentials: true,
    baseURL: BASE_URL,
    timeout: 7000,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    }
});
