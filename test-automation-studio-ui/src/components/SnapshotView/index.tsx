import React, { useState, useEffect, SyntheticEvent } from "react";
import PropTypes from "prop-types";
import { Box, Grid, Checkbox, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

import SnapshotCard from "../../components/cards/SnapshotCard";
import Unchecked from "../../assets/images/checkbox-unchecked.svg";
import Checked from "../../assets/images/checkbox-checked.png";
import DividerIcon from "../../assets/images/divider-vertical.svg";
// import { actions } from "../../slices/flow";
import PreviewContainer from "./PreviewContainer";
import AppModal from "../AppModal";
import AppLinearProgress from "../AppLinearProgress";
import { RootState } from "../../store/rootReducer";
import { Snapshot } from "../../declarations/interface";
import AppTabs, { AppTab } from "../AppTabs";
import ReplaceFormContainer from "./ReplaceFormContainer";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
  },
  item: {
    height: "100%",
    "&:first-child": {
      overflow: "auto",
    },
    "&:last-child": {
      borderLeft: `0.5px solid ${theme.palette.primary40.main}`,
      background: theme.palette.background.previewBg,
    },
  },
  preview: {
    padding: `${theme.spacing(4.5)} ${theme.spacing(3)}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  subtext: {
    color: theme.palette.primary75.main,
    paddingTop: theme.spacing(0.5),
  },
  checkbox: {
    width: 16,
    height: 16,
  },
}));

type AdditionalTab = "PREVIEW" | "MODIFICATIONS";

const SnapshotView: React.FC<{
  createMode: number;
  viewType: string;
  recordingType: number;
  editWindowVisible: number;
  fetchNext: () => void;
  hasMore: boolean;
  showAll: boolean;
}> = ({
  createMode,
  viewType,
  recordingType,
  editWindowVisible,
  fetchNext,
  hasMore,
  showAll,
}) => {
  const classes = useStyles();
  const [activeSnapshotIndex, setActiveSnapshotIndex] = useState(0);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  // const { dom_lists: snapshots } = useSelector(
  //   (state: RootState) => state.flow
  // );
  const [filteredSnapshots, setFilteredSnapshots] = useState<Snapshot[]>([]);
  const [activeSnapshot, setActiveSnapshot] = useState<Snapshot | undefined>();
  const [additionalTab, setAdditionalTab] = useState<AdditionalTab>("PREVIEW");
  const dispatch = useDispatch();
  const handlePrev = () => {
    setActiveSnapshotIndex((prev) => prev - 1);
  };
  const handleNext = () => {
    setActiveSnapshotIndex((prev) => prev + 1);
  };
  const handleSnapshotClick = (index: number) => {
    setActiveSnapshotIndex(index);
  };
  const handleCheckSnapshot = (dom_uuid: string) => {
    // dispatch(actions.checkSnapshot(dom_uuid));
  };
  const handleSnapshotUpdate = (id: string, field: string, value: string) => {
    // dispatch(
    //   actions.updateSnapshot({
    //     id,
    //     field,
    //     value,
    //   })
    // );
  };
  const handleMapEvent = (eventId: string) => {
    if (activeSnapshot) {
      handleSnapshotUpdate(
        activeSnapshot.dom_uuid || activeSnapshot.snapshot_id,
        "event_id",
        eventId
      );
    }
  };

  const handlePreviewModalOpen = () => {
    setPreviewModalOpen(true);
  };
  const handlePreviewModalClose = () => {
    setPreviewModalOpen(false);
  };

  useEffect(() => {
    setActiveSnapshotIndex(0);
  }, [createMode]);

  // useEffect(() => {
  //   setFilteredSnapshots(
  //     snapshots.filter((snapshot) => showAll || snapshot.checked)
  //   );
  // }, [setFilteredSnapshots, snapshots, showAll]);

  useEffect(() => {
    setActiveSnapshot(filteredSnapshots[activeSnapshotIndex]);
  }, [setActiveSnapshot, activeSnapshotIndex, filteredSnapshots]);

  return (
    <>
      <Grid
        container
        classes={{ container: classes.container }}
        sx={{
          height: editWindowVisible !== 0 ? "calc(100% - 66px)" : "100%",
        }}
      >
        <Grid
          id="scroll-div"
          item
          xs={6}
          classes={{ item: classes.item }}
          px={4.5}
          py={2}
        >
          <InfiniteScroll
            dataLength={filteredSnapshots.length}
            next={fetchNext}
            hasMore={hasMore}
            scrollableTarget="scroll-div"
            loader={
              <>
                <Typography
                  variant="h5"
                  style={{ textAlign: "center", marginTop: "12px" }}
                >
                  Loading more doms...
                </Typography>
                <AppLinearProgress />
              </>
            }
            endMessage={
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "12px" }}
              >
                Yay! You have seen it all
              </Typography>
            }
          >
            {filteredSnapshots.map((snapshot, index) => (
              <Box
                key={snapshot.dom_uuid || snapshot.snapshot_id}
                display="flex"
                gap={2}
              >
                {createMode === 1 && (
                  <Box mt={5.25}>
                    <Checkbox
                      classes={{ root: classes.checkbox }}
                      icon={
                        <img
                          src={Unchecked}
                          width="18"
                          height="18"
                          alt="icon"
                        />
                      }
                      checkedIcon={
                        <img src={Checked} width="18" height="18" alt="icon" />
                      }
                      onChange={() => {
                        handleCheckSnapshot(
                          snapshot.dom_uuid || snapshot.snapshot_id
                        );
                      }}
                      checked={snapshot.checked}
                      inputProps={{
                        "aria-label": "Select Snapshot Checkbox",
                      }}
                    />
                  </Box>
                )}
                <Box flexGrow={1}>
                  <SnapshotCard
                    id={snapshot.dom_uuid || snapshot.snapshot_id}
                    name={`${snapshot.dom_uuid || snapshot.snapshot_id}`}
                    viewType={viewType}
                    active={index === activeSnapshotIndex}
                    preview={
                      recordingType
                        ? `https://dpl-cdn.e5.ai/dev/desktop/${snapshot.snapshot_id}.png`
                        : snapshot.dom_thumbnail_path
                    }
                    display_delay_interval={snapshot.display_delay_interval}
                    wait_type={snapshot.wait_type}
                    event_id={snapshot.event_id}
                    hasNext={index < filteredSnapshots.length - 1}
                    domPath={snapshot.dom_path}
                    height={snapshot.height}
                    width={snapshot.width}
                    api_key={snapshot.api_key}
                    download_key={snapshot.download_key}
                    upload_enabled={snapshot.upload_enabled}
                    onClick={() => {
                      handleSnapshotClick(index);
                    }}
                    events={snapshot.events_lists}
                    handleSnapshotUpdate={handleSnapshotUpdate}
                    onPreviewClick={handlePreviewModalOpen}
                  />
                </Box>
              </Box>
            ))}
          </InfiniteScroll>
        </Grid>
        <Grid item xs={6} classes={{ item: classes.item }}>
          {viewType !== "RECORDING_VIEW" && (
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              pt={2}
            >
              <AppTabs
                value={additionalTab}
                onChange={(_: SyntheticEvent<Element, Event>, tab: string) => {
                  setAdditionalTab(tab as AdditionalTab);
                }}
              >
                <AppTab value="PREVIEW" label="PREVIEW" />
                <AppTab disabled className="divider" icon={DividerIcon} />
                <AppTab value="MODIFICATIONS" label="MODIFICATIONS" />
              </AppTabs>
            </Box>
          )}
          {activeSnapshot && (
            <>
              {additionalTab === "PREVIEW" && (
                <PreviewContainer
                  activeSnapshotIndex={activeSnapshotIndex}
                  activeSnapshot={activeSnapshot}
                  snapshots={filteredSnapshots}
                  preview={
                    recordingType
                      ? `https://dpl-cdn.e5.ai/dev/desktop/${activeSnapshot.snapshot_id}.png`
                      : activeSnapshot.dom_thumbnail_path
                  }
                  viewType={viewType}
                  handleMapEvent={handleMapEvent}
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                />
              )}
              {additionalTab === "MODIFICATIONS" && <ReplaceFormContainer />}
            </>
          )}
        </Grid>
      </Grid>
      <AppModal
        open={previewModalOpen}
        onClose={handlePreviewModalClose}
        maxWidth="lg"
      >
        {activeSnapshot && (
          <PreviewContainer
            activeSnapshotIndex={activeSnapshotIndex}
            activeSnapshot={activeSnapshot}
            snapshots={filteredSnapshots}
            preview={
              recordingType
                ? `https://dpl-cdn.e5.ai/dev/desktop/${activeSnapshot.snapshot_id}.png`
                : activeSnapshot.dom_thumbnail_path
            }
            viewType={viewType}
            handleMapEvent={handleMapEvent}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        )}
      </AppModal>
    </>
  );
};

SnapshotView.propTypes = {
  createMode: PropTypes.oneOf([0, 1, 2]).isRequired,
  editWindowVisible: PropTypes.oneOf([0, 1, 2]).isRequired,
  viewType: PropTypes.oneOf(["RECORDING_VIEW", "CREATE_FLOW_VIEW", "FLOW_VIEW"])
    .isRequired,
  fetchNext: PropTypes.func.isRequired,
};

export default SnapshotView;
