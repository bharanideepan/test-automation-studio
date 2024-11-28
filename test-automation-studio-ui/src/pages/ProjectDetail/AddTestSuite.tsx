import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton, SelectChangeEvent } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { testSuite } from "../../declarations/interface";
import { DEFAULT_PAGE } from "../../util/constants";
import { RootState } from "../../store/rootReducer";
import { actions, createtestSuite, updatetestSuite } from "../../slices/testSuites";
import MultipleSelectChip from "../../components/AppMultipleSelectChip";
import AddTag from "./AddTag";

const useStyles = makeStyles((theme) => ({
  input: {
    "& input": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type testSuiteErrorKey = "REQUIRED" | "MAX_LIMIT";

type NameError = {
  [key in testSuiteErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
};

const errorMsg: ErrorMsg = {
  name: {
    REQUIRED: "This field is required",
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
};

const AddtestSuite: React.FC<{
  testSuite?: testSuite;
  projectId: string;
  onModalClose: () => void;
}> = ({ testSuite, projectId, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<testSuite | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nameError, setNameError] = useState<
    testSuiteErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add testSuite");
  const [selectedTags, setSelectedTags] = useState<string[] | undefined>([]);
  const { testSuite: fetchedtestSuite } = useSelector((state: RootState) => state.testSuite);
  const { tags, newTag } = useSelector((state: RootState) => state.tags);

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_PAGE, projectId: projectId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    onModalClose();
    setData(undefined)
    setSelectedTags(undefined)
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name ?? "" } }, "name")
    setSubmitted(true);
  };
  const submitData = () => {
    setSubmitted(false);
    handleModalClose();
    const fetchedTagIds = new Set(fetchedtestSuite?.tags?.map((tag) => tag.id));
    const selectedTagIds = new Set(selectedTags);
    const deletedTags = fetchedtestSuite?.tags
      ?.filter((tag) => !selectedTagIds.has(tag.id))
      .map((tag) => tag.testSuiteTag?.id);
    const newTags = selectedTags
      ?.filter((selectedTag) => !fetchedTagIds.has(selectedTag))
      .map((newTag) => ({
        tagId: newTag,
        testSuiteId: fetchedtestSuite?.id,
      }));
    const tags = { deletedTags, newTags };
    if (data?.id.length) {
      dispatch(updatetestSuite({ testSuite: data, tags }));
    } else {
      dispatch(createtestSuite({ testSuite: data, tags: selectedTags ?? [] }));
    }
  };
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent | any,
    field: keyof testSuite
  ) => {
    setSubmitted(false);
    const value = event.target.value;
    if (field === "name") {
      validateName(value);
    }
    setData((prev) => {
      if (prev)
        return {
          ...prev,
          [field]: event.target.value,
        };
    });
  };

  const validateName = (name: string) => {
    if (name.length > MAX_LIMIT) {
      setNameError("MAX_LIMIT");
    } else if (name.length === 0) {
      setNameError("REQUIRED");
    } else {
      setNameError(undefined);
    }
  };

  useEffect(() => {
    setData(testSuite);
    setSelectedTags(fetchedtestSuite?.tags?.map(({ id }) => id) ?? []);
  }, [testSuite]);

  useEffect(() => {
    if (newTag) {
      setSelectedTags((prev) => {
        if (prev) return [...prev, newTag.id];
        return prev;
      })
    }
  }, [newTag])

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Test Suite");
    } else {
      setTitle("Add Test Suite");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if (nameError) return
    if (submitted) submitData();
  }, [submitted]);

  return (
    <Box>
      <Tooltip title={"Add new test suite for this project"}>
        <IconButton
          sx={{ padding: 0.5 }}
          onClick={handleModalOpen}
          data-testid="add-another-testSuitee"
        >
          <img src={AddIcon} alt="close" />
        </IconButton>
      </Tooltip>
      <AppModal
        open={modalOpen}
        onClose={handleModalClose}
        header={
          <Typography
            variant="h5"
            color="primaryHighlight.main"
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
        }
      >
        {data && (
          <Box mb={0.5}>
            <Box>
              <AppTextbox
                label="Name"
                placeholder="Enter Name"
                value={data.name}
                onChange={(event) => {
                  handleFieldChange(event, "name");
                }}
                classes={{ root: classes.input }}
                error={!!nameError}
                helperText={
                  nameError ? errorMsg.name[nameError] : ""
                }
              />
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"start"} mt={2.75} gap={2}>
              <MultipleSelectChip label={"Tags"} options={tags?.map((tag) => ({ label: tag.name, value: tag.id })) ?? []} selected={selectedTags} setSelected={setSelectedTags} />
              <AddTag projectId={projectId} onModalClose={() => { console.log("Add tag modal closed") }} />
            </Box>
            <Box mt={2.75}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  padding: 1.5,
                }}
                onClick={handleSubmit}
                fullWidth
                aria-label={title}
                disabled={!!nameError}
              >
                <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                  {title}
                </Typography>
              </Button>
            </Box>
          </Box>
        )}
      </AppModal>
    </Box>
  );
};

export default AddtestSuite;
