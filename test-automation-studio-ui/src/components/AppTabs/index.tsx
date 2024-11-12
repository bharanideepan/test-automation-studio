import React, { SyntheticEvent, ReactNode } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";

interface StyledTabsProps {
  children?: ReactNode;
  value: string;
  onChange: (event: SyntheticEvent, newValue: string) => void;
}

interface StyledTabProps {
  value?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  icon?: string;
}

const AppTabs = styled((props: StyledTabsProps) => <Tabs {...props} />)({
  minHeight: "unset !important",
  "& .MuiTabs-indicator": {
    display: "none",
  },
});

export default AppTabs;

export const AppTab = styled((props: StyledTabProps) => (
  <Tab
    {...props}
    icon={props.icon && <img src={props.icon} alt="divider" height="10" />}
    classes={{
      root: props.className,
    }}
  />
))(({ theme }) => ({
  color: `${theme.palette.primary75.main} !important`,
  padding: `${theme.spacing(0.5)} 0 !important`,
  fontSize: "12px !important",
  lineHeight: "16px !important",
  fontWeight: "700 !important",
  minHeight: "unset !important",
  minWidth: "unset !important",
  letterSpacing: "-0.02em !important",
  opacity: "1 !important",
  "&.divider": {
    marginRight: theme.spacing(0.75),
    marginLeft: theme.spacing(0.75),
  },
  "&.Mui-selected": {
    color: `${theme.palette.secondary.main} !important`,
    textDecoration: "underline !important",
  },
}));

AppTab.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  className: PropTypes.string,
};

AppTab.defaultProps = {
  value: "",
  label: "",
  disabled: false,
};
