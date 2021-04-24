import React, {Component} from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import { Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from "@material-ui/core/styles";
import '../Styles/Forms.css';

const styles = theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor:'black'
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
});

class PasswordChange extends Component{
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            redirect:false,
            userId:-1,
            oldPassword:"",
            newPassword:"",
            repeatedPassword:""
        };
    }

    componentDidMount = () =>{
        var token = localStorage.getItem('token');
        var logged = false;
        if(token != null)
        {
            logged = true;
            this.setState({
                userId: parseInt(jwt_decode(token).id)
            })
        }
            
        this.setState({
            logged: logged
        })
    }

    onClick = () =>{
        let alertLbl = document.getElementById("alert_label");
        if (this.state.newPassword !== this.state.repeatedPassword){
            alertLbl.textContent = "Hasła nie są takie same";
            return;
        }
        const passwordRegex = /(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,30}/;
        if(!passwordRegex.test(this.state.oldPassword)){
            alertLbl.textContent = "Stare hasło się nie zgadza";
            return;
        }
        if (!passwordRegex.test(this.state.newPassword)){
            alertLbl.textContent = "Hasło musi zawierać co najmniej jedną dużą literę, jeden znak specjalny oraz mieć od 6 do 30 znaków"
        } 
        else{
            var data={
                UserId: this.state.userId,
                OldPassword: this.state.oldPassword,
                NewPassword: this.state.newPassword
            }
            this.changePasswordStatus(data);
        }
    }

    async changePasswordStatus(data) {
        const result = await this.props.onClick(data);
        if(result === true){
            alert("hasło zostało zmienione");
            this.setState({
                redirect: true
            })
        }
        else{
            // miejsce na komunikat
            let alertLbl = document.getElementById("alert_label");
            alertLbl.textContent = "Stare hasło się nie zgadza";
        }
    }

    onChange = (e) =>{
        let alertLbl = document.getElementById("alert_label");
        if(alertLbl.textContent !== "")
            alertLbl.textContent = "";
        this.setState({
            [e.target.id] : e.target.value
        });
    }

    render(){
        const { redirect } = this.state;
        const {classes} = this.props

        if (redirect === true)
            return <Redirect to="/"/>
        if(this.state.logged)
        return(
            <ContextConsumer>
                {
                    language => {
                        return (
                            <div className={classes.formPosition}>
                                <div className={classes.paper}>
                                <form className={classes.form} noValidate>
                                    <TextField
                                        variant='filled'
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="oldPassword"
                                        label={language.dictionary.OldPassword}
                                        type="password"
                                        autoFocus
                                        className={classes.formElements}
                                        onChange = {(e) => this.onChange(e)}
                                    />
                                    <TextField
                                        variant='filled'
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="newPassword"
                                        label={language.dictionary.NewPassword}
                                        type="password"
                                        autoFocus
                                        className={classes.formElements}
                                        onChange = {(e) => this.onChange(e)}
                                    />
                                    <TextField
                                        variant='filled'
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="repeatedPassword"
                                        label={language.dictionary.RepeatNewPassword}
                                        type="password"
                                        autoFocus
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
                                    Zmień Hasło
                                    </Button>
                                </form>
                                <label id="alert_label" className="Forms-alert-label"></label>
                                </div>
                            </div>
                        )
                    }
                }
            </ContextConsumer>
        );
        else return(
            <ContextConsumer>
                {
                    language => {
                        return (
                            <div className="Forms-div">
                                <h1>{language.dictionary.OnlyRegistered}</h1>
                            </div>
                        )
                    }
                }
            </ContextConsumer>
        )
    }
}

export default withStyles(styles,{withTheme:true})(PasswordChange);