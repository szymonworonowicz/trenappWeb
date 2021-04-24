import React, { Component } from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import '../Styles/Forms.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import {
    Button,
    Grid,
    TextField //zamiast inputa również może
} from '@material-ui/core';
import { Hidden } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
    button:{
        margin: theme.spacing(1, 0, 2),
        backgroundColor: 'firebrick'
    },
    header: {
        position:'relative',
        height:'30px'
    },
    toggler :{
        position:'absolute',
        right:'0%',
        height:'30px',
        marginRight:'5px',
        marginTop:'-5px',
        backgroundColor:'rgb(32, 32, 31);',
        fontVariant:'normal'
    },
    active: {
        color:'firebrick'
    }, //needed so that the &$active tag works
    completed: {
        color:'firebrick'
    },
    disabled: {
        color:'firebrick'
    },
    stepLabelActiveComplete: {
        color:'gray'
    },
    labelContainer: {
        color:'firebrick',
        "& $alternativeLabel": {
            marginTop: 0
        }
    },
    tableCellStyle : {
        backgroundColor:'rgb(32, 32, 31);',
        color:'white'
    },
})

const BootstrapButton = withStyles({
    root: {
      boxShadow: 'none',
      textTransform: 'none',
        
      padding: '6px 12px',
     
      '&:hover': {
        boxShadow: 'none',
      },
      '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
      },
    },
    label :{
        textVariant:"normal"
    }
  })(Button);

axios.defaults.baseURL = 'http://localhost:5000/';

class TrainingPlan3days extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AthleteId: -1,
            Days: 3,
            Exercises: [],//pobrana i gotowa lista do rozdzielenia
            logged: false,
            role: "",
            TrainerId: 0,
            defaultAthleteIdSetted: false
        }
        //this.postPlan = this.postPlan.bind(this); ///
    }


    async componentDidMount (){

        ///
        //this.props.postplan(this.postPlan)

        console.log(this.props)
        if (this.props.idFromProps!==null) {
            console.log(this.props.idFromProps)
            this.setState({
            AthleteId: this.props.idFromProps
            })
        }
        

        await this.setToken();
        if( this.state.logged )
        {
            this.fetchData();
        }
        
    }

    async setToken(){
        var token = localStorage.getItem('token');
        var role = this.state.role;
        if (token!==null)
            role = jwt_decode(token).role;
        var logged = false;
        if(token != null)
        {
            logged = true;
            this.setState({
                logged: logged,
                role: role,
                TrainerId: jwt_decode(token).id
            })
        }

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

        axios.get('api/trainingplan/create',config)
        .then( x => {
            // set new token to refresh expire time
            localStorage.setItem('token',x.headers['newtoken'])
            this.setState(() => {
                let eList = x.data.excercises;
                let result = [];
                // data for table
                console.log(eList)
                for(var i in eList)
                    result.push([i, eList[i]]);
                return { Exercises: result};
            })
        })
        .catch((error) => {
            console.log("error",error);
        });
        
    }

    // when option in selection change
    onSelectionChange = (event) =>{
       /* var id = event.target.id;
        //var selectedOption = event.target.value;
        var columns = document.getElementById("tr"+id).cells;
        for(let i = 2 ; i < columns.length ; i++)
        {
            columns[i].innerHTML = <input placeholder="Wprowadź dane"></input>
        }*/
    }

    onAthleteSelectionChange = (event) => {
        this.setState({
            AthleteId: event.target.value
        })
     console.log(event.target.value)
    }

    postPlan = () => {

        console.log("Postplan")
        //let plan = this.state.plan;
        /*axios.post('api/trainingplan/postplan', plan, config)
        .then( x => {
            // set new token to refresh expire time
            localStorage.setItem('token',x.headers['newtoken'])
            this.setState(() => {
                let eList = x.data.excercises;
                let result = [];
                // data for table
                console.log(eList)
                for(var i in eList)
                    result.push([i, eList[i]]);
                return { Exercises: result};
            })
        })
        .catch((error) => {
            console.log("error",error);
        });*/
    }

    render() {

        var eList = this.state.Exercises;

        const {classes } = this.props////
        //document.querySelectorAll(".input").forEach(i=>i.style.backgroundColor = "black") ////
        /*var inputs = document.getElementsByTagName('input');
        for (var i = 0; i<inputs.length; i++) {
            inputs[i].style.backgroundColor = "black"
            inputs[i].style.color = "white"
        }*/
        if(this.state.logged && this.state.role!=="user")
        return (
            <ContextConsumer>
                {
                    language => {
                        return (
                            <div className="Forms-div">
                                <Grid container justify='center' alignItems='center' spacing={1} style ={{width:'55%',marginTop:'20px',marginLeft:'25%'}}>
                                    <Grid item xs ={14} container justify='center' alignItems='center' >
                                        <Button
                                            name="postPlanButton"
                                            variant="contained"
                                            color="secondary"
                                            className={classes.button}
                                            disabled="true"
                                            onClick={this.props.postplan(this.postPlan)}
                                        >
                                            {language.dictionary.SendPlan}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={14}>
                                        <table className="Forms-table" id="divToPrint" ref={this.componentRef}>
                                            {/* Day I */}
                                            <tbody className="Forms-tbody1">
                                                <tr style={{backgroundColor:'firebrick',color:'white'}}>
                                                    <th>{language.dictionary.Category}</th>
                                                    <th>{language.dictionary.ExcerciseName}</th>
                                                    <th>{language.dictionary.ProgressionMethod}</th>
                                                    <th>{language.dictionary.Sets}</th>
                                                    <th>{language.dictionary.Reps}</th>
                                                    <th>Tempo</th>
                                                    <th>{language.dictionary.Break}</th>
                                                    <th>{language.dictionary.Comments}</th>
                                                </tr>
                                                <tr>
                                                    <th  style={{backgroundColor:'firebrick',color:'white'}} colSpan="8" className={classes.header} >
                                                        {language.dictionary.Day} I
                                                    </th> 
                                                </tr>
                                                {eList.map((x,key)=>{
                                                    if(x[0]!=="deadliftAccesory" && x[0]!=="benchpressAccesory")
                                                    {
                                                        return(
                                                            <tr id={"trday1"+key} key={"day1"+key} className={classes.tableCellStyle}>
                                                                <td>{x[0]}</td>
                                                                <td>
                                                                <Autocomplete
                                                                id="combo-box-demo"
                                                                options={x[1]}
                                                                getOptionLabel={(option) => option.excerciseName}
                                                                style={{ backgroundColor:'firebrick',color:'white', width: 300 }}
                                                                renderInput={(params) => <TextField style={{ backgroundColor:'firebrick',color:'white' }}  {...params} label="Wybierz" variant="outlined" />}
                                                                />
                                                                </td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                            </tr>
                                                        )
                                                    }
                                                    else return null;
                                                })}
                                            </tbody>
                                            {/* Day II */}
                                            <tbody className="Forms-tbody2">
                                                <tr>
                                                    <th  style={{backgroundColor:'firebrick',color:'white'}} colSpan="8" className={classes.header} >
                                                        {language.dictionary.Day} II
                                                    </th> 
                                                </tr>
                                                {eList.map((x,key)=>{
                                                    if(x[0]!=="squatAccesory" && x[0]!=="benchpressAccesory")
                                                    {
                                                        return(
                                                            <tr id={"trday2"+key} key={"day2"+key} className={classes.tableCellStyle}>
                                                                <td>{x[0]}</td>
                                                                <td>
                                                                <Autocomplete
                                                                id="combo-box-demo"
                                                                options={x[1]}
                                                                getOptionLabel={(option) => option.excerciseName}
                                                                style={{ backgroundColor:'firebrick',color:'white', width: 300 }}
                                                                renderInput={(params) => <TextField style={{ backgroundColor:'firebrick',color:'white' }}  {...params} label="Wybierz" variant="outlined" />}
                                                                />
                                                                </td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                            </tr>
                                                        )
                                                    }
                                                    else return null;
                                                })}
                                            </tbody>
                                            {/* Day III */}
                                            <tbody className="Forms-tbody3">
                                                <tr>
                                                    <th  style={{backgroundColor:'firebrick',color:'white'}} colSpan="8" className={classes.header} >
                                                        {language.dictionary.Day} III
                                                    </th> 
                                                </tr>
                                                {eList.map((x,key)=>{
                                                    if(x[0]!=="squatAccesory" && x[0]!=="deadliftAccesory")
                                                    {
                                                        return(
                                                            <tr id={"trday3"+key} key={"day3"+key} className={classes.tableCellStyle}>
                                                                <td>{x[0]}</td>
                                                                <td>
                                                                <Autocomplete
                                                                id="combo-box-demo"
                                                                options={x[1]}
                                                                getOptionLabel={(option) => option.excerciseName}
                                                                style={{ backgroundColor:'firebrick',color:'white', width: 300 }}
                                                                renderInput={(params) => <TextField style={{ backgroundColor:'firebrick',color:'white' }}  {...params} label="Wybierz" variant="outlined" />}
                                                                />
                                                                </td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                                <td><input style={{backgroundColor:'black',color:'white'}}></input></td>
                                                            </tr>
                                                        )
                                                    }
                                                    else return null;
                                                })}
                                            </tbody>
                                        </table>
                                    </Grid>
                            </Grid>
                            </div>
                        )
                    }
                }
            </ContextConsumer>
        );
        else
        return(
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

//export default TrainingPlan3days;
export default withStyles(styles, {withTheme: true})(TrainingPlan3days);

