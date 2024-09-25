import React, { useState } from "react";
import { Button, TextField, Container, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh'
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: theme.shape.borderRadius,
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
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
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <Typography variant="h5" component="h1" gutterBottom>
            Upload de Arquivo CSV
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              type="file"
              inputProps={{ accept: ".csv" }} // Permite apenas arquivos CSV
              onChange={handleFileChange}
              fullWidth
              className={classes.input}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Enviar
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Campaign;
