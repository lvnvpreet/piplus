import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0069ff',
    },
    secondary: {
      main: '#031b4e',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F8F8F8',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'Montserrat'
    ]
  }
});

//colors:
// #007FA7
// #F1007C

// Backgrond: white or #F8F8F8

//fonts: mONSTERRRAT AND LORA

export default theme;