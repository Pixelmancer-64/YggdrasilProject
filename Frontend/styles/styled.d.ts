import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    dark: {
      name: string;
      colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        text: {
          primary: string;
          secondary: string;
        };
        background: {
          primary: string;
          secondary: string;
        };
        info: string;
        success: string;
        error: string;
        alert: string;
      };
    };
    light: {
      name: string;
      colors: {
        primary: string;
        secondary: string;
        tertiary: string;
        text: {
          primary: string;
          secondary: string;
        };
        background: {
          primary: string;
          secondary: string;
        };
        info: string;
        success: string;
        error: string;
        alert: string;
      };
    };
  }
}
