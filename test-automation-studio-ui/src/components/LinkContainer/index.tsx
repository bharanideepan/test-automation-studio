import React from "react";
import PropTypes from "prop-types";
import { Typography, Box, IconButton } from "@mui/material";
import LinkIcon from "../../assets/images/link-icon.png";
import CopyIcon from "../../assets/images/copy-icon.png";
import NewTabIcon from "../../assets/images/new-tab-icon.png";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  linkContainer: {
    padding: `${theme.spacing(1)} ${theme.spacing(1.25)}`,
    backgroundColor: "rgba(231, 238, 244, 0.35)",
    border: `0.5px solid ${theme.palette.primary50.main}`,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
  },
  iconButtonRoot: {
    border: `0.3px solid ${theme.palette.primary.main} !important`,
    padding: `${theme.spacing(0.625)} !important`,
  },
}));

const LinkContainer: React.FC<{
  link: string;
}> = ({ link }) => {
  const classes = useStyles();
  return (
    <Box className={classes.linkContainer}>
      <img src={LinkIcon} alt="link" width="12" height="12" />
      <Typography
        sx={{ marginLeft: 0.5 }}
        variant="body1"
        color="primaryHighlight.main"
      >
        {link}
      </Typography>
      <Box ml="auto" display="flex" alignItems="center" gap="8px">
        <IconButton
          classes={{
            root: classes.iconButtonRoot,
          }}
          onClick={() => {
            navigator.clipboard.writeText(link);
          }}
          aria-label="Copy link"
        >
          <img src={CopyIcon} alt="link" width="18" height="18" />
        </IconButton>
        <IconButton
          classes={{
            root: classes.iconButtonRoot,
          }}
          onClick={() => {
            window.open(link, "_blank");
          }}
          aria-label="Open link in new tab"
        >
          <img src={NewTabIcon} alt="link" width="18" height="18" />
        </IconButton>
      </Box>
    </Box>
  );
};

LinkContainer.propTypes = {
  link: PropTypes.string.isRequired,
};

export default LinkContainer;
