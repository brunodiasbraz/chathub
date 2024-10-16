import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import { i18n } from "../../translate/i18n";
import { FiUpload } from "react-icons/fi";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  modalBox: {
    padding: "2rem",
    backgroundColor: "#fff",
  },
  drag: {
    fontWeight: 600,
    color: "#191442",
    marginTop: "1em",
    marginBottom: "0.5em",
    cursor: "pointer",
    fontSize: "18px",
    "& .browse": {
      display: "inline-block",
      color: "#fe8d57",
    },
  },
  info: {
    color: "#6f6c78",
    fontSize: "12px",
  },
  uploadBox: {
    padding: "2em",
    border: "2px dashed #109CF1",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  uploadIcon: {
    fontSize: "2em",
    color: theme.palette.primary.main,
  },
  fileLabel: {
    cursor: "pointer",
    color: theme.palette.primary.main,
  },
  fileIcon: {
    display: "none",
  },
  filename: {
    fontWeight: 500,
    color: "#38a169",
    backgroundColor: "#c6f6d5",
    fontSize: "12px",
    padding: "0.5rem 1.5rem",
    borderRadius: "20px",
    display: "inline-block",
  },
}));

export default function NewCampaignModal({ open, onClose }) {
  const classes = useStyles();
  const [file, setFile] = useState({ selectedFile: null });
  const [dragActive, setDragActive] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClose = () => {
    onClose();
  };

  const checkFileType = (e, eventType) => {
    let extension;

    if (eventType === "drop") {
      extension = e.dataTransfer.files[0].name.match(/\.([^.]+)$/)[1];
    } else {
      extension = e.target.value.match(/\.([^.]+)$/)[1];
    }

    switch (extension) {
      case "csv":
      case "xlsx":
      case "pdf":
        eventType !== "drop"
          ? setFile({ selectedFile: e.target.files[0] })
          : setFile({ selectedFile: e.dataTransfer.files[0] });
        setMsg("");
        break;
      default:
        setFile({ selectedFile: null });
        setMsg(`.${extension} format is not supported.`);
    }
  };

  const checkSize = (e, eventType) => {
    let size;
    if (eventType === "drop") {
      size = e.dataTransfer.files[0].size / 8;
    } else {
      size = e.target.files[0].size / 8;
    }

    if (size <= 51200) {
      checkFileType(e, eventType);
    } else {
      setMsg("Size should be less than 50KB");
    }
  };

  const chooseFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      checkSize(e);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      checkSize(e, "drop");
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (file.selectedFile) {
      const formData = new FormData();
      formData.append("arquivo", file.selectedFile);

      try {
        await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer ff461a99-add3-459f-a0ff-c731a24cfe27",
          },
        });
        toast.success("Arquivo CSV Carregado com sucesso!");
        resetForm(); // Reseta o formulário
        setFile({ selectedFile: null }); // Reseta o arquivo selecionado
        onClose();
      } catch (err) {
        toastError("Error uploading file:", err);
        console.error("Error uploading file:", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Incluir nova campanha</DialogTitle>
        <Formik
          initialValues={
            {
              /* valores iniciais do formulário */
            }
          }
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <form
                  className={classes.uploadBox}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onSubmit={(e) => e.preventDefault()}
                >
                  {file.selectedFile !== null ? (
                    <p className={classes.filename}>{file.selectedFile.name}</p>
                  ) : msg !== "" ? (
                    msg
                  ) : (
                    <FiUpload className={classes.uploadIcon} />
                  )}

                  <div>
                    <div className={classes.drag}>
                      Arraste e solte seu arquivo aqui ou{" "}
                      <div className={classes.browse}>
                        <label
                          htmlFor="img"
                          className={classes.fileLabel}
                          onClick={() =>
                            document.getElementById("getFile").click()
                          }
                        >
                          Escolher arquivo
                          <input
                            type="file"
                            name="arquivo"
                            data-max-size="2048"
                            id="getFile"
                            className={classes.fileIcon}
                            onChange={chooseFile}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <p className={classes.info}>
                    Somente arquivo no formato .CSV é suportado
                  </p>
                </form>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  {i18n.t("newCampaignModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                >
                  {i18n.t("newCampaignModal.buttons.done")}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}

NewCampaignModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};