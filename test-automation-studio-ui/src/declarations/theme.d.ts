// in the file where you are creating the theme (invoking the function `createTheme()`)
import {
  Theme,
  ThemeOptions,
  PaletteColorOptions,
  PaletteColor
} from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    primaryLight?: string;
    secondaryLight?: string;
    previewBg?: string;
  }

  interface PaletteOptions {
    primary35?: PaletteColorOptions;
    primary40?: PaletteColorOptions;
    primary50?: PaletteColorOptions;
    primary75?: PaletteColorOptions;
    primaryHighlight?: PaletteColorOptions;
  }

  interface Palette {
    primary35: PaletteColor;
    primary40: PaletteColor;
    primary50: PaletteColor;
    primary75: PaletteColor;
    primaryHighlight: PaletteColor;
  }
}

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {
  }
}


export interface CustomThemeOptions extends ThemeOptions {
  name: string;
}
