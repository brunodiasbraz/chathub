import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    // padding: theme.spacing(1),
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4),
    borderRadius: "4px",
    position: "sticky",
    top: theme.spacing(8),
  },
  instructionContainer: {
    padding: theme.spacing(1, 4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: "4px",
    border: "1px solid rgba(0, 0, 0, 0.1);",
  },
  input: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
  fileInput: {
    marginTop: theme.spacing(2),
  },
  color: {
    color: theme.palette.primary.main,
  },
  text: {
    marginBottom: theme.spacing(1),
  },
  textP: {
    marginBottom: theme.spacing(2),
  },
  observacao: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
  },
}));

const Campaign = () => {
  const classes = useStyles();
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (csvFile) {
      // Aqui você pode implementar a lógica de envio do arquivo para o backend
      console.log("Arquivo CSV selecionado:", csvFile);
    } else {
      console.log("Por favor, selecione um arquivo CSV.");
    }
  };

  return (
    <div className={classes.root}>
      <Container className={classes.root}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Paper className={classes.instructionContainer}>
              <h2>Documentação para envio de mensagens</h2>
              <h2 className={classes.color}>Métodos de Envio</h2>
              <p className={classes.text}>1. Mensagens de Texto</p>
              <p className={classes.text}>2. Mensagens de Mídia</p>

              <h2 className={classes.color}>Instruções</h2>
              <p>
                <b>Observações Importantes</b>
              </p>
              <ul>
                <li className={classes.text}>
                  Para pegar o token da API, vá em API key que seu token estará
                  lá, sem ele não será possível enviar mensagens.
                </li>
                <li className={classes.text}>
                  O número para envio não deve ter máscara ou caracteres
                  especiais e deve ser composto por:
                </li>
                <ul>
                  <li className={classes.text}>
                    Código do país - Ex: 55 (Brasil)
                  </li>
                  <li className={classes.text}>DDD</li>
                  <li className={classes.text}>Número</li>
                </ul>
              </ul>

              <h2 className={classes.color}>1. Mensagens de Texto</h2>
              <p>
                Seguem abaixo lista de informações necessárias para envio das
                mensagens de texto:
              </p>
              <p className={classes.textP}>
                <b>URL: </b>
                {process.env.REACT_APP_BACKEND_URL}/api/messages/send
              </p>
              <p className={classes.textP}>
                <b>Método: </b>POST
              </p>
              <p className={classes.textP}>
                <b>Headers: </b>Authorization: Bearer (token) e Content-Type
                application/json
              </p>
              <p className={classes.textP}>
                <b>Body: </b>"number": "5599999999999", "body": "Enviado via
                api", "userId": "1", "queueId": "1", "whatsappId": "1"
              </p>

              <h2 className={classes.color}>2. Mensagens de Mídia</h2>
              <p>
                Seguem abaixo lista de informações necessárias para envio de
                mídias:
              </p>
              <p className={classes.textP}>
                <b>URL: </b>
                {process.env.REACT_APP_BACKEND_URL}/api/messages/send
              </p>
              <p className={classes.textP}>
                <b>Método: </b>POST
              </p>
              <p className={classes.textP}>
                <b>Headers: </b>Authorization: Bearer (token) e Content-Type
                multipart/form-data
              </p>
              <p className={classes.textP}>
                <b>Body: </b>"number": "5599999999999", "medias": "aqui vai sua
                mídia", "body": "Enviado via api", "userId": "1", "queueId":
                "1", "whatsappId": "1"
              </p>
            </Paper>
          </Grid>
          
        </Grid>
      </Container>
    </div>
  );
};

export default Campaign;
