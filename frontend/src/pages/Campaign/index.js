import React, { useState } from "react";
import api from "../../services/api";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import NewCampaignModal from "../../components/NewCampaignModal";
import BaseNumbersModal from "../../components/BaseNumbersModal";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import TabGreetingTemplates from "./TabGreetingTemplates";
import TabNewCampaign from "./TabNewCampaign";
import GreetingTemplatesModal from "../../components/GreetingTemplatesModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";

import {
  Button,
  makeStyles,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@material-ui/core";
import InfoIcon from '@material-ui/icons/Info';
import PropTypes from "prop-types"; // Adicione esta linha para importar o PropTypes

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

// Função para acessibilidade
function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    //backgroundColor: theme.palette.background.paper,
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

const Campaign = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [newTemplateModalOpen, setNewTemplateModalOpen] = useState(false);
  const [newCampaignModalOpen, setNewCampaignModalOpen] = useState(false);
  const [baseNumbersModalOpen, setBaseNumbersModalOpen] = useState(false);
  const setGreetingTemplates = useState([]);
  const [deletingGreetingTemplates, setDeletingGreetingTemplates] =
    useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  // const [newTemplateData, setNewTemplateData] = useState({
  //     template: "",
  //     status: "1",
  //   });

  // Função para carregar os templates
  // useEffect(() => {
  //   const fetchTemplates = async () => {
  //     try {
  //       const response = await api.get(`/campaign`);
  //       setGreetingTemplates(response.data);
  //     } catch (error) {
  //       console.error("Erro ao carregar templates:", error);
  //     }
  //   };

  //   fetchTemplates();
  // }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleOpenNewTemplateModal = (id) => {
  //   setNewTemplateData({ id });
  //   setNewTemplateModalOpen(true);
  // };

    const handleOpenNewCampaignModal = () => {
      setNewCampaignModalOpen(true);
    };

    const handleOpenBaseNumbersModal = () => {
      setBaseNumbersModalOpen(true);
    };
    const handleCloseBaseNumbersModal = () => {
      setBaseNumbersModalOpen(false);
    };

    const handleCloseNewCampaignModal = () => {
      setNewCampaignModalOpen(false);
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
      //setSearchParam("");
      //setPageNumber(1);
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
        <BaseNumbersModal
        open={baseNumbersModalOpen}
        onClose={handleCloseBaseNumbersModal}>
        </BaseNumbersModal>
        <NewCampaignModal
          open={newCampaignModalOpen}
          onClose={handleCloseNewCampaignModal}
        />

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
        <MainHeader>
          <Title>{i18n.t("campaign.title")}</Title>
          <MainHeaderButtonsWrapper>
          <Button
              variant="contained"
              onClick={handleOpenBaseNumbersModal}
              color="primary"
              className={classes.primaryButton}
            >
              <InfoIcon/>
            </Button>
            <Button
              variant="contained"
              onClick={handleOpenNewCampaignModal}
              color="primary"
              className={classes.primaryButton}
            >
              {i18n.t("campaign.addCampaign")}
            </Button>
          </MainHeaderButtonsWrapper>
        </MainHeader>

        <Paper className={classes.tabs}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab label="Mensagens" {...a11yProps(1)} />
          </Tabs>
        </Paper>

        <TabPanel value={value} index={0}>
          <TabNewCampaign/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TabGreetingTemplates/>
        </TabPanel>
      </MainContainer>
      <GreetingTemplatesModal
        open={newTemplateModalOpen}
        onClose={handleCloseNewTemplateModal}
        onSave={handleSaveToTable}
        //greetingTemplateId={newTemplateData && newTemplateData.id}
      />
    </div>
  );
};

export default Campaign;
