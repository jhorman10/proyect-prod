import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: { 
      main: "#667eea",
      dark: "#5a67d8",
      light: "#818cf8"
    },
    secondary: { 
      main: "#764ba2",
      dark: "#6b46c1",
      light: "#a78bfa"
    },
    background: { 
      default: "#f8fafc",
      paper: "#ffffff"
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b"
    }
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em'
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.025em'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);