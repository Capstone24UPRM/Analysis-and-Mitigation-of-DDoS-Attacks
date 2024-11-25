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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Setup = ({ formData, setFormData }) => {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [errors, setErrors] = useState({
    requirement1: "",
    requirement2: "",
    requirement3: "",
  });
  const [connectionError, setConnectionError] = useState(false);
  const [connectionSuccess, setconnectionSuccess] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    if (!validURL(formData.requirement1)) {
      tempErrors.requirement1 = "Please enter a valid URL";
    }
    if (!/^\d+$/.test(formData.requirement2)) {
      tempErrors.requirement2 = "Must be a number";
    }
    if (
      !/^\d+$/.test(formData.requirement3) ||
      formData.requirement3 < 1 ||
      formData.requirement3 > 60
    ) {
      tempErrors.requirement3 = "Must be a number between 1 and 60";
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
    }
  };

  const handleConnection = async () => {
    if (validate()) {
      const url = formData.requirement1;
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
    }
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
          <Stack spacing={2} alignItems={"center"} className="mt-2">
            <TextField
              label="Host/URL"
              name="requirement1"
              value={formData.requirement1}
              onChange={handleChange}
              error={!!errors.requirement1}
              helperText={errors.requirement1}
              fullWidth
            />
            <TextField
              label="Port"
              name="requirement2"
              value={formData.requirement2}
              onChange={handleChange}
              error={!!errors.requirement2}
              helperText={errors.requirement2}
              fullWidth
            />
            <TextField
              label="Duration (seconds)"
              name="requirement3"
              value={formData.requirement3}
              onChange={handleChange}
              error={!!errors.requirement3}
              helperText={errors.requirement3}
              fullWidth
            />
          </Stack>
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
            <Button
              onClick={handleConnection}
              variant="contained"
              color="primary"
            >
              Test Connection
            </Button>
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
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Setup;
