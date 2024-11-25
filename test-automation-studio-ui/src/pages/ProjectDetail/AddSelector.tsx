import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton, SelectChangeEvent, Select, MenuItem } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Page, Selector } from "../../declarations/interface";
import { actions, createSelector, updateSelector } from "../../slices/pages";
import { DEFAULT_SELECTOR } from "../../util/constants";
import { AppSelect } from "../../components/AppSelect";
import { RootState } from "../../store/rootReducer";

const useStyles = makeStyles((theme) => ({
  selector: {
    "& selector": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type NameErrorKey = "REQUIRED" | "MAX_LIMIT";
type XpathErrorKey = "REQUIRED";
type PageIdErrorKey = "REQUIRED";
type PageNameErrorKey = "REQUIRED";

type NameError = {
  [key in NameErrorKey]?: string;
};

type XpathError = {
  [key in XpathErrorKey]?: string;
};

type PageIdError = {
  [key in PageIdErrorKey]?: string;
};

type PageNameError = {
  [key in PageNameErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
  xpath: XpathError;
  pageName: PageNameError;
  pageId: PageIdError;
};

const errorMsg: ErrorMsg = {
  name: {
    REQUIRED: "This field is required",
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
  xpath: {
    REQUIRED: "This field is required",
  },
  pageId: {
    REQUIRED: "Either select a page or enter New page name",
  },
  pageName: {
    REQUIRED: "Either select a page or enter New page name",
  },
};

export const AddSelector: React.FC<{
  selector?: Selector;
  page?: Page;
  onModalClose: () => void;
  label?: string;
}> = ({ selector, page, onModalClose, label }) => {
  const classes = useStyles();
  const [data, setData] = useState<Selector | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { pages, status } = useSelector((state: RootState) => state.pages);
  const { project } = useSelector((state: RootState) => state.project);

  const [nameError, setNameError] = useState<
    NameErrorKey | undefined
  >();
  const [xpathError, setXpathError] = useState<
    XpathErrorKey | undefined
  >();
  const [pageNameError, setPageNameError] = useState<
    PageNameErrorKey | undefined
  >();
  const [pageIdError, setPageIdError] = useState<
    PageIdErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Selector");

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_SELECTOR, pageId: page?.id ?? "" });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    setXpathError(undefined);
    onModalClose();
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name } }, "name")
    handleFieldChange({ target: { value: data?.xpath } }, "xpath")
    handleFieldChange({ target: { value: data?.pageName } }, "pageName")
    handleFieldChange({ target: { value: data?.pageId } }, "pageId")
    setSubmitted(true);
  };
  const submitData = () => {
    setModalOpen(false);
    setSubmitted(false);
    if (data?.id.length) {
      dispatch(updateSelector(data));
    } else {
      dispatch(createSelector({
        selector: data,
        projectId: project?.id
      }));
    }
  };

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent | any,
    field: keyof Selector
  ) => {
    setSubmitted(false);
    const value = event.target.value;
    if (field === "name") {
      validateName(value);
    }
    if (field === "xpath") {
      validateXpath(value);
    }
    if (field === "pageId") {
      validatePageId(value, data?.pageName ?? "");
      if (data) validatePageName(data?.pageName ?? "", value);
    }
    if (field === "pageName") {
      validatePageName(value, data?.pageId ?? "");
      if (data) validatePageId(data.pageId, value);
    }
    setData((prev) => {
      if (prev)
        return {
          ...prev,
          [field]: event.target.value,
        };
    });
  };

  const validatePageId = (pageId: string, pageName: string) => {
    pageId = pageId ?? "";
    if ((pageId?.length === 0 || pageId === "NEW") && (pageName.length === 0)) {
      setPageNameError("REQUIRED");
    } else {
      setPageIdError(undefined);
    }
  };

  const validatePageName = (pageName: string, pageId: string) => {
    pageName = pageName ?? "";
    if (pageName.length === 0 && (pageId.length === 0 || pageId === "NEW")) {
      setPageIdError("REQUIRED");
    } else {
      setPageNameError(undefined);
    }
  };
  const validateXpath = (value: string) => {
    if (value.length === 0) {
      setXpathError("REQUIRED");
    } else {
      setXpathError(undefined);
    }
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
    setData(selector);
  }, [selector]);

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Selector");
    } else {
      setTitle("Add Selector");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if (!!nameError || !!xpathError) return
    if (submitted) submitData();
  }, [submitted]);

  return (
    <Box>
      <Tooltip title={"Add new selector for this page"}>
        <>
          {label && <Button
            sx={{ padding: 0.5 }}
            onClick={handleModalOpen}
            data-testid="add-another-selector" startIcon={<img src={AddIcon} alt="close" />}>
            <Typography variant="subtitle1" color="primary">
              {label}
            </Typography>
          </Button>}
          {!label && <IconButton
            sx={{ padding: 0.5 }}
            onClick={handleModalOpen}
            data-testid="add-another-selector"
          >
            <img src={AddIcon} alt="close" />
          </IconButton>}
        </>
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
            {!page && <Box mb={2}>
              <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={2}>
                <Box width="100%">
                  <AppSelect
                    id={`page-id-dropdown`}
                    value={data.pageId}
                    onChange={(event) => {
                      handleFieldChange(event, "pageId");
                    }}
                    options={[{ label: "Create new page", value: "NEW" }, ...pages?.map((page) => ({
                      label: page.name,
                      value: page.id
                    })) ?? []]} label="Select Page"
                    error={!!pageIdError} />
                </Box>
                {data.pageId === "NEW" && <Box width="100%">
                  <AppTextbox
                    label="New Page Name"
                    placeholder="Enter Page Name"
                    value={data.pageName}
                    onChange={(event) => {
                      handleFieldChange(event, "pageName");
                    }}
                    classes={{ root: classes.selector }}
                    error={!!pageNameError}
                  />
                </Box>}
              </Box>
              {(pageIdError || pageNameError) && <Typography color={"error"} mt={0.5} mx={"14px"}>
                {pageNameError ? errorMsg.pageName[pageNameError] : pageIdError ? errorMsg.pageId[pageIdError] : ""}
              </Typography>}
            </Box>
            }
            <Box>
              <AppTextbox
                label="Name"
                placeholder="Enter Name"
                value={data.name}
                onChange={(event) => {
                  handleFieldChange(event, "name");
                }}
                classes={{ root: classes.selector }}
                error={!!nameError}
                helperText={
                  nameError ? errorMsg.name[nameError] : ""
                }
              />
            </Box>
            <Box mt={2}>
              <AppTextbox
                label="Xpath"
                placeholder="Enter Xpath"
                value={data.xpath}
                onChange={(event) => {
                  handleFieldChange(event, "xpath");
                }}
                classes={{ root: classes.selector }}
                error={!!xpathError}
                helperText={
                  xpathError ? errorMsg.xpath[xpathError] : ""
                }
              />
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
                disabled={!!nameError || !!xpathError}
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

export default AddSelector;
