import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import WithSkeleton from "../WithSkeleton";
import MessageVariablesPicker from "../MessageVariablesPicker";
import ButtonWithSpinner from "../ButtonWithSpinner";
import FormikTextField from "../FormikTextField";
import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *:not(:last-child)": {
      marginRight: theme.spacing(1),
    },
  },
}));

const GreetingTemplateSchema = Yup.object().shape({
  template: Yup.string()
    .min(8, "Too Short!")
    .max(30000, "Too Long!")
    .required("Required"),
});

const GreetingTemplatesModal = ({
  open,
  onClose,
  onSave,
  greetingTemplateId,
  initialValues,
}) => {
  const classes = useStyles();
  const initialState = { template: "", status: false }; // Adicionando status inicial
  const isMounted = useRef(true);
  const messageInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [greetingTemplate, setGreetingTemplate] = useState(initialState);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

useEffect(() => {
  const initialState = { template: "", status: false };
  if (!greetingTemplateId) {
    setGreetingTemplate(initialState); // Limpa o estado ao adicionar novo template
  }

  (async () => {
    if (!greetingTemplateId) return;

    setLoading(true);
    try {
      const { data } = await api.get(
        `/greetingTemplates/${greetingTemplateId}`
      );
      if (!isMounted.current) return;

      setGreetingTemplate((prevState) => ({ ...prevState, ...data }));

      setLoading(false);
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  })();
}, [greetingTemplateId, open]);


  const handleSaveGreetingTemplate = async (values) => {
    try {
      const payload = { ...values, status: values.status ? 1 : 0 };
      let data;
      if (greetingTemplateId) {
        // Edição
        data = await api.put(
          `/greetingTemplates/${greetingTemplateId}`,
          payload
        );
      } else {
        // Criação
        const response = await api.post("/greetingTemplates", payload);
        data = response.data;
      }

      onSave(data); // Chama a função para atualizar a tabela no componente base
      onClose(); // Fecha o modal
      toast.success(i18n.t("campaign.greetingTemplatesModal.success"));
    } catch (err) {
      toastError(err);
    }
  };

  const handleClickMsgVar = async (msgVar, setValueFunc) => {
    const el = messageInputRef.current;
    const firstHalfText = el.value.substring(0, el.selectionStart);
    const secondHalfText = el.value.substring(el.selectionEnd);
    const newCursorPos = el.selectionStart + msgVar.length;

    setValueFunc("template", `${firstHalfText}${msgVar}${secondHalfText}`);

    await new Promise((r) => setTimeout(r, 100));
    messageInputRef.current.setSelectionRange(newCursorPos, newCursorPos);
  };

  return (
    <div className={classes.root}>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={onClose}
        scroll="paper"
      >
        <DialogTitle>
          {greetingTemplateId
            ? i18n.t("campaign.greetingTemplatesModal.title.edit")
            : i18n.t("campaign.greetingTemplatesModal.title.add")}
        </DialogTitle>
        <Formik
          initialValues={greetingTemplate}
          enableReinitialize={true}
          validationSchema={GreetingTemplateSchema}
          onSubmit={handleSaveGreetingTemplate}
        >
          {({ touched, errors, isSubmitting, setFieldValue, values }) => (
            <Form>
              <DialogContent dividers>
                <WithSkeleton fullWidth loading={loading}>
                  <FormikTextField
                    label={i18n.t(
                      "campaign.greetingTemplatesModal.form.message"
                    )}
                    multiline
                    inputRef={messageInputRef}
                    minRows={5}
                    fullWidth
                    name="template"
                    touched={touched}
                    errors={errors}
                    variant="outlined"
                    margin="dense"
                    disabled={isSubmitting}
                  />
                </WithSkeleton>
                <WithSkeleton loading={loading}>
                  <MessageVariablesPicker
                    disabled={isSubmitting}
                    onClick={(value) => handleClickMsgVar(value, setFieldValue)}
                  />
                </WithSkeleton>
                {/* Switch para Ativar/Inativar Saudação */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.status}
                      onChange={(e) =>
                        setFieldValue("status", e.target.checked)
                      }
                      color="primary"
                      name="status"
                      disabled={isSubmitting}
                    />
                  }
                  label={i18n.t("campaign.greetingTemplatesModal.form.status")}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose} disabled={isSubmitting}>
                  {i18n.t("campaign.greetingTemplatesModal.buttons.cancel")}
                </Button>
                <ButtonWithSpinner
                  type="submit"
                  color="primary"
                  disabled={loading || isSubmitting}
                  loading={isSubmitting}
                  variant="contained"
                >
                  {greetingTemplateId
                    ? i18n.t("campaign.greetingTemplatesModal.buttons.okEdit")
                    : i18n.t("campaign.greetingTemplatesModal.buttons.okAdd")}
                </ButtonWithSpinner>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default GreetingTemplatesModal;
