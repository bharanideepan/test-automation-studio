import React, { ChangeEvent, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AppTextbox from "../AppTextbox";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import AddIcon from "../../assets/images/add-icon-secondary.svg";

const useStyles = makeStyles((theme) => ({
  input: {
    "& textarea": {},
  },
  addButton: {
    border: `0.3px solid ${theme.palette.primary.main} !important`,
  },
}));
type ReplaceItem = {
  description: string;
  oldContent: string;
  newContent: string;
};
const DEFAULT_ROW: ReplaceItem = {
  description: "",
  oldContent: "",
  newContent: "",
};

const ReplaceFormContainer: React.FC = () => {
  const classes = useStyles();
  const [replaceItems, setReplaceItems] = useState<ReplaceItem[]>([
    DEFAULT_ROW,
  ]);
  const [enableAddButton, setEnableAddButton] = useState(false);

  const handleAddRow = () => {
    setReplaceItems([...replaceItems, DEFAULT_ROW]);
  };

  const handleRemove = (index: number) => {
    setReplaceItems((prev) => {
      const newPrev = [...prev];
      newPrev.splice(index, 1);
      return newPrev;
    });
  };

  const handleChange = (
    index: number,
    field: keyof ReplaceItem,
    value: string
  ) => {
    setReplaceItems((prev) => {
      prev[index][field] = value;
      return prev;
    });
  };

  return (
    <div>
      {replaceItems.map((item, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          marginBottom={2}
          gap={2}
          m={1}
          justifyContent={"center"}
        >
          <AppTextbox
            placeholder="Description"
            value={item.description}
            onChange={(
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleChange(index, "description", e.target.value);
            }}
            classes={{ root: classes.input }}
            multiline={true}
            rows={1}
          />
          <AppTextbox
            placeholder="Old Content"
            value={item.oldContent}
            onChange={(
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleChange(index, "oldContent", e.target.value);
            }}
            classes={{ root: classes.input }}
            multiline={true}
            rows={1}
          />
          <AppTextbox
            placeholder="New Content"
            value={item.oldContent}
            onChange={(
              e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              handleChange(index, "newContent", e.target.value);
            }}
            classes={{ root: classes.input }}
            multiline={true}
            rows={1}
          />
          <Box ml={"auto"}>
            <Tooltip title={"Remove"}>
              <IconButton
                sx={{ padding: 0.5 }}
                onClick={() => {
                  handleRemove(index);
                }}
                data-testid="remove-added-replacement"
              >
                <img src={DeleteIcon} alt="close" height="24" width="24" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}
      <Box
        display="flex"
        alignItems="center"
        justifyContent={"center"}
        marginBottom={2}
        gap={2}
        mx={1}
      >
        <Tooltip title={"Add new replacement"}>
          <IconButton
            sx={{ padding: 0.5 }}
            onClick={handleAddRow}
            data-testid="add-another-replacement"
            classes={{ root: classes.addButton }}
          >
            <img src={AddIcon} alt="close" height="24" width="24" />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default ReplaceFormContainer;
