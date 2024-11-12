import _ from "lodash";
import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { CustomThemeOptions } from "../declarations/theme";

const baseOptions = {};

const themesOptions: CustomThemeOptions[] = [
  {
    name: "LIGHT",
    palette: {
      mode: "light",
      background: {
        default: "#ffffff",
        primaryLight: 'rgba(104, 109, 124, 0.15)',
        secondaryLight: '#F7F9FF',
        previewBg: 'linear-gradient(180deg, #FFFCEE 0%, #F4FCFF 100%)'
      },
      primary: {
        main: '#686D7C',
      },
      secondary: {
        main: "#354EB4",
      },
      error: {
        main: '#E03C3C'
      },
      success: {
        main: '#16C848'
      },
      warning: {
        main: '#F19222'
      },
      primary35: {
        main: 'rgba(104, 109, 124, 0.35)'
      },
      primary40: {
        main: 'rgba(104, 109, 124, 0.4)'
      },
      primary50: {
        main: 'rgba(104, 109, 124, 0.5)'
      },
      primary75: {
        main: 'rgba(104, 109, 124, 0.75)'
      },
      primaryHighlight: {
        main: '#303030'
      },
    },
    typography: {
      fontFamily: [
        '"Inter"',
        'sans-serif',
      ].join(','),
      h3: {
        fontWeight: 700,
        fontSize: 20,
        letterSpacing: '-4%',
        lineHeight: 1.5
      },
      h4: {
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: '-0.04em',
        lineHeight: 1.5
      },
      h5: {
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: '-0.04em',
        lineHeight: 1
      },
      h6: {
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '-0.02em',
        lineHeight: 1
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: 12,
        letterSpacing: '-0.02em',
        lineHeight: 1
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: 10,
        letterSpacing: '-0.02em',
        lineHeight: 0.75
      },
      body1: {
        fontWeight: 400,
        fontSize: 12,
        letterSpacing: '-0.02em',
        lineHeight: 1
      },
      body2: {
        fontWeight: 400,
        fontSize: 10,
        letterSpacing: '-0.02em',
        lineHeight: 1
      }
    },
  },
];

export const createTheme = (config: { theme?: string; responsiveFontSizes?: boolean } = {}) => {
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }

  let theme = createMuiTheme(_.merge({}, baseOptions, themeOptions));

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
