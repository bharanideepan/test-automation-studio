import React, { useState, MouseEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TreeView as MuiTreeView, TreeItem } from "@mui/x-tree-view";
import { makeStyles } from "@mui/styles";
import { Box, Typography, IconButton } from "@mui/material";

import { RootState } from "../../store/rootReducer";
import ExpandIcon from "../../assets/images/right-arrow.svg";
import CollapseIcon from "../../assets/images/down-arrow.svg";
import ProjectIcon from "../../assets/images/project-icon.svg";
import RecordingIcon from "../../assets/images/recordings-icon.svg";
import FlowIcon from "../../assets/images/flow-icon.svg";
import MoreIcon from "../../assets/images/more-icon.svg";
import AppDeleteMenu from "../AppDeleteMenu";
import { getAllProjects } from "../../slices/projects";
// import { getDynamicApiList, getDownloadOptions } from "../../slices/global";
import useSnackbar from "../../hooks/useSnackbar";

const useTreeItemStyles = makeStyles((theme) => ({
  label: {
    padding: `${theme.spacing(0.5)} 0px`,
  },
  iconContainer: {
    marginRight: "0 !important",
  },
  content: {
    color: theme.palette.primary.main,
  },
  selected: {
    color: theme.palette.primaryHighlight.main,
    backgroundColor: `${theme.palette.background.primaryLight} !important`,
  },
}));

const useStyles = makeStyles((theme) => ({
  item: {
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing(0.5),
    "& .more": {
      visibility: "hidden",
      padding: theme.spacing(0.5),
      marginLeft: "auto",
    },
    "&:hover": {
      "& .more": {
        visibility: "visible",
      },
    },
    "& .name": {
      width: 140,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
    },
  },
}));

const Item: React.FC<{
  icon?: string;
  name: string;
  id: string;
  type: "PROJECT" | "PROJECTS" | "RECORDING" | "RECORDINGS" | "FLOW" | "FLOWS";
}> = ({ icon, name, id, type }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleDelete = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    console.log(id);
  };
  return (
    <Box className={classes.item}>
      {icon && <img src={icon} alt="icon" width="20" height="20" />}
      <Typography className="name" variant="subtitle1">
        {name}
      </Typography>
      <IconButton className="more" onClick={handleClick} aria-label="More">
        <img src={MoreIcon} alt="icon" width="16" height="16" />
      </IconButton>
      <AppDeleteMenu
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        handleDelete={handleDelete}
        type={type}
      />
    </Box>
  );
};

const TreeView = () => {
  const classes = useTreeItemStyles();
  const navigate = useNavigate();
  const { notify, hideNotification } = useSnackbar();
  const { list, status } = useSelector((state: RootState) => state.projects);
  const dispatch = useDispatch();
  const navigateTo = (to: string, id: string, tab: string) => {
    navigate({
      pathname: `/${to}/${id}`,
      search: `?tab=${tab}`,
    });
  };

  useEffect(() => {
    dispatch(getAllProjects());
  }, []);

  useEffect(() => {
    if (status) {
      notify({
        message: status.message,
        onClose: hideNotification,
        type: status.type,
      });
    }
  }, [status]);

  return (
    <MuiTreeView
      aria-label="multi-select"
      defaultCollapseIcon={
        <img src={CollapseIcon} alt="icon" height="10" width="10" />
      }
      defaultExpandIcon={
        <img src={ExpandIcon} alt="icon" height="10" width="10" />
      }
      multiSelect
    >
      {list && list.map((project) => (
        <TreeItem
          classes={classes}
          nodeId={`${project.id}`}
          label={
            <Item
              name={project.name}
              id={project.id}
              icon={ProjectIcon}
              type="PROJECT"
            />
          }
          key={project.id}
          onClick={() => {
            navigateTo("project", project.id, "1");
          }}
        >
          
        </TreeItem>
      ))}
    </MuiTreeView>
  );
};

export default TreeView;
