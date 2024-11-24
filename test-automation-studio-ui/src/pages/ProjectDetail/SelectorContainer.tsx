import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Typography,
    TableBody,
    Box,
    Tooltip,
    IconButton,
    Button,
    Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import EditIcon from "../../assets/images/edit-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "../../store/rootReducer";
import { Page, Selector } from "../../declarations/interface";
import AddPage from "./AddPage";
import AddSelector from "./AddSelector";


const useStyles = makeStyles((theme) => ({
    body: {
        // borderTop: `0.5px solid ${theme.palette.primary40.main}`,
    },
    container: {
        height: "100%",
    },
    item: {
        height: "100%",
        "&:first-child": {
            borderRight: `0.5px solid ${theme.palette.primary40.main}`,
        },
        "&:last-child": {
            borderLeft: `0.5px solid ${theme.palette.primary40.main}`,
            // background: theme.palette.background.previewBg,
        },
    },
    contentCenter: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
    fullWidth: {
        maxWidth: "100%",
    },
    listContainer: {
        height: "calc(100% - 40px)",
        overflow: "auto",
        boxShadow: "0px -4px 5px -4px rgba(0, 0, 0, 0.15)",
    },
    stickyContainer: {
        display: "flex",
        alignItems: "center",
        height: "24px",
    },
    active: {
        border: `1px solid ${theme.palette.secondary.main}`,
        backgroundColor: "rgba(0, 0, 0, 0.1) !important",
    }
}));

const SelectorContainer: React.FC<{
    list: Page[];
    projectId: string;
}> = ({ list, projectId }) => {
    const classes = useStyles();
    const [count, setCount] = useState(0);
    const [selectedPage, setSelectedPage] = useState<Page | undefined>(undefined);
    const [selectedSelector, setSelectedSelector] = useState<Selector | undefined>(undefined);
    useEffect(() => {
        if (list) {
            if (list.length !== count) {
                setSelectedPage(list[list.length - 1])
            }
            setCount(list.length)
        }
    }, [list])

    return (
        <>
            {list.length === 0 && (
                <Box className={clsx(classes.contentCenter, classes.body)}>
                    <Box mr={1}>
                        <AddPage
                            projectId={projectId}
                            onModalClose={() => { console.log("Add page modal closed") }}
                        />
                    </Box>
                    <Typography variant="h5" color="primary">
                        Add New Page
                    </Typography>
                </Box>
            )}
            {list.length > 0 && (
                <Grid
                    container
                    classes={{ container: classes.container }}
                    sx={{
                        height: "100%",
                    }}
                >
                    <Grid item xs={6} classes={{ item: classes.item }} py={2}>
                        <PageListView projectId={projectId} pages={list} selectedPage={list.find((page: Page) => page.id == selectedPage?.id)} setSelectedPage={setSelectedPage} />
                    </Grid>
                    <Grid item xs={6} classes={{ item: classes.item }} py={2}>
                        <SelectorListView page={selectedPage} selectors={list.find((page: Page) => page.id == selectedPage?.id)?.selectors} selectedSelector={selectedSelector} setSelectedSelector={setSelectedSelector} />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

const PageListView: React.FC<{
    pages: Page[];
    setSelectedPage: (page?: Page) => void
    selectedPage: Page | undefined;
    projectId: string;
}> = ({
    pages, selectedPage, setSelectedPage, projectId
}) => {
        const classes = useStyles();
        const [editPage, setEditPage] = useState<Page | undefined>(undefined);
        return (
            <>
                <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
                    <Box flexGrow={1}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                                <AddPage
                                    page={editPage}
                                    projectId={projectId}
                                    onModalClose={() => { setEditPage(undefined) }}
                                />
                                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                                    Pages: {pages.length}
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                                Click an page to view / edit selector
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.listContainer}>
                    <Box className={classes.body}>
                        <TableContainer sx={{ maxHeight: "100%" }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "90%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ width: "10%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Edit
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pages.map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                                                setSelectedPage(row);
                                            }} className={selectedPage?.id == row.id ? classes.active : ''}>
                                                <TableCell style={{ width: "90%" }} align="left">
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="primary"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                        maxWidth="300px"
                                                    >
                                                        {row.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ width: "10%" }} align="left">
                                                    <Box
                                                        display={"flex"}
                                                        justifyContent={"start"}
                                                        alignItems={"center"}
                                                        gap={2}
                                                    >
                                                        <Tooltip title={"Edit"}>
                                                            <IconButton
                                                                sx={{ padding: 0.5 }}
                                                                onClick={() => {
                                                                    setEditPage(row);
                                                                }}
                                                                data-testid="remove-added-replacement"
                                                            >
                                                                <img
                                                                    src={EditIcon}
                                                                    alt="close"
                                                                    height="24"
                                                                    width="24"
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </>
        );
    };

const SelectorListView: React.FC<{
    selectors?: Selector[];
    setSelectedSelector: (selector: Selector) => void
    selectedSelector: Selector | undefined;
    page?: Page;
}> = ({
    selectors, selectedSelector, setSelectedSelector, page
}) => {
        const classes = useStyles();
        const [editSelector, setEditSelector] = useState<Selector | undefined>(undefined);
        return (
            <>
                <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
                    <Box flexGrow={1}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            {page && <Box>
                                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                                    {page.name}
                                </Typography>
                            </Box>}
                            {page && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                                <AddSelector
                                    selector={editSelector}
                                    page={page}
                                    onModalClose={() => { setEditSelector(undefined) }}
                                />
                                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                                    Selectors: {selectors?.length ?? 0}
                                </Typography>
                            </Box>}
                            {!page && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                                Select a page to view its selectors
                            </Typography>}
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.listContainer}>
                    <Box className={classes.body}>
                        <TableContainer sx={{ maxHeight: "100%" }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "30%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ width: "60%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Xpath
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ width: "10%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Edit
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectors && selectors.map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                                                setSelectedSelector(row);
                                            }} className={selectedSelector?.id == row.id ? '' : ''}>
                                                <TableCell style={{ width: "30%" }} align="left">
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="primary"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                        maxWidth="300px"
                                                    >
                                                        {row.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ width: "60%" }} align="left">
                                                    <Typography
                                                        variant="subtitle1"
                                                        color="primary"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                        maxWidth="300px"
                                                    >
                                                        {row.xpath}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ width: "10%" }} align="left">
                                                    <Box
                                                        display={"flex"}
                                                        justifyContent={"start"}
                                                        alignItems={"center"}
                                                        gap={2}
                                                    >
                                                        <Tooltip title={"Edit"}>
                                                            <IconButton
                                                                sx={{ padding: 0.5 }}
                                                                onClick={() => {
                                                                    setEditSelector(row);
                                                                }}
                                                                data-testid="edit-selector"
                                                            >
                                                                <img
                                                                    src={EditIcon}
                                                                    alt="close"
                                                                    height="24"
                                                                    width="24"
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </>
        );
    };
export default SelectorContainer;