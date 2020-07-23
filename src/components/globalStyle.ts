import { createMuiTheme } from '@material-ui/core';
import { amber, blue } from '@material-ui/core/colors';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: #eee;
  }
`;

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: amber[500],
    },
  },
});
export default GlobalStyle;
