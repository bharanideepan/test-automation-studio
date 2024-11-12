import React, { useRef, useEffect, ChangeEvent, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Card,
  Typography,
  Box,
  CardMedia,
  SelectChangeEvent,
  InputBase,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";

import AppSelect from "../../AppSelect";
import EditableTextField from "../../EditableTextField";
import ClockIcon from "../../../assets/images/clock-icon.svg";
import SamplePreview from "../../../assets/images/placeholder-img.png";
import { Event } from "../../../declarations/interface";
// import domService from "../../../services/domService";
import { RootState } from "../../../store/rootReducer";

const useStyles = makeStyles((theme) => ({
  card: {
    border: `0.3px solid ${theme.palette.primary75.main}`,
    borderRadius: `6px !important`,
    padding: theme.spacing(1.5),
    boxShadow: "none !important",
    cursor: "pointer",
    // width: 528, //
    display: "flex",
    gap: theme.spacing(2),
    "&.active": {
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: theme.palette.background.secondaryLight,
    },
  },
  img: {
    height: 76,
    width: `142px !important`,
    border: `0.3px solid ${theme.palette.primary.main}`,
    borderRadius: 3,
  },
  title: {
    fontWeight: 600,
  },
  events: {},
  select: {
    "&.MuiInputBase-root": {
      height: 28,
      fontSize: 12,
      lineHeight: "16px",
      border: `0.5px solid ${theme.palette.primary.main}`,
    },
    "& fieldset": {
      border: "none",
    },
  },
  vertLine: {
    height: 20,
    border: `1px dashed ${theme.palette.primary35.main}`,
    width: 0,
  },
  duration: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& .input": {},
  },
  input: {
    border: `2px dashed ${theme.palette.primary35.main}`,
    borderRadius: 3,
    fontWeight: "400 !important",
    fontSize: "12px !important",
    letterSpacing: "-2% !important",
    lineHeight: "16px !important",
    width: 90,
    padding: `${theme.spacing(0.75)} ${theme.spacing(2)} !important`,
    height: "28px !important",
    "& input": {
      padding: `2px !important`,
      boxSizing: "border-box !important",
    },
  },
  checkbox: {
    width: 16,
    height: 16,
  },
}));

const ACTIONS = [
  { label: "No action", value: "" },
  { label: "API", value: "API" },
  { label: "Download", value: "DOWNLOAD" },
  { label: "Upload", value: "UPLOAD" },
];

const SnapshotCard: React.FC<{
  id: string;
  name: string;
  events: Event[];
  active?: boolean;
  viewType: string;
  preview?: string;
  display_delay_interval?: string;
  wait_type?: string;
  event_id?: string;
  hasNext: boolean;
  onClick: () => void;
  handleSnapshotUpdate: (id: string, field: string, value: string) => void;
  onPreviewClick: () => void;
  domPath?: string;
  height: number;
  width: number;
  api_key?: string | null;
  download_key?: string | null;
  upload_enabled?: boolean | null;
}> = ({
  id,
  active,
  name,
  events,
  viewType,
  preview,
  display_delay_interval,
  wait_type,
  event_id,
  hasNext,
  onClick,
  handleSnapshotUpdate,
  onPreviewClick,
  domPath,
  height,
  width,
  api_key,
  download_key,
  upload_enabled,
}) => {
  const classes = useStyles();
  const ref = useRef<null | HTMLDivElement>(null);
  // const { dynamicApis, downloadOptions } = useSelector(
  //   (state: RootState) => state.global
  // );
  const [action, setAction] = useState("");

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    handleSnapshotUpdate(id, "wait_type", event.target.value);
  };

  const handleEventChange = (event: SelectChangeEvent<string>) => {
    handleSnapshotUpdate(id, "event_id", event.target.value);
  };

  const handleApiKeyChange = (event: SelectChangeEvent<string>) => {
    handleSnapshotUpdate(id, "api_key", event.target.value);
  };

  const handleDownloadKeyChange = (event: SelectChangeEvent<string>) => {
    handleSnapshotUpdate(id, "download_key", event.target.value);
  };

  const handleActionChange = (event: SelectChangeEvent<string>) => {
    const action = event.target.value;
    setAction(action);
    if (action === "UPLOAD") {
      handleSnapshotUpdate(id, "upload_enabled", "true");
    } else if (action === "") {
      handleSnapshotUpdate(id, "REMOVE_ACTIONS", "");
    }
  };

  const handleDurationChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleSnapshotUpdate(id, "delay_interval", event.target.value);
  };

  const handleClick = () => {
    onClick();
  };

  const handlePreviewClick = () => {
    onPreviewClick();
  };

  useEffect(() => {
    if (active) {
      ref?.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [active]);

  useEffect(() => {
    if (preview) return;
    const param = {
      dom_uuid: id,
      dom_path: domPath,
      viewport: {
        height: height,
        width: width,
      },
    };
    // try {
    //   domService.getScreenshot(param);
    // } catch (error) {
    //   console.log(error);
    // }
  }, []);

  useEffect(() => {
    let action = "";
    if (api_key) {
      action = "API";
    } else if (download_key) {
      action = "DOWNLOAD";
    } else if (upload_enabled) {
      action = "UPLOAD";
    }
    setAction(action);
  }, [api_key, download_key, upload_enabled, setAction]);

  return (
    <Box ref={ref}>
      <Card
        classes={{
          root: clsx(classes.card, active ? "active" : ""),
        }}
        onClick={handleClick}
        data-testid="snapshot-card-test-id"
      >
        <CardMedia
          component="img"
          image={preview || SamplePreview}
          alt="snapshot"
          classes={{
            root: classes.img,
          }}
          onClick={handlePreviewClick}
        />
        <Box>
          <Box mb={0.5}>
            <EditableTextField
              value={name}
              onSubmit={(value: string) => {
                console.log(value, " == edited value");
              }}
            />
          </Box>
          <Typography
            className={classes.events}
            variant="body2"
            color="primary"
          >
            {events.length} Events found
          </Typography>
          {viewType !== "RECORDING_VIEW" && (
            <Box>
              <Box mt={2} display="flex" gap={0.75}>
                <AppSelect
                  value={wait_type || ""}
                  onChange={handleTypeChange}
                  options={TYPES}
                  disabled={viewType === "FLOW_VIEW"}
                  id={`wait-type-dropdown-${id}`}
                />

                {wait_type === "EVENT" && (
                  <AppSelect
                    value={event_id || ""}
                    onChange={handleEventChange}
                    options={events.map((event: Event) => ({
                      label:
                        event.eventName ??
                        `${event.eventId}: ${event.eventType}`,
                      value: event.eventId,
                    }))}
                    disabled={viewType === "FLOW_VIEW"}
                    id={`event-dropdown-${id}`}
                  />
                )}
              </Box>
              {wait_type === "EVENT" && (
                <Box display="flex" alignItems="center" gap={0.75}>
                  <AppSelect
                    value={action}
                    onChange={handleActionChange}
                    options={ACTIONS}
                    disabled={viewType === "FLOW_VIEW"}
                    id={`action-dropdown-${id}`}
                    label="Select Action"
                  />
                  {/* {action === "API" && (
                    <AppSelect
                      value={api_key || ""}
                      onChange={handleApiKeyChange}
                      options={dynamicApis}
                      disabled={viewType === "FLOW_VIEW"}
                      id={`api-key-dropdown-${id}`}
                      label="Select API"
                    />
                  )}
                  {action === "DOWNLOAD" && (
                    <AppSelect
                      value={download_key || ""}
                      onChange={handleDownloadKeyChange}
                      options={downloadOptions}
                      disabled={viewType === "FLOW_VIEW"}
                      id={`download-key-dropdown-${id}`}
                      label="Select File"
                    />
                  )} */}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Card>
      {hasNext && (
        <Box width="fit-content" ml={5}>
          <Box className={classes.duration}>
            <Box className={classes.vertLine} />
            <InputBase
              value={display_delay_interval}
              onChange={handleDurationChange}
              classes={{
                root: classes.input,
              }}
              startAdornment={<img src={ClockIcon} alt="clock" />}
              endAdornment={
                <Typography variant="body1" color="primary">
                  s
                </Typography>
              }
              disabled={viewType !== "CREATE_FLOW_VIEW"}
              inputProps={{
                "data-testid": "duration-input-test-id",
              }}
            />
            <Box className={classes.vertLine} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

SnapshotCard.propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool,
  name: PropTypes.string.isRequired,
  events: PropTypes.any.isRequired,
  viewType: PropTypes.oneOf(["RECORDING_VIEW", "CREATE_FLOW_VIEW", "FLOW_VIEW"])
    .isRequired,
  preview: PropTypes.string,
  display_delay_interval: PropTypes.string,
  wait_type: PropTypes.string,
  event_id: PropTypes.string,
  hasNext: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  handleSnapshotUpdate: PropTypes.func.isRequired,
  domPath: PropTypes.string,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  api_key: PropTypes.string,
  download_key: PropTypes.string,
  upload_enabled: PropTypes.bool,
};

SnapshotCard.defaultProps = {
  active: false,
};

export default SnapshotCard;

const TYPES = [
  { value: "TIME", label: "Interval" },
  { value: "EVENT", label: "Event" },
  { value: "REFRESH", label: "Refresh" },
];
