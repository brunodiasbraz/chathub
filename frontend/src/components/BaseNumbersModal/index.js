import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
// import { i18n } from "../../translate/i18n";
import api from "../../services/api";
// import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import { toast } from "react-toastify";
import { format } from "date-fns";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  makeStyles,
  CircularProgress
} from "@material-ui/core";
import { Telegram } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  primaryButton: {
    color: "white",
  },
  modalBox: {
    padding: "2rem",
    backgroundColor: "#fff",
  },
  dialogPaper: {
    width: "70%",
    maxHeight: "70vh",
  },
  customTableCell: {
    padding: theme.spacing(0,3),
    width: "100%",
    marginBottom: theme.spacing(3),
  },
}));

export default function BaseNumbersModal({ open, onClose, fileId}) {
  const classes = useStyles();
  const [baseNumbers, setBaseNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleClose = () => {
    onClose();
  };

  useEffect( () => {
    if (open && fileId) {
      fetchBaseNumbers(fileId);
    }
  }, [open, fileId]);

  // Função para buscar os números na base pelo fileId
  const fetchBaseNumbers = async (fileId) => {
    try {
      const response = await api.get(
        `/campaign/showBaseNumbers?fileId=${fileId}`
      );
      console.log(response)
      setBaseNumbers(response.data);
    } catch (error) {
      toast.error("Erro ao carregar os números da base.");
    }
  };

  const handleSendMessages = async () => {
    setLoading(true);

    try {
      const response = await api.post("/send-messages", { numeros: baseNumbers, user });
      toast.success(response.data);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        classes={{ paper: classes.dialogPaper }} 
      >
        <MainHeader>
        <DialogTitle>Base de Numeros para Disparo</DialogTitle>
          <MainHeaderButtonsWrapper>
            <Tooltip title="Disparar Mensagens">
              <Button
                variant="contained"
                onClick={handleSendMessages}
                color="primary"
                className={classes.primaryButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" style={{ marginRight: 8 }} />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Telegram size={20} color="inherit" style={{ marginRight: 8 }} />
                    <span style={{ marginRight: 8 }}>Disparar Mensagens</span>
                  </>
                )}
              </Button>
            </Tooltip>
          </MainHeaderButtonsWrapper>
        </MainHeader>
        
        <Grid item xs={12} md={12} className={classes.customTableCell}>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Nome Cliente</TableCell>
                  <TableCell align="center">Número</TableCell>
                  <TableCell align="center">ID Arquivo</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Atualizado em</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {baseNumbers.map((number) => (
                  <TableRow key={number.id}>
                    <TableCell align="center">{number.id}</TableCell>
                    <TableCell align="center">{number.name}</TableCell>
                    <TableCell align="center">{number.phone}</TableCell>
                    <TableCell align="center">{number.fileId}</TableCell>
                    <TableCell align="center">
                      <span className={
                        number.status === 0 ? classes.pillPrimary :
                          number.status === 1 ? classes.pillSuccess :
                            number.status === 2 ? classes.pillWarning : ""
                      }>
                        {number.status === 0 ? "Não Enviado" :
                          number.status === 1 ? "Sucesso" :
                            number.status === 2 ? "Erro" : ""}
                      </span>
                    </TableCell>
                    <TableCell align="center">{format(new Date(number.updatedAt), "dd/MM/yyyy HH:mm:ss")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Dialog>
    </div>
  );
}
BaseNumbersModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileId: PropTypes.number,
};