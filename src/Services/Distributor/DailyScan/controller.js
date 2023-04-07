import axios from "axios";

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;


const getSites = (id) => {

    return axios.get(`${process.env.REACT_APP_API_URL}distributor/getsites/${id}`);

}


const getCylinders = (id) => {

    return axios.get(`${process.env.REACT_APP_API_URL}distributor/getcylinders/${id}`);

}

const getSitesCylinder = (id) => {

    return axios.get(`${process.env.REACT_APP_API_URL}distributor/getsitecylinders/${id}`);

}


const scanData = (data) => {

    return axios.post(`${process.env.REACT_APP_API_URL}distributor/scanCylinders`, data);

}

export { getSites, getCylinders, getSitesCylinder, scanData }; 