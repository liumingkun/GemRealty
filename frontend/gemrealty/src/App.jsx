import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';
import Header from './features/common/Header';
import ChatPanel from './features/ChatPanel/ChatPanel';
import ResultsList from './features/ResultsList/ResultsList';
import MapView from './features/MapView/MapView';
import { Box, Container, Grid, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    }
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <Header />
            <Box sx={{ flexGrow: 1, p: 2, overflow: 'hidden' }}>
              <table style={{ width: '100%', height: '100%', borderCollapse: 'separate', borderSpacing: '16px 0', tableLayout: 'fixed' }}>
                <tbody>
                  <tr>
                    {/* Chat Panel - Left Column */}
                    <td style={{ width: '20%', verticalAlign: 'top', height: '100%' }}>
                      <ChatPanel />
                    </td>

                    {/* Results List - Middle Column */}
                    <td style={{ width: '30%', verticalAlign: 'top', height: '100%' }}>
                      <Box sx={{ height: '100%', overflowY: 'auto' }}>
                        <ResultsList />
                      </Box>
                    </td>

                    {/* Map View - Right Column */}
                    <td style={{ width: '50%', verticalAlign: 'top', height: '100%' }}>
                      <Box sx={{ height: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                        <MapView />
                      </Box>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
