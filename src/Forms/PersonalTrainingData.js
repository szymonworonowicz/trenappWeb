import React, { Component, createRef } from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import { Redirect, Link } from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles'
import '../Styles/Forms.css';
import '../Styles/PersonalData.css';
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from '@material-ui/core/Snackbar';
import {
    Grid,
    TextField,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel ,
    Typography,
    Tooltip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@material-ui/core';
import {WhiteRadio} from '../Components/StyledComponents'

import jwtDecode from 'jwt-decode';

const StyledFormLabel = withStyles({     
    label:
    {
      color:"white"
    }
      
})(FormControlLabel);
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: 'firebrick',
        color: 'white',
        border: '1px solid black'
    },
    body: {
        fontSize: 14,
        color:'white',
        backgroundColor:'rgb(32, 32, 31);',
        border: '1px solid black'
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const StyledPaper = withStyles((theme) => ({
      root: {
          backgroundColor:'black'
      }
  }))(Paper)

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

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" backgroundColor='#4caf50' {...props}/>;
  }
class PersonalTrainingData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logged: false,
            status: false,
            readOnly: false,
            data:{
                personalTrainingDataId: -1,
                injuries: "",
                anthropometry: "",
                stickingPointSquat: "",
                stickingPointBenchpress: "",
                stickingPointDeadLift: "",
                trainer:"",
                braverman: {}
            },
            listOfTrainers:[]
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    loadTrainers=()=>
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
        axios.get('api/trainingplan/trainers',config)
        .then( x => {
            // set new token to refresh expire time
            localStorage.setItem('token',x.headers['newtoken'])
            console.log(x.data);
            this.setState(()=>{return {listOfTrainers:x.data.trainers};})
        })
        .catch(error=>console.log(error));
    }
    sendForm=async ()=>{
        const config = {
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json',
                withCredentials: true,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Expose-Headers': '*'
            }
        }
       // let json = JSON.parse(this.state.data);
       // console.log("json",json);
        let data = this.state.data;
        let dto = 
        {
            "UserId": jwtDecode(localStorage.getItem('token')).id,
            "data": {
                "injuries": data.injuries,
                "bravermanId": data.bravermanId,
                "anthropometry": data.anthropometry,
                "stickingPointSquat": data.stickingPointSquat,
                "stickingPointBenchpress": data.stickingPointBenchpress,
                "stickingPointDeadLift": data.stickingPointDeadLift,
                "trainerId": data.trainerId,
            }
        }
        let str = JSON.stringify(dto);
        console.log("dto",dto);
        console.log("str",str);
        await axios.post('api/auth/editpersonalTrainingData/',dto,config)
        .then( x => {
            localStorage.setItem('token',x.headers['newtoken'])
            console.log("udalo sie wyslac dane");
            this.setState(prevstate=>
                {
                    let state = prevstate;
                    state.successmsg="wysłano nowe dane";
                    return {state};
                });
            //console.log('getpersonalTrainingData',x.data.data);
            //this.setState(()=>{return {data:x.data.data};})
        })
        .catch(
            (error)=>
            {
                this.setState(prevstate=>
                {
                    //console.log("i am in setstate error");
                    let state = prevstate;
                    state.errormsg="błąd";
                    return {state};
                });
                console.log(error);
                
            }
            
        
        );
    
    }
    
    loadData=()=>
    {
      
        
       
        //json = JSON.stringify(json);
        
        const config = {
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json',
                withCredentials: true,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Expose-Headers': '*'
            }
        }
        let encrypted = localStorage.getItem('token');
        let token = jwtDecode(encrypted);
        console.log("token - userid");
        console.log(token);
        let json = Number(token.id);
        axios.post('api/auth/getpersonalTrainingData/',json,config)
        .then( x => {
            localStorage.setItem('token',x.headers['newtoken'])
            console.log('getpersonalTrainingData',x.data.data);
            this.setState(()=>{return {data:x.data.data};})
        })
        .catch(error=>console.log(error));
    }

    componentDidMount = () =>{
        var token = localStorage.getItem('token');
        var logged = false;
        if(token != null)
        logged = true;
        this.setState({
            logged: logged
        });
    this.loadData();
    }

    handleChange(event) {
        this.setState((prevState)=>{
            let newdata = prevState.data;
            newdata[event.target.id]=event.target.value;
            return {data: newdata};
        });
    }
    handleSubmit(event) {
        if(this.state.data.stickingPointSquat==="")
        return;
        if(this.state.data.stickingPointBenchpress==="")
        return;
        if(this.state.data.stickingPointDeadLift==="")
        return;
        this.sendForm();
        /*this.setState({
            status: true
        })*/

        //console.log(this.state);
    }
    mychangeRadioPrzysiad=(value,event)=>{
        this.setState(async (state)=>{
            let prevstate = state;
            prevstate.data.stickingPointSquat=value;
            console.log(prevstate);
            return await {prevstate};
        });
        console.log("saving",this.state.data);
        //this.sendForm();
    }
    mychangeRadioWyciskanie=(value,event)=>{
        this.setState(async (state)=>{
            let prevstate = state;
            prevstate.data.stickingPointBenchpress=value;
            console.log(prevstate);
            return await {prevstate};
        });
        console.log("saving",this.state.data);
        //this.sendForm();
    }
    mychangeRadioMartwyCiag=(value,event)=>{
        this.setState(async (state)=>{
            let prevstate = state;
            prevstate.data.stickingPointDeadLift=value;
            console.log(prevstate);
            return await {prevstate};
        });
        console.log("saving",this.state.data);
        //this.sendForm();
    }
    //TODO dodac pobieranie bravermana z bazy danych i uzupelnienie elementami
    handleFilterClose = (event,reason) => {
     
          this.setState(prevstate=>
            {
                let state = prevstate;
                state.successmsg="";
                state.errormsg="";
                return {state};
            });
    }
    render() {
        //let personaldata = null;
        //if(this.state.personaldata!=undefined)
          let  personaldata = this.state?.data;
//            else personaldata = null;
        const { status, data} = this.state;
        //const {stickingPointSquat,stickingPointDeadLift,stickingPointBenchpress} = data
        const {classes} = this.props
        
        const successMessage = this.state?.successmsg||"";
        const errorMessage = this.state?.errormsg||"";

        if (status === true)
            return <Redirect to="/" />
        if(this.state.logged && this.state.role!=="user")
        return (
            <ContextConsumer>
                {
                    language => {
                        return (
                            <div className={classes.formPosition}>
                                <form >
                                    <Grid spacing={2} container alignItems='center' justify='center' >
                                        <Grid item xs={12} >
                                            <Tooltip title={language.dictionary.MostImportantInjuries}>
                                                <TextField 
                                                    variant='filled'
                                                    margin="normal"
                                                    label={language.dictionary.Injuries}
                                                    id='injuries'
                                                    value={personaldata?.injuries}
                                                    required
                                                    fullWidth
                                                    autoFocus
                                                    disabled={this.state.readOnly}
                                                    multiline
                                                    className={classes.formElements}
                                                    onChange = {(e) => this.handleChange(e)}>
                                                        
                                                </TextField>
                                            </Tooltip>
                                        
                                        </Grid>
                                        <Grid item xs={12} >
                                                                                 {/* Nie wiem jak to przetłumaczyć xD */}
                                            <Tooltip title="Proporcje ciała, długości kończyn">
                                                <TextField 
                                                    variant='filled'
                                                    margin="normal"
                                                    label={language.dictionary.Anthropometry}
                                                    id='anthropometry'
                                                    value={personaldata?.anthropometry}
                                                    required
                                                    fullWidth
                                                    autoFocus
                                                    disabled={this.state.readOnly}
                                                    multiline
                                                    className={classes.formElements}
                                                    onChange = {(e) => this.handleChange(e)}>
                                                </TextField>
                                            </Tooltip>
                                            
                                        </Grid>
                                        <Grid item xs ={12} >
                                            <Typography component='h6' variant='h5' >
                                                {language.dictionary.Weaknesses}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} >
                                        <FormControl disabled={this.state.readOnly} >
                                            <FormLabel component="legend" style={{color:'white'}}>{language.dictionary.Squad}</FormLabel>
                                                <RadioGroup aria-label={language.dictionary.Squad} name="przysiad"  onChange={this.handleChange}>
                                                    <FormControlLabel value="na dole" onChange={(value)=>this.mychangeRadioPrzysiad("na dole",value)} checked={personaldata?.stickingPointSquat =="na dole"?true:false} control={<WhiteRadio />} label={language.dictionary.onTheBottom} style={{color:'white'}} />
                                                    <FormControlLabel value="w srodku" onChange={(value)=>this.mychangeRadioPrzysiad("w srodku",value)} checked={personaldata?.stickingPointSquat =="w srodku"?true:false} control={<WhiteRadio />} label={language.dictionary.inTheMiddle} style={{color:'white'}}/>
                                                    <FormControlLabel value="na gorze" onChange={(value)=>this.mychangeRadioPrzysiad("na gorze",value)} checked ={personaldata?.stickingPointSquat =="na gorze"?true:false} control={<WhiteRadio />} label={language.dictionary.onTop} style={{color:'white'}} />
                                                    <FormControlLabel value="gorny grzbiet" onChange={(value)=>this.mychangeRadioPrzysiad("gorny grzbiet",value)} checked ={personaldata?.stickingPointSquat =="gorny grzbiet"?true:false} control={<WhiteRadio />} label={language.dictionary.upperRidge} style={{color:'white'}} />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid> 
                                        <Grid item xs={4} >
                                        <FormControl disabled={this.state.readOnly} >
                                            <FormLabel component="legend" style={{color:'white'}}>{language.dictionary.BenchPress}</FormLabel>
                                                <RadioGroup aria-label={language.dictionary.BenchPress} name="wyciskanie" column onChange={this.handleChange}>
                                                    <FormControlLabel value="Na dole" 
                                                    onChange={(value)=>this.mychangeRadioWyciskanie("na dole",value)}
                                                    checked={personaldata?.stickingPointBenchpress =="na dole"?true:false} 
                                                    control={<WhiteRadio />} label={language.dictionary.onTheBottom} style={{color:'white'}}/>
                                                    <FormControlLabel 
                                                    onChange={(value)=>this.mychangeRadioWyciskanie("w srodku",value)} 
                                                    checked={personaldata?.stickingPointBenchpress =="w srodku"?true:false}
                                                    value="w srodku" control={<WhiteRadio />} label={language.dictionary.inTheMiddle} style={{color:'white'}} />
                                                    <FormControlLabel
                                                    onChange={(value)=>this.mychangeRadioWyciskanie("na gorze",value)} 
                                                    checked={personaldata?.stickingPointBenchpress =="na gorze"?true:false}
                                                    value="na gorze" control={<WhiteRadio />} label={language.dictionary.onTop} style={{color:'white'}}/>
                                                    <FormControlLabel 
                                                    onChange={(value)=>this.mychangeRadioWyciskanie("gorny grzbiet",value)} 
                                                    checked={personaldata?.stickingPointBenchpress =="gorny grzbiet"?true:false}
                                                    value="gorny grzbiet" control={<WhiteRadio />} label={language.dictionary.upperRidge} style={{color:'white'}} />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid> 
                                        <Grid item xs={4} >
                                        <FormControl disabled={this.state.readOnly}>
                                            <FormLabel component="legend" style={{color:'white'}}>{language.dictionary.Deadlift}</FormLabel>
                                                <RadioGroup aria-label={language.dictionary.Deadlift} name="MartwyCiag" column  onChange={this.handleChange}>
                                                    <FormControlLabel 
                                                    onChange={(value)=>this.mychangeRadioMartwyCiag("na dole",value)} 
                                                    checked={personaldata?.stickingPointDeadLift =="na dole"?true:false}
                                                    value="na dole" control={<WhiteRadio />} label={language.dictionary.onTheBottom} style={{color:'white'}}/>
                                                    <FormControlLabel 
                                                    onChange={(value)=>this.mychangeRadioMartwyCiag("pod kolanem",value)} 
                                                    checked={personaldata?.stickingPointDeadLift =="pod kolanem"?true:false}
                                                    value="pod kolanem" control={<WhiteRadio />} label={language.dictionary.underTheKnee} style={{color:'white'}}/>
                                                    <FormControlLabel 
                                                    onChange={(value)=>this.mychangeRadioMartwyCiag("za kolanem",value)} 
                                                    checked={personaldata?.stickingPointDeadLift =="za kolanem"?true:false}
                                                    value="za kolanem" control={<WhiteRadio />} label={language.dictionary.behindTheKnee} style={{color:'white'}}/>
                                                    <FormControlLabel 
                                                    onChange={(value)=>this.mychangeRadioMartwyCiag("chwyt",value)} 
                                                    checked={personaldata?.stickingPointDeadLift =="chwyt"?true:false}                                                    
                                                    value="chwyt"  control={<WhiteRadio />} label={language.dictionary.grip} style={{color:'white'}}/>
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography component ='h5' variant='h5' align='inherit' >
                                                {language.dictionary.BravermannTest}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align='right' >
                                                <Link to={{
                                                    pathname: '/bravermantest',
                                                    state: {
                                                        PersonalTrainingDataId: data && data.personalTrainingDataId ? data.personalTrainingDataId : -1
                                                    }}}
                                                >
                                                    <Button 
                                                        fullWidth
                                                        variant="contained"
                                                        color="secondary"
                                                        disabled={this.state.readOnly}
                                                        className={classes.submit}>
                                                            {language.dictionary.CompleteTheTest}
                                                    </Button>
                                                </Link>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <TableContainer component={StyledPaper}  >
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell align='center'>{language.dictionary.Serotonin}</StyledTableCell>
                                                            <StyledTableCell align='center'>{language.dictionary.Acetylcholine}</StyledTableCell>
                                                            <StyledTableCell align='center'>{language.dictionary.Dopamine}</StyledTableCell>
                                                            <StyledTableCell align='center'>GABA</StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <StyledTableRow>
                                                            <StyledTableCell align='center'>{data && data.braverman ? (data.braverman.serotonin1 + data.braverman.serotonin2) : 0}</StyledTableCell>
                                                            <StyledTableCell align='center'>{data && data.braverman ? (data.braverman.acetylocholine1 + data.braverman.acetylocholine2) : 0}</StyledTableCell>
                                                            <StyledTableCell align='center'>{data && data.braverman ? (data.braverman.dopamine1 + data.braverman.dopamine2) : 0}</StyledTableCell>
                                                            <StyledTableCell align='center'>{data && data.braverman ? (data.braverman.gaba1 + data.braverman.gaba2) : 0}</StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    
                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="secondary"
                                                className={classes.submit}
                                                disabled={this.state.readOnly}
                                                onClick={(e) => this.handleSubmit()}
                                                >
                                                {language.dictionary.Edit}
                                            </Button>
                                        </Grid> 
                                    </Grid>


                                    {/* <p className="PersonalData-p">
                                        <label className="PersonalData-label">Wybierz trenera: </label>
                                        <select className="PersonalData-select" onChange={this.handleChange} id="trainer">
                                            {this.state.listOfTrainers.map
                                                ((value,key)=>
                                                {
                                                    return <option value={value.id} key={key}>{value.name}{" "}{value.lastName}</option>
                                                })
                                            }
                                        </select>
                                    </p> */}

                                </form>
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

export default withStyles(styles, {withTheme:true})(PersonalTrainingData);
