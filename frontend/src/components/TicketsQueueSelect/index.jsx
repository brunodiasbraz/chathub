import React, { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText, IconButton } from "@material-ui/core";
import { FilterListRounded } from "@material-ui/icons";
// import { i18n } from "../../translate/i18n";

const TicketsQueueSelect = ({
  userQueues,
  selectedQueueIds = [],
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // Armazena a referência do ícone

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClickIcon = (event) => {
    setAnchorEl(event.currentTarget); // Define o ícone como âncora
    setOpen(true); // Abre o select
  };

  const handleClose = () => {
    setOpen(false); // Fecha o select
  };

  return (
    <div>
      <FormControl fullWidth margin="dense">
        <IconButton
          onClick={handleClickIcon}
          style={{padding: 0, margin: 0, borderRadius: "50%" }}
        >
          <FilterListRounded />
        </IconButton>
        <Select
          multiple
          displayEmpty
          value={selectedQueueIds}
          onChange={handleChange}
          open={open}
          onClose={handleClose}
          MenuProps={{
            anchorEl: anchorEl, // Posiciona o menu sobre o ícone
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "center",
            },
          }}
          renderValue={() => null}
          style={{ display: "none" }} // Oculta o campo do select visualmente
        >
          {userQueues?.length > 0 &&
            userQueues.map(queue => (
              <MenuItem dense key={queue.id} value={queue.id}>
                <Checkbox
                  style={{
                    color: queue.color,
                  }}
                  size="small"
                  color="primary"
                  checked={selectedQueueIds.indexOf(queue.id) > -1}
                />
                <ListItemText primary={queue.name} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TicketsQueueSelect;
