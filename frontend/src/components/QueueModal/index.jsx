import React, { useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	makeStyles,
	TextField,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import ColorPicker from "../ColorPicker";
import { Colorize } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	textField: {
		marginRight: theme.spacing(1),
		flex: 1,
	},
	container: {
		display: "flex",
		flexWrap: "wrap",
	},
	btnWrapper: {
		position: "relative",
	},
	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	colorAdorment: {
		width: 20,
		height: 20,
	},
}));

const QueueSchema = Yup.object().shape({
	name: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
	color: Yup.string().min(3, "Too Short!").max(9, "Too Long!").required(),
	greetingMessage: Yup.string(),
	startWork: Yup.string(),
	endWork: Yup.string(),
	absenceMessage: Yup.string(),
});

const QueueModal = ({ open, onClose, queueId }) => {
	const classes = useStyles();

	const initialState = {
		name: "",
		color: "",
		greetingMessage: "",
		startWork: "08:00",
		endWork: "18:00",
		absenceMessage: "",
	};

	const [colorPickerModalOpen, setColorPickerModalOpen] = useState(false);
	const [queue, setQueue] = useState(initialState);
	const greetingRef = useRef();
	const absenceRef = useRef();
	const startWorkRef = useRef();
	const endWorkRef = useRef();

	useEffect(() => {
		const fetchQueue = async () => {
			if (!queueId) return;
			try {
				const { data } = await api.get(`/queue/${queueId}`);
				setQueue((prevState) => ({ ...prevState, ...data }));
			} catch (err) {
				toastError(err);
			}
		};
		fetchQueue();

		return () => setQueue(initialState);
	}, [queueId, open]);

	const handleClose = () => {
		onClose();
		setQueue(initialState);
	};

	const handleSaveQueue = async (values) => {
		try {
			if (queueId) {
				await api.put(`/queue/${queueId}`, values);
			} else {
				await api.post("/queue", values);
			}
			toast.success(`${i18n.t("queueModal.notification.title")}`);
			handleClose();
		} catch (err) {
			toastError(err);
		}
	};

	return (
		<div className={classes.root}>
			<Dialog open={open} onClose={handleClose} scroll="paper">
				<DialogTitle>
					{queueId
						? `${i18n.t("queueModal.title.edit")}`
						: `${i18n.t("queueModal.title.add")}`}
				</DialogTitle>
				<Formik
					initialValues={queue}
					enableReinitialize
					validationSchema={QueueSchema}
					onSubmit={(values, actions) => {
						handleSaveQueue(values);
						actions.setSubmitting(false);
					}}
				>
					{({ touched, errors, isSubmitting, values, setFieldValue }) => (
						<Form>
							<DialogContent dividers>
								<Field
									as={TextField}
									label={i18n.t("queueModal.form.name")}
									autoFocus
									name="name"
									error={touched.name && Boolean(errors.name)}
									helperText={touched.name && errors.name}
									variant="outlined"
									margin="dense"
									className={classes.textField}
								/>
								<Field
									as={TextField}
									label={i18n.t("queueModal.form.color")}
									name="color"
									onFocus={() => {
										setColorPickerModalOpen(true);
										greetingRef.current.focus();
									}}
									error={touched.color && Boolean(errors.color)}
									helperText={touched.color && errors.color}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<div
													style={{ backgroundColor: values.color }}
													className={classes.colorAdorment}
												/>
											</InputAdornment>
										),
										endAdornment: (
											<IconButton
												size="small"
												color="default"
												onClick={() => setColorPickerModalOpen(true)}
											>
												<Colorize />
											</IconButton>
										),
									}}
									variant="outlined"
									margin="dense"
								/>
								<ColorPicker
									open={colorPickerModalOpen}
									handleClose={() => setColorPickerModalOpen(false)}
									onChange={(color) => {
										setFieldValue("color", color);
										setQueue((prevState) => ({
											...prevState,
											color,
										}));
									}}
								/>
								<Field
									as={TextField}
									label={i18n.t("queueModal.form.greetingMessage")}
									type="greetingMessage"
									multiline
									inputRef={greetingRef}
									rows={4}
									fullWidth
									name="greetingMessage"
									error={
										touched.greetingMessage && Boolean(errors.greetingMessage)
									}
									helperText={
										touched.greetingMessage && errors.greetingMessage
									}
									variant="outlined"
									margin="dense"
								/>
								<div className={classes.container} noValidate>
									<Field
										as={TextField}
										label={i18n.t("queueModal.form.startWork")}
										type="time"
										ampm={false}
										InputLabelProps={{ shrink: true }}
										inputProps={{ step: 600 }}
										fullWidth
										name="startWork"
										error={touched.startWork && Boolean(errors.startWork)}
										helperText={touched.startWork && errors.startWork}
										variant="outlined"
										margin="dense"
										inputRef={startWorkRef}
									/>
									<Field
										as={TextField}
										label={i18n.t("queueModal.form.endWork")}
										type="time"
										ampm={false}
										InputLabelProps={{ shrink: true }}
										inputProps={{ step: 600 }}
										fullWidth
										name="endWork"
										error={touched.endWork && Boolean(errors.endWork)}
										helperText={touched.endWork && errors.endWork}
										variant="outlined"
										margin="dense"
										inputRef={endWorkRef}
									/>
								</div>
								<Field
									as={TextField}
									label={i18n.t("queueModal.form.absenceMessage")}
									type="absenceMessage"
									multiline
									inputRef={absenceRef}
									rows={2}
									fullWidth
									name="absenceMessage"
									error={
										touched.absenceMessage && Boolean(errors.absenceMessage)
									}
									helperText={
										touched.absenceMessage && errors.absenceMessage
									}
									variant="outlined"
									margin="dense"
								/>
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("queueModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
								>
									{queueId
										? i18n.t("queueModal.buttons.okEdit")
										: i18n.t("queueModal.buttons.okAdd")}
									{isSubmitting && (
										<CircularProgress
											size={24}
											className={classes.buttonProgress}
										/>
									)}
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default QueueModal;
