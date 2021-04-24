import React, {Component} from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import { Redirect } from 'react-router-dom';
import '../Styles/Forms.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from "@material-ui/lab/Alert";

const styles = theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(1, 0, 2),
      backgroundColor: 'firebrick'
      
    },
    formPosition: {
      margin: 'auto',
      width: '30%',
      backgroundColor:'black',
      padding:'0px 20px 20px 20px'
    }, 
    formElements: {
        backgroundColor:'white',
        borderRadius: '5px',
    },
    styledAlert: {
      '&.MuiAlert-filledError': {
        backgroundColor: 'firebrick'
      }
    },
    styledSnackbar: {
      '&.MuiSnackbar-root': {
        maxWidth: '30%'
      }
    }
  });

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" backgroundColor='firebrick' {...props}/>;
}

class Registration extends Component{
    constructor(props) {
        super(props);
        this.state = {
            login:"",
            password:"",
            repeatedPassword: "",
            areDetailsVisible:false,
            errorMessage:''
        };
    }

    validateEmail = (email) => {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(String(email).toLowerCase());
    } 
    
    onClick = () =>{
        if (this.state.password !== this.state.repeatedPassword)
        {
            this.setState({
                errorMessage:'Hasła muszą być identyczne'
            })
            return;
        }
        let typedPassword = this.state.password;
        const passwordRegex = /(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,30}/;
        if (!passwordRegex.test(typedPassword))
        {
            this.setState({
                errorMessage:'Twoje hasło powinno zawierać jedną wielką literę, jeden znak specjalny i powinno mieć 6-30 znaków'
            })
            return;
        }
        let typedLogin = this.state.login;
        const loginRegex = /^(?=.{3,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
        if (!loginRegex.test(typedLogin))
        {
            this.setState({
                errorMessage:'Twoja nazwa użytkownika powinna mieć 6-30 znaków. Nazwa nie może rozpoczynać się od znaku specjalnego.'
            })
            return;
        }

       this.setState({
           areDetailsVisible:true
        })
    }

    onChange = (e) =>{

        this.setState({
            [e.target.id] : e.target.value
        })

    }

    handleFilterClose = (event,reason) => {
        if (reason === 'clickaway') {
            return;
          }
        this.setState({
            errorMessage:''
        })
    }

    render(){
        const {areDetailsVisible, errorMessage } = this.state;
        const {classes } = this.props
       
        if(areDetailsVisible===true)
        {
            return <Redirect to={{
                pathname: '/profile',
                registrationData: { login: this.state.login , password: this.state.password }
            }}/>
        }
        
        return(
          <ContextConsumer>
            {
              language => {
                return (
                  <div className={classes.formPosition}>
                    <Snackbar className={classes.styledSnackbar} open={errorMessage!==''}
                              autoHideDuration={6000} onClose={this.handleFilterClose}>
                        <Alert className={classes.styledAlert} onClose={this.handleFilterClose} severity="error">
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                  <div className={classes.paper}>
                    <Typography component="h1" variant="h3" style={{color: 'white'}}>
                        Rejestracja
                    </Typography>
                    <form className={classes.form} noValidate>
                    <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label={language.dictionary.Name}
                        autoFocus
                        className={classes.formElements}
                        onChange = {(e) => this.onChange(e)}
                      />
                      <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        id="surname"
                        label={language.dictionary.Surname}
                        autoFocus
                        className={classes.formElements}
                        onChange = {(e) => this.onChange(e)}
                      />
                      <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        autoFocus
                        className={classes.formElements}
                        onChange = {(e) => this.onChange(e)}
                      />
                        <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        label={language.dictionary.UserName}
                        autoFocus
                        className={classes.formElements}
                        onChange = {(e) => this.onChange(e)}
                      />
                      <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        label={language.dictionary.Password}
                        type="password"
                        id="password"
                        className={classes.formElements}
                        onChange = {(e) => this.onChange(e)}
                      />
                        <TextField
                        variant='filled'
                        margin="normal"
                        required
                        fullWidth
                        label={language.dictionary.RepeatPassword}
                        type="password"
                        id="repeatedPassword"
                        className={classes.formElements}
                        onChange = {(e) => this.onChange(e)}
                      />
            
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={(e) => this.onClick()}
                      >
                        {language.dictionary.GoNext}
                      </Button>
                      <Typography component='h5' align='center'>
                        <Link href="/login" variant="body2" style={{color:'lightgray'}}>
                          {language.dictionary.HaveAccount}
                        </Link>
                      </Typography>      
                    </form>                      
                  </div>
                </div>
                )
              }
            }
          </ContextConsumer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Registration);