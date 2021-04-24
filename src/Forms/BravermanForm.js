import React, { Component } from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import '../Styles/Forms.css';
import '../Styles/Braverman.css';
import axios from 'axios';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FormGroup from '@material-ui/core/FormGroup';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { CustomCheckbox } from '../Components/StyledComponents';
import { FormControlLabel, Button, withStyles } from '@material-ui/core';
axios.defaults.baseURL = 'http://localhost:5000/';

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
    formPosition: {
        margin: 'auto',
        width: '50%',
        marginLeft: '30%',
        marginRight: '20%',
        backgroundColor:'black',
        padding:'0px 20px 20px 20px'
    },
    submit: {
      margin: theme.spacing(1, 0, 2),
      backgroundColor: 'firebrick'
    },
    FormControlLabel:{
        '&.MuiFormControlLabel-root':{
            color: 'white'
        }
    }
  });

class BravermanForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionList: [],
            counter: 0,
            logged: false
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.category !== this.props.category) {
          this.fetchData();
        }
    }
    
    componentDidMount (){
        var token = localStorage.getItem('token');
        var logged = false;
        if(token != null)
        {
            logged = true;
            this.setState({
                logged: logged
            })
        }
        if( logged )
            this.fetchData();
    }

    fetchData = () =>
    {
        const config = {
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json',
                withCredentials: true,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Expose-Headers': '*'
            }
        }
        axios.get('api/Braverman/' + this.props.category,config)
        .then( x => {
            console.log("response",x.data)
            // set new token to refresh expire time
            localStorage.setItem('token',x.headers['newtoken'])
            this.setState(() => {
                let qList = x.data.question
                qList.sort(this.SortByProp("type"));
                return { questionList: qList, counter: 0};
            })
        })
    }

    SortByProp = (prop) =>{    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }  

    changeClicks = (event) => {
        let c = this.state.counter;
        if (event.target.checked === true) {
            this.setState(()=>{
                return {counter: c+1};
            })
        }
        else {
            this.setState(()=>{
                return {counter: c-1};
            })
        }
    }

    changeType = (type) =>{
        this.setState({
            type:type
        })
    }

    onButtonClick = () => {
        this.props.Submit(this.state.counter);
    }

    render() {
        var qList = this.state.questionList;
        const {classes } = this.props
        let type = '';
        if(this.state.logged)
        return (
             <ContextConsumer>
                 {
                     language => {
                         return (
                            <div className={classes.formPosition}>
                            <div className={classes.paper}>
                                <form className={classes.form} noValidate>
                                    {qList.map((x, key) => {
                                        return <div key={x.id}>
                                            {type===x.type ? (
                                                <FormControlLabel className={classes.FormControlLabel}
                                                    control={<CustomCheckbox onChange={this.changeClicks}
                                                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                            checkedIcon={<CheckBoxIcon fontSize="small" />}/>}
                                                    label={x.question}
                                                />
                                            ) : (
                                            <div>
                                                <label className="Braverman-bigLabel">{x.type}</label><br/>
                                                <FormControlLabel className={classes.FormControlLabel}
                                                    control={<CustomCheckbox onChange={this.changeClicks} name="checkbox" 
                                                                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                                                            checkedIcon={<CheckBoxIcon fontSize="small" />}/>}
                                                    label={x.question}
                                                />
                                                <script>{type=x.type}</script>
                                            </div>
                                            )}
                                        </div>
                                    })}
                                    <Button
                                            fullWidth
                                            variant="contained"
                                            color="secondary"
                                            className={classes.submit}
                                            onClick={this.onButtonClick}
                                        >
                                            {language.dictionary.GoNext}
                                    </Button>
                                </form>
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

export default withStyles(styles, { withTheme: true })(BravermanForm);

