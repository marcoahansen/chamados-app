import { useState, useContext } from "react";
import { Link } from 'react-router-dom'

import { AuthContext } from '../../contexts/auth'

import logo from '../../assets/logo.png'

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';


function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)

  const { logIn } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    if(email !== '' && password !== ''){
      setLoading(true)
      logIn(email, password).finally(()=>{
        setLoading(false)
      })
    }
  };

  return (
    <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Entrar
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e)=> setEmail(e.target.value) }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e)=> setPassword(e.target.value) }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              { loading ? 'Carregando...' :'Acessar' }
            </Button>
            <Grid container>
              <Grid item xs>
                
              </Grid>
              <Grid item>
                <Link to="/register" style={{color: '#256D85'}} variant="body2">
                  {"Não tem uma conta? Faça seu cadastro"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  )
}

export default SignIn

