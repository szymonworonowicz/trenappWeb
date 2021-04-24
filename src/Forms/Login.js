import React, {Component} from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import axios from "axios";
import '../Styles/Forms.css';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ( 
    {
      paper: {
        marginTop: '8px 0px 0px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: '1px'
      },
      submit: {
        margin: '1px 0px 2px 0px',
        backgroundColor: 'firebrick'
        
      },
      formPosition: {
        position: 'relative',
        width: '30%',
        height: '40%',
        top:'30%',
        left: '35%',
        backgroundColor:'black',
        padding:'0px 20px 20px 20px'
      }, 
      formElements: {
          backgroundColor:'white',
          borderRadius: '5px',
      }
    }
  )
  
class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            login:"",
            password:"",
            RememberMe:false
        };
    }

    componentDidMount() {
      const logininfo = window.sessionStorage.getItem('rememberme')

      if(logininfo !== null ) {
        const {login, password} = JSON.parse(logininfo)

        this.setState({
          login,
          password,
          RememberMe:false
        })
      }

    }

    onLogin = (data) => {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      axios.defaults.baseURL = "http://localhost:5000/";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "http://localhost:5000/";
      axios.defaults.headers.get["Access-Control-Allow-Origin"] = "http://localhost:5000/";
      axios.post("/api/Auth/login", data, config)
        .then((response) => {
          var token = response.data.token;
          if (token != null) {
            localStorage.setItem('token', token);
            this.setState({
              redirect: true
            })
          }
        })
        .catch((error) => {
            console.log(error)
            this.setState({
              redirect:false
            })
            let alertLbl = document.getElementById("alert_label");
            alertLbl.textContent="Błędny login lub hasło";
        });
        }
  
    
    onClick = () => {
        var data={
            Name: this.state.login,
            Password: this.state.password
        } 
        this.onLogin(data);
    }

    onChange = (e) =>{
      let alertLbl = document.getElementById("alert_label");
      if(alertLbl.textContent !== "")
          alertLbl.textContent = "";
      this.setState({
          [e.target.id] : e.target.value
      })
    }
    RememberMe = () => {
      this.setState((prev) => ({
        RememberMe:!prev.RememberMe
      }))
    }

    render(){
        const {classes} = this.props
        const {redirect} = this.state

        if (redirect === true)
        {
          window.location.replace("/");
          return;
        }

        return(
          <ContextConsumer>
            {
              language => {
                return (
                  <div className={classes.formPosition}>
                  <div className={classes.paper}>
                    <Typography component="h1" variant="h3" style={{color: 'white'}}>
                    {language.dictionary.Login}
                    </Typography>
                    <form className={classes.form} noValidate>
                      <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        id="login"
                        autoComplete="email"
                        autoFocus
                        className={classes.formElements}
                        onChange={(e) => this.onChange(e)}
                      />
                      <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={language.dictionary.Password}
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className={classes.formElements}
                        onChange={(e) => this.onChange(e) }
                      />
                      <FormControlLabel
                        control={<Checkbox value="remember" onClick={() => this.RememberMe()} style={{color: 'white',margin: '0px 0px -5px 0px'}}  />}
                        label={<Typography  style={{marginTop:'6px'}} >{language.dictionary.RememberMe}</Typography>}
                        style={{color:'white' }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={() => this.onClick()}
                      >
                        {language.dictionary.SignIn}
                      </Button>
                      <Grid container>
                        <Grid item xs>
                          <Link href="/forgotpassword" variant="body2" style={{color:'lightgray'}}>
                          {language.dictionary.ForgotYourPassword}
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link href="/registration" variant="body2" style={{color:'lightgray'}}>
                          {language.dictionary.DontHaveAnAccount}
                          </Link>
                        </Grid>
                      </Grid>
                    </form>
                    <label id="alert_label" className="Forms-alert-label"></label>
                  </div>
                </div>
                )
              }
            }
          </ContextConsumer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Login);