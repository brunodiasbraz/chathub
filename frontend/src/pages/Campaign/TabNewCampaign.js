import React, { useState, useContext, useEffect } from "react";
import api from "../../services/api";
import MainContainer from "../../components/MainContainer";
// import MainHeader from "../../components/MainHeader";
// import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
// import { i18n } from "../../translate/i18n";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  //Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  //Tooltip,
  IconButton,
  Box,
  Typography,
  Grid,
  //CircularProgress
} from "@material-ui/core";
import { Info } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: "1px solid #e0e0e0",
    // overflow: "hidden",
  },
  customTableCell: {
    padding: theme.spacing(2),
  },
  primaryButton: {
    color: "white",
  },
  subtitle: {
    fontSize: "1.1rem",
  },
  card: {
    border: "1px solid #e0e0e0",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  gridContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  leftColumn: {
    paddingRight: theme.spacing(4),
  },
  rightColumn: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  textCardFiles: {
    fontSize: "0.9rem",
  },
  pillSuccess: {
    fontWeight: 500,
    color: "#38a169",
    backgroundColor: "#c6f6d5",
    fontSize: "12px",
    padding: "0.2rem 1rem",
    borderRadius: "20px",
    display: "inline-block",
  },
  pillPrimary: {
    fontWeight: 500,
    color: "dark",
    backgroundColor: "#F1F1F1",
    fontSize: "12px",
    padding: "0.2rem 1rem",
    borderRadius: "20px",
    display: "inline-block",
  },
  pillWarning: {
    fontWeight: 500,
    color: "#DD6B20",
    backgroundColor: "#FEEBC8",
    fontSize: "12px",
    padding: "0.2rem 1rem",
    borderRadius: "20px",
    display: "inline-block",
  },
}));

const TabNewCampaign = () => {
  const classes = useStyles();
  const [baseNumbers, setBaseNumbers] = useState([]);
  const [fileStatuses, setFileStatuses] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [/*loading,*/ setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Função para buscar os números na base pelo fileId
  const fetchBaseNumbers = async (fileId) => {
    try {
      const response = await api.get(
        `/campaign/showBaseNumbers?fileId=${fileId}`
      );
      setBaseNumbers(response.data);
    } catch (error) {
      toast.error("Erro ao carregar os números da base.");
    }
  };

  // Função para determinar o status do arquivo com base nos números
  const getFileStatus = (numbers) => {
    const allStatus = numbers.map((num) => num.status);
    if (allStatus.every((status) => status === 1)) {
      return { label: "Sucesso", class: classes.pillSuccess };
    } else if (allStatus.some((status) => status === 2)) {
      return { label: "Finalizado com Erros", class: classes.pillWarning };
    } else {
      return { label: "Pendente", class: classes.pillPrimary };
    }
  };

  // Função para buscar os arquivos importados
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get(`/campaign/showFiles`);
        const filesData = response.data;
        setFiles(filesData);

        // Carrega o status de cada arquivo ao carregar a página
        const statuses = {};
        for (let file of filesData) {
          const baseNumbersResponse = await api.get(`/campaign/showBaseNumbers?fileId=${file.id}`);
          const status = getFileStatus(baseNumbersResponse.data);
          statuses[file.id] = status;
        }
        setFileStatuses(statuses);
      } catch (error) {
        toast.error("Erro ao carregar omessages arquivos.");
      }
    };

    fetchFiles();
  }, []);

  // Função para lidar com a confirmação de disparo de mensagens
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
      <MainContainer>
        <ConfirmationModal
          title="Disparo de campanha"
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={handleSendMessages}
        >
          Deseja disparar a campanha para os números listados?
        </ConfirmationModal>

        {/* <MainHeader>
          <Tooltip title={i18n.t("campaign.templates.tooltip")}>
            <p className={classes.subtitle}>Dashboard</p>
          </Tooltip>
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
                    <Telegram size={20} color="inherit" style={{ marginRight: 8 }}/>
                    <span style={{ marginRight: 8 }}>Disparar Mensagens</span>
                  </>
                )}
              </Button>
            </Tooltip>
          </MainHeaderButtonsWrapper>
        </MainHeader> */}

        <Grid className={classes.gridContainer} spacing={2}>
          <Grid item xs={12} md={3} className={classes.leftColumn}>
            {files.map((file) => (
              <Paper key={file.id} className={classes.card}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography className={classes.textCardFiles}>
                    <strong>#</strong> {file.id}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      fetchBaseNumbers(file.id);
                    }}
                  >
                    <Info />
                  </IconButton>
                </Box>
                <Typography className={classes.textCardFiles}>
                  <strong>Arquivo:</strong> {file.arquivo}
                </Typography>
                <Typography className={classes.textCardFiles}>
                  <strong>Qnt de Linhas:</strong> {file.qntLinhas}
                </Typography>
                <Typography className={classes.textCardFiles}>
                  <strong>Data Upload:</strong>{" "}
                  {format(new Date(file.createdAt), "dd/MM/yyyy HH:mm:ss")}
                </Typography>

                <Typography className={classes.textCardFiles}>
                  <strong>Status:</strong>{" "}
                  <span className={fileStatuses[file.id]?.class || classes.pillPrimary}>
                    {fileStatuses[file.id]?.label || "Pendente"}
                  </span>
                </Typography>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12} md={9} className={classes.rightColumn}>
            <Paper className={classes.customTableCell} variant="outlined">
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
        </Grid>
      </MainContainer>
    </div>
  );
};

export default TabNewCampaign;
