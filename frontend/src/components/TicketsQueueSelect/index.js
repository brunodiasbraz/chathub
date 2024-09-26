import React, { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Checkbox, ListItemText, IconButton } from "@material-ui/core";
import { FilterListRounded } from "@material-ui/icons";
import { i18n } from "../../translate/i18n";

const TicketsQueueSelect = ({
  userQueues,
  selectedQueueIds = [],
  onChange,
}) => {
  const [open, setOpen] = useState(false); // Gerencia o estado do select aberto ou fechado

  const handleChange = e => {
    onChange(e.target.value);
  };

  const handleClickIcon = () => {
    setOpen(true); // Abre o select ao clicar no ícone
  };

  const handleClose = () => {
    setOpen(false); // Fecha o select
  };

  return (
    <div style={{ width: 120, marginTop: -4 }}>
      <FormControl fullWidth margin="dense">
        <IconButton onClick={handleClickIcon} style={{ width: "50px", borderRadius: "0%", left: "20%"}}>
          <FilterListRounded />
        </IconButton>
        <Select
          multiple
          displayEmpty
          value={selectedQueueIds}
          onChange={handleChange}
          open={open}
          onClose={handleClose}
          style={{ display: open ? "block" : "none" }} // Esconde o select quando não está aberto
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            getContentAnchorEl: null,
          }}
          renderValue={() => i18n.t("ticketsQueueSelect.placeholder")}
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