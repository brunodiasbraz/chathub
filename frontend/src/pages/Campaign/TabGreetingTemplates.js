import React, { useState, useEffect } from "react";
import api from "../../services/api";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import { i18n } from "../../translate/i18n";
import GreetingTemplatesModal from "../../components/GreetingTemplatesModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import { AddCircleOutline, DeleteOutline, Edit } from "@material-ui/icons";
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Box,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    flexGrow: 1,
    margin: theme.spacing(0, 3),
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  primaryButton: {
    color: "white",
  },
  subtitle: {
    fontSize: "1.1rem",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 500,
  },
  inputField: {
    marginBottom: theme.spacing(2),
  },
}));

const TabGreetingTemplates = () => {
  const classes = useStyles();
  const [newTemplateModalOpen, setNewTemplateModalOpen] = useState(false);
  const [greetingTemplates, setGreetingTemplates] = useState([]);
  const [deletingGreetingTemplates, setDeletingGreetingTemplates] =
    useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState({
    template: "",
    status: "1",
  });

  // Função para carregar os templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await api.get(`/campaign`);
        setGreetingTemplates(response.data);
      } catch (error) {
        console.error("Erro ao carregar templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleOpenNewTemplateModal = (id = null) => {
    if (!id) {
      // Se não for passado um ID, significa que é um novo template
      setNewTemplateData({ template: "", status: "1" }); // Limpa os dados
    } else {
      // Se o ID for passado, trata-se de uma edição, mantém os dados como estão
      setNewTemplateData({ id });
    }
    setNewTemplateModalOpen(true);
  };

  const handleCloseNewTemplateModal = () => {
    setNewTemplateModalOpen(false);
  };

  const handleDeleteGreetingTemplate = async (greetingTemplateId) => {
    try {
      await api.delete(`/greetingTemplates/${greetingTemplateId}`);
      toast.success(i18n.t("campaign.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingGreetingTemplates(null);
  };

  const handleSaveToTable = (newData) => {
    setGreetingTemplates((prevTemplates) => {
      if (newData.id) {
        // Se o ID já existe, é uma edição; então, atualize o template correspondente
        return prevTemplates.map((template) =>
          template.id === newData.id ? newData : template
        );
      } else {
        // Se o ID não existe, é um novo template; adicione-o ao final da lista
        return [...prevTemplates, newData];
      }
    });
  };

  return (
    <div className={classes.root}>
      <MainContainer>
        <ConfirmationModal
          title={
            deletingGreetingTemplates
              ? `${i18n.t("campaign.confirmationModal.deleteTitle")}: ${
                  deletingGreetingTemplates.template
                }?`
              : `${i18n.t("campaign.confirmationModal.deleteAllTitle")}`
          }
          open={confirmModalOpen}
          onClose={setConfirmModalOpen}
          onConfirm={() =>
            deletingGreetingTemplates
              ? handleDeleteGreetingTemplate(deletingGreetingTemplates.id)
              : handleDeleteGreetingTemplate(deletingGreetingTemplates.id)
          }
        >
          {deletingGreetingTemplates
            ? `${i18n.t("campaign.confirmationModal.deleteMessage")}`
            : `${i18n.t("campaign.confirmationModal.deleteAllMessage")}`}
        </ConfirmationModal>
        <MainContainer>
          <MainHeader>
            <Tooltip title={i18n.t("campaign.templates.tooltip")}>
              <p className={classes.subtitle}>
                {i18n.t("campaign.templates.text")}
              </p>
            </Tooltip>
            <MainHeaderButtonsWrapper>
              <Tooltip title={i18n.t("campaign.templates.add")}>
                <Button
                  variant="contained"
                  onClick={() => handleOpenNewTemplateModal()}
                  color="primary"
                >
                  <AddCircleOutline className={classes.primaryButton} />
                </Button>
              </Tooltip>
            </MainHeaderButtonsWrapper>
          </MainHeader>
          <Paper className={classes.customTableCell} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Template</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {greetingTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell align="center">{template.id}</TableCell>
                    <TableCell align="center">{template.template}</TableCell>
                    <TableCell align="center">
                      {template.status ? "Ativo" : "Inativo"}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenNewTemplateModal(template.id)}
                      >
                        <Edit color="secondary" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setConfirmModalOpen(true);
                          setDeletingGreetingTemplates(template);
                        }}
                      >
                        <DeleteOutline color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </MainContainer>
      </MainContainer>
      <GreetingTemplatesModal
        open={newTemplateModalOpen}
        onClose={handleCloseNewTemplateModal}
        onSave={handleSaveToTable}
        greetingTemplateId={newTemplateData && newTemplateData.id}
      />
    </div>
  );
};

export default TabGreetingTemplates;
