import React, { useState, useEffect } from "react";
import api from "../../services/api";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import { i18n } from "../../translate/i18n";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ConfirmationModal from "../../components/ConfirmationModal";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Box,
  Typography,
  Grid,
} from "@material-ui/core";
import { Telegram, Info } from "@material-ui/icons"; // Info icon for "i"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
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
    border: "1px solid #e0e0e0", // Borda de 1px, sólida, cor cinza claro
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius, // Para bordas arredondadas, opcional
  },
  gridContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  leftColumn: {
    paddingRight: theme.spacing(2), // Adiciona espaço entre a coluna de arquivos e a tabela
  },
  rightColumn: {
    flexGrow: 1,
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
    // marginLeft: theme.spacing(1),
    borderRadius: "20px",
    display: "inline-block",
  },
}));

const TabNewCampaign = () => {
  const classes = useStyles();
  const [baseNumbers, setBaseNumbers] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null); // File ID selected
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [files, setFiles] = useState([]); // Files imported to render

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

  // Função para buscar os arquivos importados
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get(`/campaign/showFiles`);
        setFiles(response.data);
      } catch (error) {
        toast.error("Erro ao carregar os arquivos.");
      }
    };

    fetchFiles();
  }, []);

  // Função para lidar com a confirmação de disparo de mensagens
  const handleSendMessages = async () => {
    try {
      await api.post("/send-messages", { numeros: baseNumbers });
      toast.success("Mensagens disparadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao disparar mensagens.");
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

        <MainHeader>
          <Tooltip title={i18n.t("campaign.templates.tooltip")}>
            <p className={classes.subtitle}>Dashboard</p>
          </Tooltip>
          <MainHeaderButtonsWrapper>
            <Tooltip title="Disparar Mensagens">
              <Button
                variant="contained"
                onClick={() => {
                  setConfirmModalOpen(true);
                }}
                color="primary"
                className={classes.primaryButton}
              >
                  <Telegram/>
              </Button>
            </Tooltip>
          </MainHeaderButtonsWrapper>
        </MainHeader>

        {/* Grid para organizar os cards à esquerda e a tabela à direita */}
        <Grid container className={classes.gridContainer} spacing={2}>
          <Grid item xs={12} md={3} className={classes.leftColumn}>
            {files.map((file) => (
              <Paper key={file.id} className={classes.card}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography className={classes.textCardFiles}>
                    <strong>Arquivo:</strong> {file.arquivo}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setSelectedFileId(file.id);
                      fetchBaseNumbers(file.id); // Fetch numbers for the selected file
                    }}
                  >
                    <Info />
                  </IconButton>
                </Box>
                <Typography className={classes.textCardFiles}>
                  <strong>Qnt de Linhas:</strong> {file.qntLinhas}
                </Typography>
                <Typography className={classes.textCardFiles}>
                  <strong>Data Upload:</strong>{" "}
                  {format(new Date(file.createdAt), "dd/MM/yyyy HH:mm:ss")}
                </Typography>

                <Typography className={classes.textCardFiles}>
                  <strong>Status:</strong>{" "}
                  <span className={classes.pillSuccess}>Sucesso</span>
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
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Phone</TableCell>
                    <TableCell align="center">File ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {baseNumbers.map((number) => (
                    <TableRow key={number.id}>
                      <TableCell align="center">{number.id}</TableCell>
                      <TableCell align="center">{number.name}</TableCell>
                      <TableCell align="center">{number.phone}</TableCell>
                      <TableCell align="center">{number.fileId}</TableCell>
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
