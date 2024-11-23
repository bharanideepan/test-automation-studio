import React from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  SelectChangeEvent,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import AddIcon from "../../assets/images/add-icon-white.svg";
import EditableTextField from "../../components/EditableTextField";
import { RootState } from "../../store/rootReducer";
import { updateTestCase } from "../../slices/project";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(3)} ${theme.spacing(4.5)} ${theme.spacing(1.5)}`,
    borderBottom: `0.5px solid ${theme.palette.primary40.main}`,
  },
  heading: {
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: "-4%",
    lineHeight: "24px",
  },
  separator: {
    marginLeft: `${theme.spacing(0.5)} !important`,
    marginRight: `${theme.spacing(0.5)} !important`,
  },
}));

const CustomButton: React.FC<{
  routeTo?: string;
  handleClick?: () => void;
  title: string;
  variant: "outlined" | "contained";
  color: "primary" | "secondary";
  disabled: boolean;
}> = ({ routeTo, handleClick, title, variant, color, disabled }) => {
  return (
    <Button
      variant={variant}
      color={color}
      sx={{
        padding: "10px 21px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        textTransform: "unset !important",
        marginRight: "8px",
        marginLeft: "8px",
      }}
      {...(routeTo ? { to: routeTo, component: RouterLink } : {})}
      {...(handleClick ? { onClick: handleClick } : {})}
      aria-label={title}
      disabled={disabled}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          lineHeight: "16px",
        }}
      >
        {title}
      </Typography>
    </Button>
  );
};

const Header: React.FC = () => {
  const classes = useStyles();
  const { testCase } = useSelector((state: RootState) => state.testCase);
  const { project } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  const onTestCaseNameUpdate = (name: string) => {
    dispatch(updateTestCase({
      testCase: {
        ...testCase, name
      }, sequences: {}, assertions: []
    }));
  }
  return (
    <Box className={classes.root}>
      {testCase && project &&
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2.5}
        >
          <Box>
            <TestCaseBreadcrumb
              projectId={testCase.projectId}
              projectName={project.name}
              testCaseName={testCase.name}
              onTestCaseNameUpdate={onTestCaseNameUpdate}
            />
          </Box>
          {/* <Box>
          <CustomButton
            variant="outlined"
            color="primary"
            routeTo={`/project/${projectId}`}
            title="Cancel"
            disabled={false}
          />
          <CustomButton
            variant="contained"
            color="secondary"
            title="Save"
            handleClick={handleSave}
            disabled={!saveEnabled}
          />
        </Box> */}
        </Box>}
    </Box>
  );
};

const TestCaseBreadcrumb: React.FC<{
  projectId: string | number;
  projectName: string;
  testCaseName: string;
  onTestCaseNameUpdate: (value: string) => void;
}> = ({ projectId, projectName, testCaseName, onTestCaseNameUpdate }) => {
  const classes = useStyles();
  return (
    <Breadcrumbs classes={{ separator: classes.separator }}>
      <Link
        color="inherit"
        to={`/project/${projectId}`}
        component={RouterLink}
        underline="none"
      >
        <Typography
          variant="body1"
          color="primary"
          sx={{ textTransform: "capitalize" }}
        >
          {projectName}
        </Typography>
      </Link>
      <EditableTextField
        value={testCaseName}
        onSubmit={onTestCaseNameUpdate}
        className={classes.heading}
      />
    </Breadcrumbs>
  );
};

export default Header;
