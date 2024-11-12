import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  TableBody,
  Box,
  Tooltip,
  IconButton,
  Button,
  Grid
} from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import EditIcon from "../../assets/images/edit-icon.svg";
import { Action, Input } from "../../declarations/interface";
import { useDispatch } from "react-redux";
import { deleteAction } from "../../slices/project";
import clsx from "clsx";
import AddAction from "./AddAction";
import AddInput from "./AddInput";

export const DEFAULT_ACTION: Action = {
  id: "",
  projectId: "",
  name: ""
};

export const DEFAULT_INPUT: Input = {
  id: "",
  actionId: "",
  name: "",
  type: "",
  value: "",
  xpath: ""
};

export const ACTION_TYPES = [
  { label: "Launch Browser", value: "LAUNCH_BROWSER" },
  { label: "Click", value: "CLICK" },
  { label: "Select", value: "SELECT" },
  { label: "Type text", value: "TYPE_TEXT" },
  { label: "Checkbox", value: "CHECKBOX" },
  { label: "Radio", value: "Radio" },
  { label: "Validate element is visible", value: "IS_VISIBLE" },
];
const useStyles = makeStyles((theme) => ({
  body: {
    borderTop: `0.5px solid ${theme.palette.primary40.main}`,
  },
  container: {
    height: "100%",
  },
  item: {
    height: "100%",
    "&:first-child": {
      borderRight: `0.5px solid ${theme.palette.primary40.main}`,
    },
    "&:last-child": {
      borderLeft: `0.5px solid ${theme.palette.primary40.main}`,
      // background: theme.palette.background.previewBg,
    },
  },
  contentCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  fullWidth: {
    maxWidth: "100%",
  },
  listContainer: {
    height: "calc(100% - 40px)",
    overflow: "auto",
    boxShadow: "0px -4px 5px -4px rgba(0, 0, 0, 0.15)",
  },
  stickyContainer: {
    display: "flex",
    alignItems: "center",
    height: "24px",
  },
  active: {
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: "rgba(0, 0, 0, 0.1) !important",
  }
}));

const ActionContainer: React.FC<{
  list: Action[];
  projectId: string;
}> = ({ list, projectId }) => {
  const classes = useStyles();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedAction, setSelectedAction] = useState<Action | undefined>(undefined);
  const [deleteInputModalOpen, setDeleteInputModalOpen] = useState(false);
  const [selectedInputId, setSelectedInputId] = useState("");
  const [selectedInput, setSelectedInput] = useState<Input | undefined>(undefined);
  const dispatch = useDispatch();
  const handleDeleteAction = (id: string) => {
    handleDeleteModalOpen();
    setSelectedId(id);
  };

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    setDeleteModalOpen(false);
    dispatch(deleteAction(selectedId));
  };

  const handleDeleteInput = (id: string) => {
    handleDeleteInputModalOpen();
    setSelectedInputId(id);
  };

  const handleDeleteInputModalOpen = () => {
    setDeleteInputModalOpen(true);
  };

  const handleDeleteInputModalClose = () => {
    setDeleteInputModalOpen(false);
  };

  const confirmDeleteInput = () => {
    setDeleteInputModalOpen(false);
    // dispatch(deleteInput(selectedInputId));
  };

  return (
    <>
      {list.length === 0 && (
        <Box className={clsx(classes.contentCenter, classes.body)}>
          <Box mr={2}>
            <AddAction
              projectId={projectId}
              onModalClose={() => { console.log("Add action modal closed") }}
            />
          </Box>
          <Typography variant="h5" color="primary">
            Add new action
          </Typography>
        </Box>
      )}
      {list.length > 0 && (
        <Grid
          container
          classes={{ container: classes.container }}
          sx={{
            height: "100%",
          }}
        >
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <ActionsListView projectId={projectId} actions={list} handleDeleteAction={handleDeleteAction} selectedAction={list.find((action: Action) => action.id == selectedAction?.id)} setSelectedAction={setSelectedAction} />
          </Grid>
          <Grid item xs={6} classes={{ item: classes.item }} py={2}>
            <InputListView actionId={selectedAction?.id} inputs={list.find((action: Action) => action.id == selectedAction?.id)?.inputs} handleDeleteInput={handleDeleteInput} selectedInput={selectedInput} setSelectedInput={setSelectedInput} />
          </Grid>
        </Grid>
      )}
      <DeleteActionModal deleteModalOpen={deleteModalOpen} handleDeleteModalClose={handleDeleteModalClose} confirmDelete={confirmDelete} />
      <DeleteInputModal deleteInputModalOpen={deleteInputModalOpen} handleDeleteInputModalClose={handleDeleteInputModalClose} confirmDeleteInput={confirmDeleteInput} />
    </>
  );
};

const DeleteActionModal: React.FC<{
  deleteModalOpen: boolean
  handleDeleteModalClose: () => void
  confirmDelete: () => void
}> = ({
  deleteModalOpen, handleDeleteModalClose, confirmDelete
}) => {
    return <AppModal
      open={deleteModalOpen}
      onClose={handleDeleteModalClose}
      header={
        <Typography
          variant="h5"
          color="primaryHighlight.main"
          sx={{ fontWeight: 600 }}
        >
          DELETE ACTION
        </Typography>
      }
    >
      <Box mb={0.5}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 400, textAlign: "center" }}
        >
          Are you sure that you want to delete the action?
        </Typography>
        <Box display="flex" flexDirection="column" gap="8px" mt={2.75}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              padding: 1.5,
            }}
            onClick={handleDeleteModalClose}
          >
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              Cancel
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              padding: 1.5,
            }}
            onClick={confirmDelete}
            aria-label="Confirm delete"
          >
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              Delete action
            </Typography>
          </Button>
        </Box>
      </Box>
    </AppModal>
  }

const DeleteInputModal: React.FC<{
  deleteInputModalOpen: boolean
  handleDeleteInputModalClose: () => void
  confirmDeleteInput: () => void
}> = ({
  deleteInputModalOpen, handleDeleteInputModalClose, confirmDeleteInput
}) => {
    return <AppModal
      open={deleteInputModalOpen}
      onClose={handleDeleteInputModalClose}
      header={
        <Typography
          variant="h5"
          color="primaryHighlight.main"
          sx={{ fontWeight: 600 }}
        >
          DELETE INPUT
        </Typography>
      }
    >
      <Box mb={0.5}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: 400, textAlign: "center" }}
        >
          Are you sure that you want to delete the input?
        </Typography>
        <Box display="flex" flexDirection="column" gap="8px" mt={2.75}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              padding: 1.5,
            }}
            onClick={handleDeleteInputModalClose}
          >
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              Cancel
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              padding: 1.5,
            }}
            onClick={confirmDeleteInput}
            aria-label="Confirm delete"
          >
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              Delete input
            </Typography>
          </Button>
        </Box>
      </Box>
    </AppModal>
  }

const ActionsListView: React.FC<{
  actions: Action[];
  handleDeleteAction: (id: string) => void;
  setSelectedAction: (action?: Action) => void
  selectedAction: Action | undefined;
  projectId: string;
}> = ({
  actions, handleDeleteAction, selectedAction, setSelectedAction, projectId
}) => {
    const classes = useStyles();
    const [editAction, setEditAction] = useState<Action | undefined>(undefined);
    return (
      <>
        <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <AddAction
                  action={editAction}
                  projectId={projectId}
                  onModalClose={() => { setEditAction(undefined) }}
                />
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Actions: {actions.length}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Click an action to view / edit input
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className={classes.listContainer}>
          <Box className={classes.body}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableBody>
                  {actions.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                        setSelectedAction(row);
                      }} className={selectedAction?.id == row.id ? classes.active : ''}>
                        <TableCell style={{ width: "90%" }} align="left">
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxWidth="300px"
                          >
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ width: "10%" }} align="left">
                          <Box
                            display={"flex"}
                            justifyContent={"start"}
                            alignItems={"center"}
                            gap={2}
                          >
                            {/* <Tooltip title={"Remove"}>
                              <IconButton
                                sx={{ padding: 0.5 }}
                                onClick={() => {
                                  handleDeleteAction(row.id);
                                }}
                                data-testid="remove-added-replacement"
                              >
                                <img
                                  src={DeleteIcon}
                                  alt="close"
                                  height="24"
                                  width="24"
                                />
                              </IconButton>
                            </Tooltip> */}
                            <Tooltip title={"Edit"}>
                              <IconButton
                                sx={{ padding: 0.5 }}
                                onClick={() => {
                                  setEditAction(row);
                                }}
                                data-testid="remove-added-replacement"
                              >
                                <img
                                  src={EditIcon}
                                  alt="close"
                                  height="24"
                                  width="24"
                                />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </>
    );
  };
const InputListView: React.FC<{
  inputs?: Input[];
  handleDeleteInput: (id: string) => void;
  setSelectedInput: (input: Input) => void
  selectedInput: Input | undefined;
  actionId?: string;
}> = ({
  inputs, handleDeleteInput, selectedInput, setSelectedInput, actionId
}) => {
    const classes = useStyles();
    const [editInput, setEditInput] = useState<Input | undefined>(undefined);
    return (
      <>
        <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
          <Box flexGrow={1}>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              {actionId && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                <AddInput
                  input={editInput}
                  actionId={actionId}
                  onModalClose={() => { setEditInput(undefined) }}
                />
                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                  Inputs: {inputs?.length ?? 0}
                </Typography>
              </Box>}
              {!actionId && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                Select an action to view its inputs
              </Typography>}
            </Box>
          </Box>
        </Box>
        <Box className={classes.listContainer}>
          <Box className={classes.body}>
            <TableContainer sx={{ maxHeight: "100%" }}>
              <Table stickyHeader aria-label="sticky table">
                <TableBody>
                  {inputs && inputs.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                        setSelectedInput(row);
                      }} className={selectedInput?.id == row.id ? '' : ''}>
                        <TableCell style={{ width: "20%" }} align="left">
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              maxWidth="300px"
                            >
                              <b>Name:</b> {row.name}
                            </Typography>
                        </TableCell>
                        <TableCell style={{ width: "20%" }} align="left">
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              maxWidth="300px"
                            >
                              <b>Xpath:</b> {row.xpath}
                            </Typography>
                        </TableCell>
                        <TableCell style={{ width: "20%" }} align="left">
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              maxWidth="300px"
                            >
                              <b>Value:</b> {row.value}
                            </Typography>
                        </TableCell>
                        <TableCell style={{ width: "20%" }} align="left">
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              maxWidth="300px"
                            >
                              <b>Type:</b> {ACTION_TYPES.find((x) => x.value == row.type)?.label}
                            </Typography>
                        </TableCell>
                        <TableCell style={{ width: "10%" }} align="left">
                          <Box
                            display={"flex"}
                            justifyContent={"start"}
                            alignItems={"center"}
                            gap={2}
                          >
                            {/* <Tooltip title={"Remove"}>
                                <IconButton
                                  sx={{ padding: 0.5 }}
                                  onClick={() => {
                                    handleDeleteInput(row.id);
                                  }}
                                  data-testid="remove-added-replacement"
                                >
                                  <img
                                    src={DeleteIcon}
                                    alt="close"
                                    height="24"
                                    width="24"
                                  />
                                </IconButton>
                              </Tooltip> */}
                            <Tooltip title={"Edit"}>
                              <IconButton
                                sx={{ padding: 0.5 }}
                                onClick={() => {
                                  setEditInput(row);
                                }}
                                data-testid="remove-added-replacement"
                              >
                                <img
                                  src={EditIcon}
                                  alt="close"
                                  height="24"
                                  width="24"
                                />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </>
    );
  };
export default ActionContainer;
