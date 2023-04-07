import React from 'react'
import { Link } from "react-router-dom";
import { getDistributorById, sitesToBeAlloted, updateDistributorsSite } from '../../../Services/Admin/Distributor/Controller';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from '../../../Utils/Constants.js';
import { useHistory } from 'react-router-dom';
import { CardContent, Card } from '@mui/material';
import BreadCrum from '../../CommonComponent/BreadCrum/BreadCrum.js';
import { useFormik } from 'formik';
import { AdminContractorSite } from '../../../Validations/ValidationRules.jsx';




export default function SiteDistributor() {

    const breadcrumbs = [
        { title: 'Dashboard', link: '/admin/dashboard', active: 0 },
        { title: 'Distributor', link: '/admin/distributor', active: 0 },
        { title: 'Site Allocation', link: '/admin/distributor/Site', active: 1 },
    ];
    const [sites, setSites] = useState([]);
    const [updatedSites, setUpdatedSites] = useState([]);
    const [details, setDetails] = useState([]);

    const { id } = useParams();
    const history = useHistory();

    const formik = useFormik({
        initialValues:{
          site: [],
        },
        validationSchema: AdminContractorSite,
        onSubmit: (values) => {
          console.log(values);
          handleSubmit();
          
        },
      });

    useEffect(() => {
        getAllSites();
        getDistributorDetails();
    }, []);

    const getAllSites = async () => {
        const res = await sitesToBeAlloted(id)
        setSites(res.data.data);
        console.log(res)
    }
    const getDistributorDetails = async () => {
        const res = await getDistributorById(id)
        setDetails(res.data.data);
    }

    const allsites = sites.map(getsitename)
    function getsitename(sites) {
        return { value: sites._id, label: sites.siteName }
    }

    const handleChange = (selectedOption) => {
        setUpdatedSites(selectedOption);
    }
    const handleSubmit = async () => {
        const finalSites = formik.values.site.map(getsitename)
        function getsitename(updateSites) {
            return updateSites.value
        }
        
        const res = await updateDistributorsSite(id, finalSites)

        if (Number(res.data.status) === 1) {
            toast.success(res.data.message);
            setTimeout(() => {
                history.push(`/${localStorage.getItem("role").toLowerCase()}/distributor/managesite/${id}`);
            }, TOSTIFY_TIME);
        }
        else {
            toast.error(res.data.message);
        }
    }

    return (
        <>

            <h3>Assign Sites</h3>

            {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}

            <div>

                <Card
                    style={{
                        padding: "20px",
                        borderRadius: "5px",
                        border: "1px solid",
                    }}
                >
                    <CardContent>
                        <form onSubmit={formik.handleSubmit}>
                            <div><h4>Contractor Details:</h4></div>
                            <div className='p-3'>
                                <label> Name: {details.name}</label>
                            </div>
                            <ToastContainer />
                            <div className="d-grid">
                            <h5>Select Sites <span style={{color:'red'}}>*</span> :</h5>
                                <center>
                                    {" "}
                                    <div>
                                        <Select 
                                        styles={{ width: 50 }}
                                        options={allsites}
                                        value={formik.values.site}  
                                        onBlur={()=> {formik.setTouched({ site: true });}}
                                        onChange={(selectedOption) => formik.setFieldValue('site', selectedOption)}  
                                        isMulti />
                                        <p className="from-error pull-left">{formik.errors.site  && formik.touched.site ?formik.errors.site : null}</p>
                                    </div>
                                    <div className='p-5'>
                                        <button type="submit" className="btn btn-primary " >
                                            Assign
                                        </button>
                                        <Link to={`/${localStorage.getItem("role").toLowerCase()}/distributor`}>
                                            <button className="btn btn-primary ml-4">Cancel</button>
                                        </Link>
                                    </div>
                                </center>

                            </div>
                        </form>
                    </CardContent>
                </Card>


            </div>
        </>
    )
}
