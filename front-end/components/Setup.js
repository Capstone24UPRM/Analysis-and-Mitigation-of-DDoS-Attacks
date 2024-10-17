import { useState, Fragment } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { Stack, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function Setup() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Fragment>
        <Button variant="contained" onClick={handleClickOpen}>
          <SettingsIcon />
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
          <DialogTitle
            id="responsive-dialog-title"
            sx={{ textAlign: "center" }}
          >
            {"Setup"}
          </DialogTitle>
          <DialogContent>
            {/* Temporary Content */}
            <Stack spacing={2} alignItems={"center"}>
              <Button variant="contained">Requirement 1</Button>
              <Button variant="contained">Requirement 2</Button>
              <Button variant="contained">Requirement 3</Button>
              <Button variant="contained">Requirement 4</Button>
              <Button variant="contained">Requirement 5</Button>
              <Button variant="contained">Requirement 6</Button>
            </Stack>

            <DialogContentText padding={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse sagittis accumsan commodo. Nunc justo libero,
              vestibulum quis mauris quis, dictum suscipit sapien.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Box sx={{ textAlign: "center", width: "100%" }}>
              <Button onClick={handleClose} autoFocus variant="contained">
                Done
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Fragment>
    </ThemeProvider>
  );
}
