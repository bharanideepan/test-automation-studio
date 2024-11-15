import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      "*": {
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      },
      html: {
        "-webkit-font-smoothing": "antialiased",
        "-moz-osx-font-smoothing": "grayscale",
        height: "100%",
        width: "100%",
      },
      body: {
        height: "100%",
        width: "100%",
      },
      "#root": {
        height: "100%",
        width: "100%",
      },
      ".infinite-scroll-component::-webkit-scrollbar": {
        display: "none !important",
      },
    },
  })
);

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
