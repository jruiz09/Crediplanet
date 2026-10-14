import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Fondo from '../assets/signopesos2.jpg'
import api from '../components/utils/api';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Credit-Planet
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Login() {
    const [username, setusername] = React.useState("")
    const [password, setpassword] =  React.useState("")

  
    const loginAPI = api.urlAPI + 'auth/signin';
    const navigate = useNavigate();




    const Post = {
        username, password
    }

    const postLogin = () => {
        if ([Post.username, Post.password].includes('')) {
            swal({
              title: "Los campos son obligatorios",
              icon: "error",
              showConfirmButton: true,
            })
            
          }
          else {
            axios.post(loginAPI, Post)
              .then(response => {
                const result = response.data;
                const token = result.token;
                const username = result.username;
                const ROL = result.roles;
                const Empresa = result.idempresa;
                
                console.log("TOKEN", result)
                if (!token) {
                    swal({
                        title: "Ocurrio un error con el token, contacte con el administrador",
                        icon: "error",
                        showConfirmButton: false,
                        timer: 4000
                      });
                    return;
                }
                else 
                {
                  localStorage.clear();
                localStorage.setItem('user-token', token);
                localStorage.setItem('usuario', username);
                localStorage.setItem('rol', ROL);
                localStorage.setItem('empresa', Empresa);
               console.log("token ", token)
               console.log("localstorage ", localStorage)
                setTimeout(() => {
                    navigate('/');
                }, 500);
                setusername("")
                setpassword("")
                }      
              }
              )
              .catch(err => {
                console.log("Error", err)
                console.log("post: ", loginAPI )
                swal({
                  title: "Ocurrió un error, contactar con el administrador",
                  icon: "error",
                  showConfirmButton: false,
                  timer: 4000
                });
              })
          }
    }

   
      return (
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: 'url('+ Fondo+')',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                  t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'var(--color-primario-oscuro)' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Login
                </Typography>
                <Box component="form" sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Usuario"
                    name="email"
                    value={username}
                    onChange= {(e) => setusername(e.target.value)}
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    value={password}
                    onChange= {(e) => setpassword(e.target.value)}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        // Do code here
                        postLogin();
                      }
                    }}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Recordar"
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick= {() => postLogin()}
                  >
                    Login
                  </Button>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
      );
}