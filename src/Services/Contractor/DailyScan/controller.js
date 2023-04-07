import axios from "axios";

axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;


const getSitesOfContractor = (id) => {

    return axios.get(`${process.env.REACT_APP_API_URL}contractor/getsites/${id}`);

}


const getCylindersOfContractor = (id) => {

    return axios.get(`${process.env.REACT_APP_API_URL}contractor/getcylinders/${id}`);

}


export { getSitesOfContractor, getCylindersOfContractor }; 