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
    Link
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import EditIcon from "../../assets/images/edit-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { RootState } from "../../store/rootReducer";
import { TestSuite, Selector } from "../../declarations/interface";
import { getTestSuiteById } from "../../slices/testSuite";
import NewTabIcon from "../../assets/images/new-tab-icon.png";
import PlayIcon from "../../assets/images/play-icon.png";
import DuplicateIcon from "../../assets/images/duplicate.png";
import { executeRun } from "../../slices/testSuiteRun";
import { duplicateTestSuite } from "../../slices/testSuites";
import AddTestSuite from "./AddTestSuite";
import { TestCasesListView } from "./TestCaseContainer";


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

const TestSuiteContainer: React.FC<{
    list: TestSuite[];
    projectId: string;
}> = ({ list, projectId }) => {
    const classes = useStyles();
    const [count, setCount] = useState(0);
    const dispatch = useDispatch();
    const [selectedtestSuite, setSelectedtestSuite] = useState<TestSuite | undefined>(undefined);
    const { testSuite: fetchedTestSuite } = useSelector((state: RootState) => state.testSuite);

    useEffect(() => {
        if (selectedtestSuite) dispatch(getTestSuiteById(selectedtestSuite?.id))
    }, [selectedtestSuite]);

    useEffect(() => {
        if (selectedtestSuite) dispatch(getTestSuiteById(selectedtestSuite?.id))
    }, [list]);

    useEffect(() => {
        if (list) {
            if (list.length !== count) {
                setSelectedtestSuite(list[list.length - 1])
            }
            setCount(list.length)
        }
    }, [list])

    return (
        <>
            {list.length === 0 && (
                <Box className={clsx(classes.contentCenter, classes.body)}>
                    <Box mr={1}>
                        <AddTestSuite
                            projectId={projectId}
                            onModalClose={() => { console.log("Add Test Suite modal closed") }}
                        />
                    </Box>
                    <Typography variant="h5" color="primary">
                        Add New Test Suite
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
                        <TestSuiteListView projectId={projectId} testSuites={list} selectedtestSuite={list.find((testSuite: TestSuite) => testSuite.id == selectedtestSuite?.id)} setSelectedtestSuite={setSelectedtestSuite} />
                    </Grid>
                    <Grid item xs={6} classes={{ item: classes.item }} py={2}>
                        <TestCasesListView projectId={projectId} testCases={fetchedTestSuite?.testCases ?? []} readonly={true} />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

const TestSuiteListView: React.FC<{
    testSuites: TestSuite[];
    setSelectedtestSuite: (testSuite?: TestSuite) => void
    selectedtestSuite: TestSuite | undefined;
    projectId: string;
}> = ({
    testSuites, selectedtestSuite, setSelectedtestSuite, projectId
}) => {
        const classes = useStyles();
        const [edittestSuite, setEditTestSuite] = useState<TestSuite | undefined>(undefined);
        const dispatch = useDispatch();
        const handleRun = (id: string) => {
            dispatch(executeRun(id))
        }
        const handleDuplicate = (id: string) => {
            dispatch(duplicateTestSuite(id))
        }
        return (
            <>
                <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
                    <Box flexGrow={1}>
                        <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                            <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
                                <AddTestSuite
                                    testSuite={edittestSuite}
                                    projectId={projectId}
                                    onModalClose={() => { setEditTestSuite(undefined) }}
                                />
                                <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                                    Test Suite: {testSuites.length}
                                </Typography>
                            </Box>
                            {/* <Typography variant="h5" sx={{ marginTop: 0.25 }}>
                                Click a test suite to view / edit selector
                            </Typography> */}
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.listContainer}>
                    <Box className={classes.body}>
                        <TableContainer sx={{ maxHeight: "100%" }}>
                            <Table stickyHeader aria-label="sticky table">
                                {/* <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "20%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ width: "70%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Tags
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ width: "10%" }} align="left">
                                            <Typography variant="h5" color="primary">
                                                Edit
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead> */}
                                <TableBody>
                                    {testSuites.map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
                                                setSelectedtestSuite(row);
                                            }} className={selectedtestSuite?.id == row.id ? classes.active : ''}>
                                                <TableCell style={{ width: "40%" }} align="left">
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
                                                <TableCell style={{ width: "40%" }} align="left">
                                                    <Tooltip title={row.tags?.map(tag => tag.name).join(", ")}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            color="primary"
                                                            overflow="hidden"
                                                            textOverflow="ellipsis"
                                                            maxWidth="300px"
                                                        >
                                                            {row.tags?.map(tag => tag.name).join(", ")}
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell style={{ width: "5%" }} align="left">
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
                                                                    setEditTestSuite(row);
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
                                                <TableCell style={{ width: "5%" }} align="left">
                                                    <Box
                                                        display={"flex"}
                                                        justifyContent={"start"}
                                                        alignItems={"center"}
                                                        gap={2}
                                                    >
                                                        <Tooltip title={"Clone"}>
                                                            <IconButton
                                                                sx={{ padding: 0.5, opacity: 0.6 }}
                                                                onClick={() => {
                                                                    handleDuplicate(row.id);
                                                                }}
                                                                data-testid="duplicate-testcase"
                                                            >
                                                                <img
                                                                    src={DuplicateIcon}
                                                                    alt="close"
                                                                    height="20"
                                                                    width="20"
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                                <TableCell style={{ width: "5%" }} align="left">
                                                    <Box
                                                        display={"flex"}
                                                        justifyContent={"start"}
                                                        alignItems={"center"}
                                                        gap={2}
                                                    >
                                                        <Tooltip title={"Run"}>
                                                            <IconButton
                                                                sx={{ padding: 0.5, opacity: 0.6 }}
                                                                onClick={() => {
                                                                    handleRun(row.id);
                                                                }}
                                                                data-testid="run-testcase"
                                                            >
                                                                <img
                                                                    src={PlayIcon}
                                                                    alt="close"
                                                                    height="20"
                                                                    width="20"
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                                <TableCell style={{ width: "5%" }} align="left">
                                                    <Tooltip title={"View run history"}>
                                                        <Link
                                                            color="inherit"
                                                            to={`/test-suite/${row.id}`}
                                                            component={RouterLink}
                                                            underline="none"
                                                            target="_blank"
                                                        >
                                                            <IconButton
                                                                sx={{ padding: 0.5, opacity: 0.6 }}
                                                                onClick={() => {
                                                                    console.log("clicked new tab")
                                                                }}
                                                                data-testid="open-testcase"
                                                            >
                                                                <img
                                                                    src={NewTabIcon}
                                                                    alt="close"
                                                                    height="24"
                                                                    width="24"
                                                                />
                                                            </IconButton>
                                                        </Link>
                                                    </Tooltip>
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

// const SelectorListView: React.FC<{
//     selectors?: Selector[];
//     setSelectedSelector: (selector: Selector) => void
//     selectedSelector: Selector | undefined;
//     testSuite?: testSuite;
// }> = ({
//     selectors, selectedSelector, setSelectedSelector, testSuite
// }) => {
//         const classes = useStyles();
//         const [editSelector, setEditSelector] = useState<Selector | undefined>(undefined);
//         return (
//             <>
//                 <Box gap={2} mb={2} px={2} className={classes.stickyContainer}>
//                     <Box flexGrow={1}>
//                         <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
//                             {testSuite && <Box>
//                                 <Typography variant="h5" sx={{ marginTop: 0.25 }}>
//                                     {testSuite.name}
//                                 </Typography>
//                             </Box>}
//                             {testSuite && <Box display={"flex"} gap={2} justifyContent={"center"} alignItems={"center"}>
//                                 <AddSelector
//                                     selector={editSelector}
//                                     testSuite={testSuite}
//                                     onModalClose={() => { setEditSelector(undefined) }}
//                                 />
//                                 <Typography variant="h5" sx={{ marginTop: 0.25 }}>
//                                     Selectors: {selectors?.length ?? 0}
//                                 </Typography>
//                             </Box>}
//                             {!testSuite && <Typography variant="h5" sx={{ marginTop: 0.25 }}>
//                                 Select a testSuite to view its selectors
//                             </Typography>}
//                         </Box>
//                     </Box>
//                 </Box>
//                 <Box className={classes.listContainer}>
//                     <Box className={classes.body}>
//                         <TableContainer sx={{ maxHeight: "100%" }}>
//                             <Table stickyHeader aria-label="sticky table">
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell style={{ width: "30%" }} align="left">
//                                             <Typography variant="h5" color="primary">
//                                                 Name
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell style={{ width: "60%" }} align="left">
//                                             <Typography variant="h5" color="primary">
//                                                 Xpath
//                                             </Typography>
//                                         </TableCell>
//                                         <TableCell style={{ width: "10%" }} align="left">
//                                             <Typography variant="h5" color="primary">
//                                                 Edit
//                                             </Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {selectors && selectors.map((row, index) => {
//                                         return (
//                                             <TableRow hover role="checkbox" tabIndex={-1} key={index} onClick={() => {
//                                                 setSelectedSelector(row);
//                                             }} className={selectedSelector?.id == row.id ? '' : ''}>
//                                                 <TableCell style={{ width: "30%" }} align="left">
//                                                     <Typography
//                                                         variant="subtitle1"
//                                                         color="primary"
//                                                         overflow="hidden"
//                                                         textOverflow="ellipsis"
//                                                         maxWidth="300px"
//                                                     >
//                                                         {row.name}
//                                                     </Typography>
//                                                 </TableCell>
//                                                 <TableCell style={{ width: "60%" }} align="left">
//                                                     <Typography
//                                                         variant="subtitle1"
//                                                         color="primary"
//                                                         overflow="hidden"
//                                                         textOverflow="ellipsis"
//                                                         maxWidth="300px"
//                                                     >
//                                                         {row.xpath}
//                                                     </Typography>
//                                                 </TableCell>
//                                                 <TableCell style={{ width: "10%" }} align="left">
//                                                     <Box
//                                                         display={"flex"}
//                                                         justifyContent={"start"}
//                                                         alignItems={"center"}
//                                                         gap={2}
//                                                     >
//                                                         <Tooltip title={"Edit"}>
//                                                             <IconButton
//                                                                 sx={{ padding: 0.5 }}
//                                                                 onClick={() => {
//                                                                     setEditSelector(row);
//                                                                 }}
//                                                                 data-testid="edit-selector"
//                                                             >
//                                                                 <img
//                                                                     src={EditIcon}
//                                                                     alt="close"
//                                                                     height="24"
//                                                                     width="24"
//                                                                 />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                     </Box>
//                                                 </TableCell>
//                                             </TableRow>
//                                         );
//                                     })}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Box>
//                 </Box>
//             </>
//         );
//     };
export default TestSuiteContainer;