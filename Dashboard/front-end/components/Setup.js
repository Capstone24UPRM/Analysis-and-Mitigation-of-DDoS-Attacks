import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Stack,
  Box,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Selector from "./SimulationSelector";


const TabPanel = ({ children, value, index }) => {
  return (
    <div style={{ display: value !== index ? 'none' : 'block' }}>
      <Box sx={{ p: 3 }}>{children}</Box>
    </div>
  );
};


const Setup = ({ formData1, setFormData1, formData2, setFormData2, setBtnVisible }) => {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [errors, setErrors] = useState({
    host: "",
    port: "",
    duration: "",
    os: "",
    hostEndpoint: "",
    hostPassword: "",
  });
  const [connectionError, setConnectionError] = useState(false);
  const [connectionSuccess, setconnectionSuccess] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    const valid = validate();
    if (valid) {
      setBtnVisible(true);
    }
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (currentTab === 0) {
      setFormData1({
        ...formData1,
        [name]: value,
      });
      if (name === "duration") {
        console.log("Setting timer to", value);
        localStorage.setItem("timer", value);
      }
    } else {
      setFormData2({
        ...formData2,
        [name]: value,
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOSChange = (event) => {
    setFormData2({ ...formData2, os: event.target.value });
  };

  const validURL = (str) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.?)+[a-zA-Z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" +
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" +
        "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    );
    return urlPattern.test(str);
  };

  const validate = () => {
    let tempErrors = {};
    if (currentTab === 0) {
      if (!validURL(formData1.host)) {
        tempErrors.host = "Please enter a valid URL";
      }
      if (!/^\d+$/.test(formData1.port)) {
        tempErrors.port = "Must be a number";
      }
      if (
        !/^\d+$/.test(formData1.duration) ||
        formData1.duration < 1 ||
        formData1.duration > 120
      ) {
        tempErrors.duration = "Must be a number between 1 and 120";
      }
    } else {

        if (formData2.os === undefined || formData2.os.length === 0) {
          tempErrors.os = "Please select an OS";
        }
        // if (!/^\d+$/.test(formData2.port)) {
        //   tempErrors.port1 = "New Port message";
        // }
        // if (formData2.hostEndpoint.length === 0) {
        //   tempErrors.hostEndpoint = "Please enter host endpoint";
        // }
    }
    // Add more validation as needed
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    const valid = validate();
    console.log(valid);
    if (valid) {
      handleClose();
    } else {
      // Add error handling
    }
  };

  const handleConnection = async () => {
    if (validate()) {
      console.log("Testing connection...");
      if (currentTab === 0) {
        const url = formData1.host;
        console.log(url);
        try {
          const response = await axios.head(url);
          setConnectionError(false);
          setconnectionSuccess(true);
          console.log(`${url} is reachable. Status: ${response.status}`);
        } catch (error) {
          setConnectionError(true);
          setconnectionSuccess(false);
          if (error.response) {
            console.log(`${url} returned status ${error.response.status}`);
          } else {
            console.error(`Error connecting to ${url}:`, error.message);
          }
        }
      } else {
        const hostConnection = formData2.hostEndpoint; // to be changed to host connection
        console.log(hostConnection);
        try {
          const response = await axios.head(hostConnection);
          setConnectionError(false);
          setconnectionSuccess(true);
          console.log(`${hostConnection} is reachable. Status: ${response.status}`);
        } catch (error) {
          setConnectionError(true);
          setconnectionSuccess(false);
          if (error.response) {
            console.log(`${hostConnection} returned status ${error.response.status}`);
          } else {
            console.error(`Error connecting to ${hostConnection}:`, error.message);
          }
        }
      }
    } else {console.log("Invalid form data");}
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Setup
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
          {"Setup"}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Attack Setup" />
          <Tab label="Host Setup" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
            <Stack spacing={2} alignItems={"center"} className="mt-2">
              <TextField
                label="Host/URL"
                name="host"
                value={formData1.host}
                onChange={handleChange}
                error={!!errors.host}
                helperText={errors.host}
                fullWidth
              />
              <TextField
                label="Port"
                name="port"
                value={formData1.port}
                onChange={handleChange}
                error={!!errors.port}
                helperText={errors.port}
                fullWidth
              />
              <TextField
                label="Duration (seconds)"
                name="duration"
                value={formData1.duration}
                onChange={handleChange}
                error={!!errors.duration}
                helperText={errors.duration}
                fullWidth
              />
            </Stack>
          </TabPanel>


          <TabPanel value={currentTab} index={1}>
            <Stack spacing={2} className="mt-2">

              <Selector 
                selectedOption={formData2.os}
                handleChange={handleOSChange} 
                label={"host OS"} 
                option1={"Darwin"} 
                // option2={"Linux"} 
                // option3={"Windows"}
                error={!!errors.os}
                helperText={errors.os}
                ></Selector>
              <TextField
                name="hostEndpoint"
                label="Host Endpoint (Optional)"
                value={formData2.hostEndpoint}
                onChange={handleChange}
              />
              <TextField
                name="hostPassword"
                label="Host Password (Optional)"
                value={formData2.hostPassword}
                onChange={handleChange}
              />
            </Stack>
            
        </TabPanel>

          <DialogContentText padding={1}>
            Please fill in the requirements and submit.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mb: 2,
              mr: 2,
              ml: 2,
            }}
          >
            {connectionError && (
              <DialogContentText marginRight={"auto"} color="red">
                <ErrorIcon /> Connection Error
              </DialogContentText>
            )}
            {connectionSuccess && (
              <DialogContentText marginRight={"auto"} color="green">
                <CheckCircleIcon /> Connected
              </DialogContentText>
            )}
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Done
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Setup;