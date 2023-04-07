import React, {  useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import { updateSites, getContractor,getDistributorSites, siteAlloted, getBatches, getDistributorDetails, getCylinderFromBatch, assignCylinder } from '../../../Services/Admin/Contractor/Controller.js';
import { useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from "react-toastify";
import { TOSTIFY_TIME } from '../../../Utils/Constants.js';
import { useHistory } from 'react-router-dom';
import { CardContent , Card } from '@mui/material';
import BreadCrum from '../../CommonComponent/BreadCrum/BreadCrum.js';
import { useFormik } from 'formik';
import { AdminContractorCylinder } from '../../../Validations/ValidationRules.jsx';

export default function AssignCylinder() {
      const isMounted = useRef(false);
      const [distributorDetails, setDistributorDetails] = useState([""]);
      const [sites, setSites] = useState([]);
      const [selectedSite, setSelectedSite] = useState([]);
      const[selectedCylinder,setSelectedCylinder]=useState([]);
      const [cylinders, setCylinders] = useState([]);
      const [batches, setBatches] = useState([]);
      const {id} =useParams();
      const history = useHistory();
      const location = useLocation()
      const [breadcumData, setbreadcumData] = useState(location.state.breadCrum)
      const [contractorDetails, setContractorDetails] = useState(location.state.row);

      
  const formik = useFormik({
    initialValues:{
      batch:"",
      site: "",
      cylinder:[],
    },
    validationSchema: AdminContractorCylinder,
    onSubmit: (values) => {
     console.log(values);
     handleFinalSubmit();
    },
  });

      const getDistributor = async () => {
        const res= await getDistributorDetails(id);
        setDistributorDetails(res.data.data);
      }
    
      useEffect(() => {
        getDistributor();
        getContracto();
        getAllSites();
      },[]);

      useEffect(() => {
        if (isMounted.current) {
          getBatchDetails();
        } else {
          isMounted.current = true;
        }
      }, [distributorDetails])
      

      const getAllSites = async () => {
        const res= await siteAlloted(id)
        setSites(res.data.data);
      }
      const getContracto = async () => {
        const res= await getContractor(id)
        setContractorDetails(res.data.data);
      }

      const getBatchDetails = async () => {
        const res= await getBatches(distributorDetails._id)
        setBatches(res.data);
      }

      const getCylinderDetails = async (value) => {
        const res= await getCylinderFromBatch(value)
        setCylinders(res.data.data);
      }

    const allBatches= batches.map(getbatchname)
    function getbatchname(batches){
        return { value: batches._id, label: batches.batchName }
    }

    const allSites= sites.map(getsitename)
    function getsitename(sites){
        return { value: sites._id, label: sites.siteName }
    }
    const allCylinders= cylinders.map(getcylindername)
    function getcylindername(cylinders){
        return { value: cylinders._id, label: cylinders.cylinderId }
    }

    const finalCylinders=selectedCylinder.map(cylinderid)
    function cylinderid(selectedCylinder){
        return  selectedCylinder.value
    }

    const handleBatchChange=(selectedOption) =>{
      getCylinderDetails(selectedOption.value);

    }
    const handleSiteChange=(selectedOption) =>{
      setSelectedSite(selectedOption.value);
    }

    const handleCylinderChange=(selectedOption) =>{
      setSelectedCylinder(selectedOption);
    }
    const handleFinalSubmit = async () => {
        const finalData={
        distributorId: distributorDetails._id,
        siteId: selectedSite,
        cylinders: finalCylinders,
        distributorId: distributorDetails._id
      }
      const res= await assignCylinder(id,finalData)
    if (Number(res.data.status) === 1) {
      toast.success(res.data.message);
      setTimeout(() => {
        history.push(`/${localStorage.getItem("role").toLowerCase()}/contractor`);
      }, TOSTIFY_TIME);
    }
      else {
        toast.error(res.data.message);
      } 
      

    }
  return (
    <>
    <div>
        
        <h3>Manage Cylinder</h3>
      <div>

      {breadcumData && <BreadCrum breadcrumbs={breadcumData} />}
        <Card
          style={{
            padding: "20px",
            borderRadius: "5px",
            border: "1px solid",
          }}
        >
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
            {localStorage.getItem("role").toLowerCase()==="admin"?<div><h4>Distributor :</h4> <div className='p-3'>
                <label> Name: {distributorDetails.name}</label>               
              </div><div><h4>Contractor :</h4><div className='p-3'>
                <label> Name: {contractorDetails.name}</label>               
              </div></div>
              </div>:<div><h4>Contractor :</h4><div className='p-3'>
                <label> Name: {contractorDetails.name}</label>               
              </div></div>}
             
              
              
              <ToastContainer />
              <div className="d-grid">
              <h5>Select Batch <span style={{color:'red'}}>*</span>:</h5>
                  {" "}
                  <div>
                    <Select
                    name='batch'
                      styles={{width:50}} 
                      maxMenuHeight={120} 
                      options={allBatches} 
                      //  value={formik.values.batch}
                      onBlur={()=> {formik.setTouched({ batch: true });}}
                      onChange={(selectedOption) =>{ formik.setFieldValue('batch', selectedOption.value); getCylinderDetails(selectedOption.value)}} />
                      <p className="from-error">{formik.errors.batch && formik.touched.batch ?formik.errors.batch : null}</p>
                  </div>
                  <h5>Select Sites <span style={{color:'red'}}>*</span>:</h5>
                  <div>
                    <Select 
                    name='site'
                    styles={{width:50}} 
                    maxMenuHeight={120} 
                    options={allSites} 
                    //  value={formik.values.site}
                    onBlur={()=> {formik.setTouched({ site: true });}}
                    onChange={(selectedOption) => {formik.setFieldValue('site', selectedOption.value); setSelectedSite(selectedOption.value)}} />
                    <p className="from-error">{formik.errors.site && formik.touched.site ?formik.errors.site : null}</p>
                  </div>
                  <h5>Select Cylinder <span style={{color:'red'}}>*</span>:</h5>
                  <div>
                    <Select
                    name='cylinder'
                     styles={{width:50}} 
                     maxMenuHeight={120} 
                     options={allCylinders} 
                    value={formik.values.cylinder}
                    onBlur={()=> {formik.setTouched({ cylinder: true });}}
                     onChange={(selectedOption) =>{ formik.setFieldValue('cylinder', selectedOption); setSelectedCylinder(selectedOption);}} 
                     isMulti/>
                     <p className="from-error">{formik.errors.cylinder && formik.touched.cylinder ?formik.errors.cylinder : null}</p>
                  </div>
                  <div className='p-5'>
                    <div className="d-flex align-item-center justify-content-center p-3"></div>
                  <button type="submit"  className="btn btn-primary " >
                    Assign
                  </button>
                  <Link to={`/${localStorage.getItem("role").toLowerCase()}/contractor`}>
                    <button className="btn btn-primary ml-4">Cancel</button>
                  </Link>
                  </div>
                
              </div>
            </form>
          </CardContent>
        </Card>
</div>
        
    </div>
    </>
    
  )
}
