import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";

import EditableTextField from "../../components/EditableTextField";
import { RootState } from "../../store/rootReducer";
import { updateTestSuite } from "../../slices/testSuites";

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
  const { testSuite } = useSelector((state: RootState) => state.testSuite);
  // const { project } = useSelector((state: RootState) => state.project);
  const dispatch = useDispatch();
  const onTestSuiteNameUpdate = (name: string) => {
    dispatch(updateTestSuite({
      testSuite: {
        ...testSuite, name
      }, sequences: {}, assertions: []
    }));
  }
  return (
    <Box className={classes.root}>
      {testSuite &&
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2.5}
        >
          <Box>
            <TestSuiteBreadcrumb
              projectId={testSuite.projectId}
              projectName={testSuite.project?.name}
              testSuiteName={testSuite.name}
              onTestSuiteNameUpdate={onTestSuiteNameUpdate}
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

const TestSuiteBreadcrumb: React.FC<{
  projectId: string | number;
  projectName?: string;
  testSuiteName: string;
  onTestSuiteNameUpdate: (value: string) => void;
}> = ({ projectId, projectName, testSuiteName, onTestSuiteNameUpdate }) => {
  const classes = useStyles();
  return (
    <Breadcrumbs classes={{ separator: classes.separator }}>
      {projectName && <Link
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
      </Link>}
      <EditableTextField
        value={testSuiteName}
        onSubmit={onTestSuiteNameUpdate}
        className={classes.heading}
      />
    </Breadcrumbs>
  );
};

export default Header;
