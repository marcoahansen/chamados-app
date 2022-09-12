
import{ BrowserRouter } from 'react-router-dom'
import RoutesApp from './routes'

import AuthProvider from './contexts/auth';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#256D85',
    },
    secondary: {
      main: '#8FE3CF',
    },
  },
});

function App() {

  return (
    <AuthProvider>
      <ToastContainer theme='colored' autoClose={2000} />
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <BrowserRouter>
          <RoutesApp/>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
