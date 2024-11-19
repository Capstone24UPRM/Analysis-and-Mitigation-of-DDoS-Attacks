import React, { useState } from 'react';
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
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Setup = () => {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [formData, setFormData] = useState({
    requirement1: '',
    requirement2: '',
    requirement3: ''
  });
  const [errors, setErrors] = useState({});

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
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors = {};
    // if (formData.requirement1.length < 5) tempErrors.requirement1 = "Minimum length is 5";
    if (!/^\d+$/.test(formData.requirement2)) tempErrors.requirement2 = "Must be a number";
    if (!/^\d+$/.test(formData.requirement3) || formData.requirement3 < 1 || formData.requirement3 > 60) tempErrors.requirement3 = "Must be a number between 1 and 60";
    // Add more validation as needed
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const response = await fetch('http://127.0.0.1:3001/saveSetup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          console.log('Data saved successfully');
          handleClose();
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleConnection = async () => {
    if (validate()) {
      try {
        const response = await fetch('http://127.0.0.1:3001/testConnection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          console.log('Connection tested successfully');
          handleClose();
        } else {
          console.error('Failed to test connection');
        }
      } catch (error) {
        console.error('Error:', error);
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
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} alignItems={"center"} className='mt-2'>
            <TextField
              label="Host/URL"
              name="requirement1"
              value={formData.requirement1}
              onChange={handleChange}
              // error={!!errors.requirement1}
              // helperText={errors.requirement1}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", mb: 2, mr: 2, ml: 2 }}>
            <Button onClick={handleSubmit} variant="contained" color="primary">
            Test Connection
            </Button>
            <Button onClick={handleConnection} variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Setup;
