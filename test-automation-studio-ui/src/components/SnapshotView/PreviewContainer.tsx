import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import moment from "moment";
import Preview from "./Preview";
import { Snapshot } from "../../declarations/interface";
import constants from "../../util/constants";
import LeftArrowDisabled from "../../assets/images/navigation-left-disabled.svg";
import RightArrowDisabled from "../../assets/images/navigation-right-disabled.svg";
import LeftArrow from "../../assets/images/navigation-left.svg";
import RightArrow from "../../assets/images/navigation-right.svg";

const useStyles = makeStyles((theme) => ({
  preview: {
    padding: `${theme.spacing(3)} ${theme.spacing(3)}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    // height: "100%",
  },
  subtext: {
    color: theme.palette.primary75.main,
    paddingTop: theme.spacing(0.5),
  },
}));

const PreviewContainer: React.FC<{
  snapshots: Snapshot[];
  activeSnapshotIndex: number;
  activeSnapshot: Snapshot;
  viewType: string;
  preview?: string;
  handleMapEvent: (eventId: string) => void;
  handlePrev: () => void;
  handleNext: () => void;
}> = ({
  snapshots,
  activeSnapshotIndex,
  activeSnapshot,
  viewType,
  handleMapEvent,
  handlePrev,
  handleNext,
  preview,
}) => {
  const classes = useStyles();
  const hasNext = () => activeSnapshotIndex < snapshots.length - 1;
  const hasPrev = () => activeSnapshotIndex > 0;
  return (
    <Box className={classes.preview}>
      <Box textAlign="center">
        <Preview
          viewType={viewType}
          image={preview}
          selectedId={activeSnapshot.event_id}
          wait_type={activeSnapshot.wait_type ?? "TIME"}
          hotSpotData={{
            height: snapshots[0]?.height ?? 0,
            width: snapshots[0]?.width ?? 0,
            events: activeSnapshot.events_lists,
          }}
          onMapEvent={handleMapEvent}
        />
        <Typography variant="subtitle1">
          {activeSnapshot.dom_uuid || activeSnapshot.snapshot_id}
        </Typography>
        <Typography variant="subtitle2" className={classes.subtext}>
          Captured at{" "}
          {moment(activeSnapshot.createdAt).format(constants.dateDisplayFormat)}
        </Typography>
      </Box>
      <Box mb={-0.5}>
        <IconButton
          sx={{ padding: 0.5 }}
          disabled={!hasPrev()}
          onClick={handlePrev}
          aria-label="Load Prev Snapshot"
        >
          <img
            src={hasPrev() ? LeftArrow : LeftArrowDisabled}
            alt="left"
            width="24"
            height="24"
          />
        </IconButton>
        <IconButton
          sx={{ padding: 0.5 }}
          disabled={!hasNext()}
          onClick={handleNext}
          aria-label="Load Next Snapshot"
        >
          <img
            src={hasNext() ? RightArrow : RightArrowDisabled}
            alt="right"
            width="24"
            height="24"
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PreviewContainer;
