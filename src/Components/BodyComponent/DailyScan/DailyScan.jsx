import React, { useState, useEffect } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import BreadCrum from "../../CommonComponent/BreadCrum/BreadCrum.js";
import PaginationModule from "../../CommonComponent/Pagination/PaginationModule";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Select from "react-select";
import { ToastContainer } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { USER_CONTRACTOR, USER_DISTRIBUTOR } from "../../../Utils/Constants.js";

import {
  getSites,
  getCylinders,
  getSitesCylinder,
  scanData
} from "../../../Services/Distributor/DailyScan/controller.js";
import { Box } from "@mui/system";
import { FILLEDSTATUS, STATUS } from "../../../Utils/Constants.js";
import { getCylindersOfContractor, getSitesOfContractor } from "../../../Services/Contractor/DailyScan/controller.js";
export default function DailyScan() {

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#3f51b5",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));


  const [page, setPage] = useState();
  const [site, setSite] = useState([]);
  const [cylinder, setCylinder] = useState([]);
  const [check, setCheck] = useState([]);
  const [unCheck, setUnCheck] = useState([]);
  const [radio1, setRadio1] = useState('');
  const [radio2, setRadio2] = useState('');
  const [active, setActive] = useState(true);
  const [sactive, setSactive] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const token = localStorage.getItem("token");


  const [role, setRole] = useState(localStorage.getItem("role"));
  var decoded = jwtDecode(token);

  const breadcrumbs = [
    { title: "Dashboard", link: `/${localStorage.getItem("role").toLowerCase()}/dashboard`, active: 0 },
    { title: "Daily Scan", link: `/${localStorage.getItem("role").toLowerCase()}/dailyScan`, active: 1 },
  ];



  useEffect(() => {

    if (decoded.userRole === USER_DISTRIBUTOR) {

      getSites(decoded.userId).then((res) => {
        setSite(
          res.data.data.map((site) => {
            return { value: site._id, label: site.siteName };
          })
        );
      });

      getCylinders(decoded.userId).then((res) => {
        setCylinder(res.data.data);

        setTotalCount(cylinder.length);
      });
    }
    else if (decoded.userRole === USER_CONTRACTOR) {

      getSitesOfContractor(decoded.userId).then((res) => {
        setSite(
          res.data.data.map((site) => {
            return { value: site._id, label: site.siteName };
          })
        );
      });

      getCylindersOfContractor(decoded.userId).then((res) => {
        setCylinder(res.data.data);
        setTotalCount(cylinder.length);
      });

    }


  }, []);






  const handleSite = (selectedOption) => {
    getSitesCylinder(selectedOption.value).then((res) => {
      setCylinder(res.data.data);
    });
  };
  const handleCheck = (element) => {
    if (check.length) {
      if (check.includes(element._id)) {
        setCheck(check.filter((ele) => JSON.stringify(ele) !== JSON.stringify(element._id)))
      }
      else {
        setCheck([...check, element._id])
      }
    }
    else {
      setCheck([...check, element._id])
      cylinder.map((i) => {
        if (!check.includes(i._id)) {
          setUnCheck([...unCheck, i._id])
        }

      })

    }
  }


  const handleCheckAll = (element) => {

    if (check.length === 0) {
      let data = [];
      cylinder.map((ele) => {
        data.push(ele._id)
      })
      setCheck(data)
    }
    else if ((check.length === cylinder.length) !== 0) {
      setCheck([])
    }
    else {
      let data = [];
      cylinder.map((ele) => {
        if (!check.includes(ele._id)) {
          data.push(ele._id);
        }
      })
      setCheck([...check, data])
    }
  }

  const handleChange1 = (event) => {
    setRadio1(event.target.value);
  };
  const handleChange2 = (event) => {
    setRadio2(event.target.value);
  };



  const handleScan = async (event) => {
    setSactive(true);
    setActive(false);
    event.preventDefault();
    const data = {
      userId: decoded.userId,
      scanType: radio1,
      counterfeitCylinders: unCheck,
      countOfScanCylinders: check.length,
      countOfTotalCylinders: cylinder.length,
      scanCylinders: [
        {
          method: radio2,
          cylinderId: check,
        }
      ],
    }

    const res = await scanData(data);
    if (res.data.status === 1) {
      toast.success(res.data.message);
    }
    else if (res.data.status === 0) {
      let message = "";
      if (typeof res.data.data === "string") {
        message = res.data.message;
      } else {
        message = res.data.data.errors[0].msg;
      }
      toast.error(message);
    }
  }


  const handleScanMore = () => {
    setSactive(false);
    setActive(true);
    setRadio1('');
    setRadio2('');
    setCheck([]);
  }

  return (
    <>
      <h3>Daily Scan</h3>
      <div>
        {breadcrumbs && <BreadCrum breadcrumbs={breadcrumbs} />}
        {role === USER_DISTRIBUTOR && (
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

                  <Box

                    sx={{ display: "flex", gap: "30px", alignItems: "center  " }}
                  >

                    <FormLabel
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                      }}
                      row
                    >
                      <Typography variant="h6">Scan Type :</Typography>
                    </FormLabel>
                    <RadioGroup sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      defaultValue: { radio1 }

                    }}

                      row aria-label="scanType" name="Scan Type" value={radio1} onChange={handleChange1}>
                      <FormControlLabel value="INBOUND" control={<Radio />} label="INBOUND" />
                      <FormControlLabel value="OUTBOUND" control={<Radio />} label="OUTBOUND" />
                    </RadioGroup>
                  </Box>
                  <Box

                    sx={{ display: "flex", gap: "30px", alignItems: "center  " }}
                  >

                    <FormLabel
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                      }}
                      row
                    >
                      <Typography variant="h6">Scan Method :</Typography>
                    </FormLabel>
                    <RadioGroup sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      defaultValue: { radio2 }
                    }}
                      row aria-label="gender" name="Scan Method" value={radio2} onChange={handleChange2}>
                      <FormControlLabel value="RFID" control={<Radio />} label="RFID" />
                      <FormControlLabel value="NFC" control={<Radio />} label="NFC" />
                      <FormControlLabel value="MANNUAL" control={<Radio />} label="MANNUAL" />
                    </RadioGroup>
                  </Box>

                  <div className="form-content form-container">
                    <div className="d-grid">
                      <div>
                        <Grid container className="mt-3 ">
                          <Grid item lg={0}></Grid>
                          <h5> Select Location :</h5>
                          <Grid item lg={0.2}></Grid>
                          <Select
                            options={site}
                            maxMenuHeight={120}
                            onChange={handleSite}
                            autosize={false}
                          />
                        </Grid>
                      </div>

                      <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-center p-3"></div>
                    </div>
                  </div>

                  <div className="buttons justify-content:center">
                    <Stack spacing={2} direction="row">
                      <Button variant="contained" onClick={handleScan} disabled={sactive}>Scan</Button>
                      <Button variant="contained" onClick={handleScanMore} disabled={active} color="primary">
                        Scan More
                      </Button>
                      <Button variant="contained" color="success" onClick={handleScanMore}>
                        Done
                      </Button>
                    </Stack>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <ToastContainer />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center"> <Checkbox checked={(check.length === cylinder.length) && (check.length !== 0 && check.length !== 0)} onChange={handleCheckAll} /></StyledTableCell>
                      <StyledTableCell align="center">CylinderId</StyledTableCell>
                      <StyledTableCell align="center">
                        Filled Status
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Replacement Request
                      </StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cylinder.length !== 0 ? (
                      cylinder.map((row, i) => (
                        <>
                          <StyledTableRow key={i} align="center">
                            <Checkbox checked={check?.includes(row._id)} onChange={() => handleCheck(row)} />
                            <StyledTableCell align="center">
                              {row.cylinderId}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {FILLEDSTATUS[row.filledStatus]}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.replacementRequest ? "Yes" : "No"}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {STATUS[row.status]}
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))
                    ) : (
                      <>
                        <StyledTableCell align="center" colSpan={7}>
                          No Data Found
                        </StyledTableCell>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className="mt-2 pull-right">
              <PaginationModule
                page={page}
                count={Math.ceil(totalCount / 5)}
                tot
                setPage={(page) => setPage(page)}
              />
            </div>
          </div>
        )}
        {role === USER_CONTRACTOR && (
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

                  <Box

                    sx={{ display: "flex", gap: "30px", alignItems: "center  " }}
                  >

                    <FormLabel
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                      }}
                      row
                    >
                      <Typography variant="h6">Scan Type :</Typography>
                    </FormLabel>
                    <RadioGroup sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      defaultValue: { radio1 }

                    }}

                      row aria-label="scanType" name="Scan Type" value={radio1} onChange={handleChange1}>
                      <FormControlLabel value="INBOUND" control={<Radio />} label="INBOUND" />
                      <FormControlLabel value="OUTBOUND" control={<Radio />} label="OUTBOUND" />
                    </RadioGroup>
                  </Box>
                  <Box

                    sx={{ display: "flex", gap: "30px", alignItems: "center  " }}
                  >

                    <FormLabel
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "black",
                      }}
                      row
                    >
                      <Typography variant="h6">Scan Method :</Typography>
                    </FormLabel>
                    <RadioGroup sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "black",
                      defaultValue: { radio2 }
                    }}
                      row aria-label="gender" name="Scan Method" value={radio2} onChange={handleChange2}>
                      <FormControlLabel value="RFID" control={<Radio />} label="RFID" />
                      <FormControlLabel value="NFC" control={<Radio />} label="NFC" />
                      <FormControlLabel value="MANNUAL" control={<Radio />} label="MANNUAL" />
                    </RadioGroup>
                  </Box>

                  <div className="form-content form-container">
                    <div className="d-grid">
                      <div>
                        <Grid container className="mt-3 ">
                          <Grid item lg={0}></Grid>
                          <h5> Select Location :</h5>
                          <Grid item lg={0.2}></Grid>
                          <Select
                            options={site}
                            maxMenuHeight={120}
                            onChange={handleSite}
                            autosize={false}
                          />
                        </Grid>
                      </div>

                      <div className="form-button mt-3 px-3 d-flex align-item-center justify-content-center p-3"></div>
                    </div>
                  </div>

                  <div className="buttons justify-content:center">
                    <Stack spacing={2} direction="row">
                      <Button variant="contained" onClick={handleScan} disabled={sactive}>Scan</Button>
                      <Button variant="contained" onClick={handleScanMore} disabled={active} color="primary">
                        Scan More
                      </Button>
                      <Button variant="contained" color="success" onClick={handleScanMore}>
                        Done
                      </Button>
                    </Stack>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <ToastContainer />
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center"> <Checkbox checked={(check.length === cylinder.length) && (check.length !== 0 && check.length !== 0)} onChange={handleCheckAll} /></StyledTableCell>
                      <StyledTableCell align="center">CylinderId</StyledTableCell>
                      <StyledTableCell align="center">
                        Filled Status
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Replacement Request
                      </StyledTableCell>
                      <StyledTableCell align="center">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cylinder.length !== 0 ? (
                      cylinder.map((row, i) => (
                        <>
                          <StyledTableRow key={i} align="center">
                            <Checkbox checked={check?.includes(row._id)} onChange={() => handleCheck(row)} />
                            <StyledTableCell align="center">
                              {row.cylinderId}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {FILLEDSTATUS[row.filledStatus]}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.replacementRequest ? "Yes" : "No"}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {STATUS[row.status]}
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      ))
                    ) : (
                      <>
                        <StyledTableCell align="center" colSpan={7}>
                          No Data Found
                        </StyledTableCell>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className="mt-2 pull-right">
              <PaginationModule
                page={page}
                count={Math.ceil(totalCount / 5)}
                tot
                setPage={(page) => setPage(page)}
              />
            </div>
          </div>
        )}

      </div>


    </>
  );
}
