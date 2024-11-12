import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Menu, MenuItem } from "@mui/material";
import { makeStyles } from "@mui/styles";

import SamplePreview2 from "../../assets/images/placeholder-img.png";
import { Event } from "../../declarations/interface";

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    marginBottom: theme.spacing(2),
    border: `0.3px solid ${theme.palette.primary.main}`,
    borderRadius: 6,
    display: "flex",
    position: "relative",
    "& img": {
      borderRadius: 6,
      width: "100%",
      height: "auto",
    },
    "& .hot-spot": {
      position: "absolute",
      boxSizing: "content-box",
      cursor: "context-menu",
    },
  },
}));

const Preview: React.FC<{
  image?: string;
  viewType: string;
  wait_type: string;
  hotSpotData: HotSpotData;
  selectedId?: string;
  onMapEvent: (eventId: string) => void;
}> = ({ image, viewType, wait_type, onMapEvent, hotSpotData, selectedId }) => {
  const classes = useStyles();
  const ref = useRef<HTMLDivElement | null>(null);
  const [imageDimension, setImageDimension] = useState<Dimension>({
    height: 0,
    width: 0,
  });
  const [data, setData] = useState<Data | undefined>();
  const [hotspotSelectable, setHotspotSelectable] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    events: {
      eventName: string;
      eventId: string;
    }[];
  } | null>(null);

  const handleImageLoad = () => {
    const height = ref.current?.clientHeight || 0;
    const width = ref.current?.clientWidth || 0;
    setImageDimension({ height, width });
  };

  const handleContextMenu = (
    event: React.MouseEvent,
    events: {
      eventName: string;
      eventId: string;
    }[]
  ) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            events,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleMap = (id: string) => {
    handleClose();
    onMapEvent(id);
  };

  const getSpec = (spec: Spec, domDimension: Dimension): Spec => {
    const { height: domHeight, width: domWidth } = domDimension;
    const { height: imgHeight, width: imgWidth } = imageDimension;
    const widthRatio = imgWidth / domWidth;
    const heightRatio = imgHeight / domHeight;

    const left = widthRatio * spec.left;
    const top = heightRatio * spec.top;
    const width = widthRatio * spec.width;
    const height = heightRatio * spec.height;

    const result = {
      left,
      top,
      height,
      width,
    };
    return result;
  };

  const calculateCoordinates = () => {
    const result: any = {};
    const domDimension = {
      height: hotSpotData.height,
      width: hotSpotData.width,
    };
    hotSpotData?.events?.forEach((event: Event) => {
      const { left, top, height, width, eventId, eventName } = event;
      const key = `${left},${top},${width},${height}`;
      if (result[key]) {
        result[key].events.push({ eventId, eventName });
      } else {
        result[key] = {
          ...getSpec(event, domDimension),
          events: [{ eventId, eventName }],
        };
      }
    });
    const hotSpotsArr = Object.values<HotSpot>(result).sort(
      (a, b) => b.height * b.width - a.height * a.width
    ); // Sorted by area to prevent overlapping
    const data: Data = {
      ...domDimension,
      hotSpots: hotSpotsArr,
    };
    setData(data);
  };

  useEffect(() => {
    if (
      viewType === "RECORDING_VIEW" ||
      viewType === "FLOW_VIEW" ||
      wait_type !== "EVENT"
    ) {
      setHotspotSelectable(false);
    } else {
      setHotspotSelectable(true);
    }
    calculateCoordinates();
  }, [hotSpotData, viewType, wait_type, imageDimension]);

  return (
    <Box className={classes.imageContainer} ref={ref}>
      <img
        src={image || SamplePreview2}
        alt="preview"
        onLoad={handleImageLoad}
      />
      {data &&
        data.hotSpots.map((hotSpot, index) => {
          const { left, top, width, height, events } = hotSpot;
          return (
            <Box
              className="hot-spot"
              key={index}
              sx={{
                top: `${top}px`,
                left: `${left}px`,
                width,
                height,
                border:
                  selectedId &&
                  events.find((event) => event.eventId === selectedId)
                    ? "2px solid green"
                    : "1px solid tomato",
              }}
              onClick={(event) => {
                handleContextMenu(event, events);
              }}
              data-testid="hot-spot-test-id"
            ></Box>
          );
        })}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        data-testid="context-menu-test-id"
      >
        {contextMenu &&
          contextMenu.events.map(
            (event: { eventName: string; eventId: string }) => (
              <MenuItem
                key={event.eventId}
                onClick={() => {
                  if (contextMenu) handleMap(event.eventId);
                }}
                data-testid="context-menu-item-test-id"
                disabled={!hotspotSelectable}
              >
                {event.eventName}
              </MenuItem>
            )
          )}
      </Menu>
    </Box>
  );
};

Preview.propTypes = {
  viewType: PropTypes.oneOf(["RECORDING_VIEW", "CREATE_FLOW_VIEW", "FLOW_VIEW"])
    .isRequired,
  image: PropTypes.string,
  wait_type: PropTypes.string.isRequired,
  onMapEvent: PropTypes.func.isRequired,
};

export default Preview;

interface Spec {
  height: number;
  width: number;
  left: number;
  top: number;
}

interface Dimension {
  height: number;
  width: number;
}

interface Data {
  hotSpots: HotSpot[];
  height: number;
  width: number;
}

interface HotSpot extends Spec {
  events: { eventId: string; eventName: string }[];
}

interface HotSpotData {
  height: number;
  width: number;
  events: Event[];
}
