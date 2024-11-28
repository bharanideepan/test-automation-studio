import React, { SyntheticEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import DividerIcon from "../../assets/images/divider-vertical.svg";
import EditableTextField from "../../components/EditableTextField";
import AppTabs, { AppTab } from "../../components/AppTabs";

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
}));

const Header: React.FC<{
  projectName: string;
  projectId: string;
  onProjectNameUpdate: (updatedName: string) => void;
  activeTab: string;
  count: number;
  handleTabChange: (event: SyntheticEvent<Element, Event>, tab: string) => void;
}> = ({
  projectName,
  projectId,
  onProjectNameUpdate,
  activeTab,
  count,
  handleTabChange,
}) => {
    const classes = useStyles();
    return (
      <Box className={classes.root}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2.5}
        >
          <Box>
            <EditableTextField
              value={projectName}
              onSubmit={onProjectNameUpdate}
              className={classes.heading}
            />
          </Box>
          <Box>
            {/* {activeTab === "TEST_CASES" && (
            <AddTestCase projectId={projectId} onModalClose={() => {console.log("Test case add/edit modal closed")}} />
          )} */}
          </Box>
          {/* search component comes here */}
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <AppTabs value={activeTab} onChange={handleTabChange}>
              <AppTab value="XPATH" label="XPATH" />
              <AppTab disabled className="divider" icon={DividerIcon} />
              <AppTab value="ACTIONS" label="ACTIONS" />
              <AppTab disabled className="divider" icon={DividerIcon} />
              <AppTab value="FLOWS" label="FLOWS" />
              <AppTab disabled className="divider" icon={DividerIcon} />
              <AppTab value="TEST_CASES" label="TEST CASES" />
              <AppTab disabled className="divider" icon={DividerIcon} />
              <AppTab value="TEST_SUITE" label="TEST SUITE" />
            </AppTabs>
          </Box>
          {/* <Typography
          variant="body1"
          color="primary"
          sx={{ textTransform: "capitalize" }}
        >
          {count} {activeTab.toLowerCase()} found
        </Typography> */}
        </Box>
      </Box>
    );
  };

Header.propTypes = {
  projectName: PropTypes.string.isRequired,
  onProjectNameUpdate: PropTypes.func.isRequired,
  activeTab: PropTypes.oneOf(["TEST_CASES", "FLOWS", "ACTIONS", "XPATH", "TAGS", "TEST_SUITE"]).isRequired,
  count: PropTypes.number.isRequired,
};

Header.defaultProps = {
  activeTab: "TEST_CASES",
};

export default Header;
