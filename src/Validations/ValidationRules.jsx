import * as Yup from "yup";


// Registration Validation

export const registration= Yup.object({
    name: Yup.string().min(4).max(20).required("Please enter your name"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
    passwordConfirmation: Yup.string()
    .required("Please enter same password ")
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    role: Yup.string().required("Please select your role")
   });


//Login Validation

export const login = Yup.object({
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
   
   });


//Admin----->Distributor validation
export const Distributor= Yup.object({
    name: Yup.string().min(4).max(20).required("Please enter your name"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
    status: Yup.number().required("Please select status")
    // role: Yup.string().required("Please select your role")
   });

//Admin.........>Contractor validation
export const Contractor = Yup.object({
    name: Yup.string().min(4).max(20).required("Please enter your name"),
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().min(6).required("Please enter your password") ,
    status: Yup.number().required("Please select status")
   });

//Admin---------------->Batch Validation
export const batch = Yup.object({
    batchName: Yup.string().min(4).max(20).required("Please enter name"),
    batchId: Yup.string().min(5).required("Please enter ID"),
    
   });

//Admin----------------------->Site validation
export const Site= Yup.object({
    siteName:Yup.string().required("Site Name is required").matches(/^[a-zA-Z ]+$/,"Enter Valid Name"),
    latitude:Yup.string().required("Please enter your latitude"),
    longitude: Yup.string().required("Please enter your longitude") ,
    distributor: Yup.string().required("Please select distributor") ,
    contractor: Yup.string().required("Please select contractor") ,
    status: Yup.string().required("Please Select status") 
    
   });

// Admin----------------------->Contractor Site Validation
export const AdminContractorSite= Yup.object().shape({
    site:Yup.array().min(1, 'Please select a site ').required('please select')
      
  });
   
export const AdminContractorCylinder= Yup.object().shape({
   batch:Yup.string().required('Please select Batch'),
   site:Yup.string().required('Please select Site'),
   cylinder:Yup.array().min(1, 'Please select Cylinder ')
  });
  export const AdminDistributorBatch= Yup.object().shape({
    batch:Yup.array().min(1, 'Please select a batch ').required('please select')
      
  });

  export const AdminCylinder= Yup.object().shape({
    batch:Yup.array().min(1, 'Please select a batch ').required('please select'),
    id:Yup.string().required("Please generate Id")
  });

  export const AssetTrack= Yup.object().shape({
    distributor:Yup.array().min(1, 'Please select Distributor ').required('please select'),
  });