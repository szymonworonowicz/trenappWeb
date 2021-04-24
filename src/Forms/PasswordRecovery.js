import React, {Component} from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import { Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
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
        backgroundColor: 'black'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(1,0,2),
        backgrounColor: 'firebrick'
    },
    formPosition: {
        position: 'relative',
        width: '30%',
        height: '40%',
        top: '30%',
        left: '35%',
        backgroundColor: 'black',
        padding: '0px 20px 20px 20px'
    },
    formElements: {
        backgroundColor: 'white',
        borderRadius: '5px'
    }

});

class PasswordRecovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            email: ""
        }
    }

    /*componentDidMount = () => {

    }*/

    onSubmit = () => {
        const {email} = this.state; //
        console.log(email);
        let alertLbl = document.getElementById("alert_label");
        // eslint-disable-next-line no-useless-escape
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(email).toLowerCase()))
            alertLbl.textContent = "Adres e-mail musi składać się ze znaku małpy poprzedzonego ciągiem liter i znaków, po którym występuje nazwa domeny zawierająca w środku kropkę."
        else {
            this.sendMail(email);
        }

    }

     async sendMail(email) {
        const result = await this.props.onClick(email);
        if (result === true) {
            alert("Wysłano wiadomość potrzebną do odzyskania hasła.")
            this.setState({
                redirect: true
            });
        }
        
    }

    onChange = (e) => {
        let alertLbl = document.getElementById("alert_label");
        if (alertLbl.textContent!=="")
            alertLbl.textContent="";
        this.setState({
            email : e.target.value
        });

    }
    

    render(){
        const {redirect} = this.state;
        const {classes} = this.props;
    

    if (redirect === true) //lub do strony z inf. o wysł. maila
        return <Redirect to="/login"/>
    else
        return(
            <ContextConsumer>
                {
                    language => {
                        return (
                            <div className={classes.formPosition}>
                                <div className={classes.paper}>
                                    <Typography component="h1" variant="h3" style={{color: 'white'}}>
                                        {language.dictionary.PasswordRecovery}
                                    </Typography>
                                    <form className={classes.form}>
                                        <TextField
                                        variant='filled'
                                        margin='normal'
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        autoFocus
                                        className={classes.formElements}
                                        onChange={(e)=>this.onChange(e)}
                                        />
                                        <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        className={classes.submit}
                                        onClick={()=>this.onSubmit()}>
                                            {language.dictionary.Send}
                                        </Button>
                                    </form>
                                    <label id="alert_label" className="Forms-alert-label"></label>
                                </div>
                            </div>
                        )
                    }
                }
            </ContextConsumer>
        )
    }
}

export default withStyles(styles,{withTheme:true})(PasswordRecovery);