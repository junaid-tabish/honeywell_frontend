import React, { useRef } from 'react'
import { Link, useLocation } from "react-router-dom";

import {
  updateSites,
  siteToBeAlloted,
  getContractor,
} from "../../../Services/Admin/Contractor/Controller.js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from "../../../Utils/Constants.js";
import { useHistory } from "react-router-dom";
import { CardContent, Card } from "@mui/material";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum.js";
import { AdminContractorSite } from '../../../Validations/ValidationRules.jsx';
import { useFormik } from 'formik';


export default function AllotSites() {
  const [sites, setSites] = useState([]);
  const [details, setDetails] = useState([]);

  const { id } = useParams();
  const history = useHistory();
  const location = useLocation()

  const formik = useFormik({
    initialValues:{
      site: [],
    },
    validationSchema: AdminContractorSite,
    onSubmit: (values) => {
      console.log(values);
      handleFinalSubmit();
      
    },
  });

  const breadcrumbs = [
    { title: 'Dashboard', link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`, active: 0 },
    { title: 'Contractor', link: `/${localStorage.getItem("role").toLowerCase()}/contractor`, active: 0 },
    { title: 'Manage Sites', link: `/${localStorage.getItem("role").toLowerCase()}/contractor/managesites/${id}`, active: 0 },
    { title: 'Allot Sites', link: `/${localStorage.getItem("role").toLowerCase()}/contractor/allotsites/${id}`, active: 1 },
  ];

  useEffect(() => {
    getAllSites();
    getContractorDetails();
  }, []);

  // useEffect(() => {
  //   if (isMounted.current) {
  //     setIsValid(updatedSites.length == 0 ? true : false);
  //   } else {
  //     isMounted.current = true;
  //   }
  // }, [updatedSites]);

  const getAllSites = async () => {
    const res = await siteToBeAlloted(id);
    setSites(res.data.data);
  };
  const getContractorDetails = async () => {
    const res = await getContractor(id);
    setDetails(res.data.data);
  };

  const allsites = sites.map(getsitename);
  function getsitename(sites) {
    return { value: sites._id, label: sites.siteName };
  }

  const handleFinalSubmit = async () => {
       const finalSites = formik.values.site.map(getsitename);
    function getsitename(updateSites) {
      return updateSites.value;}
    const res = await updateSites(id, finalSites);
    if (Number(res.data.status) === 1) {
      toast.success(res.data.message);
      setTimeout(() => {
        history.push({
          pathname: `/${localStorage.getItem("role").toLowerCase()}/contractor/managesites/${id}`
        });
      }, TOSTIFY_TIME);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <>


      <h3> Allocate Site To Contractor</h3>
      {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
      <div>

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
                <div>
                  <h4>Contractor Details:</h4>
                </div>
                <div className="p-3">
                  <label> Name: {details.name}</label>
                </div>
                <ToastContainer />
                <div className="d-grid">
                  <h5>Select Sites <span style={{color:'red'}}>*</span> :</h5>
                  <center>
                    {" "}
                    <div>
                      <Select
                       name='site' 
                       styles={{ width: 50 }} 
                       options={allsites} 
                       value={formik.values.site}  
                       onBlur={()=> {formik.setTouched({ site: true });}}
                       onChange={(selectedOption) => formik.setFieldValue('site', selectedOption)} 
                       isMulti  />
                      <p className="from-error pull-left">{formik.errors.site  && formik.touched.site ?formik.errors.site : null}</p>
                    </div>
                    <div className="p-5">
                      <button type="submit"  className="btn btn-primary ">
                        Assign
                      </button>
                      <Link
                        to={`/${localStorage  
                          .getItem("role")
                          .toLowerCase()}/contractor/managesites/${id}`}
                      >
                        <button className="btn btn-primary ml-4">Cancel</button>
                      </Link>
                    </div>
                  </center>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

    </>

  )

};
