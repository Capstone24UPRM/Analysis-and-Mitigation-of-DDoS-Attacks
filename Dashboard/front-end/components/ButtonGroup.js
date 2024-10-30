import { useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

export default function WindowSelection({ label1, label2, onSelect }) {
  const [selected, setSelected] = useState(label1);

  const buttonStyle = (label) => ({
    width: { xs: "100%", sm: 150, md: 500 },
    backgroundColor: selected === label ? "gray" : "darkgray",
    borderColor: "gray",
  });

  const handleSelect = (label) => {
    setSelected(label);
    onSelect(label);
  };

  return (
    <ButtonGroup
      disableElevation
      variant="contained"
      sx={{
        ".MuiButtonGroup-grouped:not(:last-of-type)": {
          borderColor: "black",
        },
      }}
    >
      <Button sx={buttonStyle(label1)} onClick={() => handleSelect(label1)}>
        {label1}
      </Button>
      <Button sx={buttonStyle(label2)} onClick={() => handleSelect(label2)}>
        {label2}
      </Button>
    </ButtonGroup>
  );
}
