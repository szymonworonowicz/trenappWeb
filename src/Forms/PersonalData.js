import React, {Component} from 'react';
import { Redirect } from "react-router-dom";
import {ContextConsumer} from '../languages/LanguageContext'
import '../Styles/Forms.css';
import '../Styles/PersonalData.css';
import { withStyles } from "@material-ui/core/styles";
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from "@material-ui/lab/Alert";
import Text from '../languages/Text'

import {
    Grid,
    FormLabel,
    RadioGroup,
    Typography
    } from '@material-ui/core';
import {WhiteRadio,CustomSlider} from '../Components/StyledComponents'
import jwt_decode from 'jwt-decode';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/';
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "https://localhost:5001/";

    const styles = theme => ( 
    {
      paper: {
        marginTop: '8px 0px 0px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        
      }, 
      formControl: {
        margin: '10px 0px  10px 0px',
        minWidth: '20%',
        position:'absolute',
        left:'30%',
        backgroundColor:'transparent'
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: '1px'
      },
      submit: {
        margin: '10px 0px 2px 0px',
        backgroundColor: 'firebrick'
        
      },
      formPosition: {
        margin: 'auto',
        display: 'flex',
        width: '33%',
        backgroundColor:'black',
        padding:'0px 20px 20px 20px'
      }, 
      formElements: {
          backgroundColor:'white',
          borderRadius: '5px',
          minWidth:'20%',
          display:'flex',
          
      },
      radio: {
        '&$checked': {
          color: 'white'
        }
      },
      checked: {
          borderColor:'white'
          //backgroundColor:'white'
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
    })

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" backgroundColor='firebrick' {...props}/>;
    }

class PersonalData extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            status: false,
            errorMessage:'',
            details:
            {   
                Gender: "",
                Weight: NaN,
                Height: NaN,
                SportClass: 33,
                Experience: NaN,
                Age: NaN,
                Diet: "",
                Sleep: 50,
                Stress: 50,
                Ssa: false,
                BenchPress: NaN,
                Squat: NaN,
                Deadlift: NaN,
                StartVolume: 50
            }
        };
    }

    componentDidMount = () => {
        console.log(this.props.userId)
        const token = localStorage.getItem('token');
        
        if (token!==null) {

            const config = {
                headers: {
                  "Content-type": "application/json",
                  Accept: "application/json",
                },
              };

            let id;
            if (this.props.location===undefined) {
            id = parseInt(jwt_decode(token).id);
            console.log(id+"ID pobrane")
            this.setState({ //temp
                ...this.state,
                userId: id
            })
            }
            else {
            id = this.props.location.state.AthleteId
            console.log(id+"ID pobrane")
            this.setState({ //temp
                ...this.state,
                userId: id,
                readOnly: true
            })
            }
            
            
            axios.get(`api/auth/gettrainingdata/${id}`, config)
            .then(response=>{
                
                console.log(response.data.data)

                let newDetails = this.state.details;

                newDetails = {
                    Gender: response.data.data.gender.trim(), //trimy są tymczasowo; wyszukiwanie po tablicach z nazwami pewnie też -> w bazie można trzymać wartości
                    Weight: response.data.data.weight,
                    Height: response.data.data.height,
                    SportClass: response.data.data.sportClass.trim(), //sportClassValue.find(e=>e.label===response.data.data.sportClass.trim()).value,
                    Experience: response.data.data.experience,
                    Age: response.data.data.age,
                    Diet: response.data.data.diet.trim(),
                    Sleep: response.data.data.sleep,
                    Stress: response.data.data.stress.trim(),//stressValue.find(e=>e.label===response.data.data.stress.trim()).value,
                    Ssa: response.data.data.ssa,
                    BenchPress: response.data.data.benchPress,
                    Squat: response.data.data.squat,
                    Deadlift: response.data.data.deadlift,
                    StartVolume: response.data.data.startVolume.trim()//startVolumeValue.find(e=>e.label===response.data.data.startVolume.trim()).value
                };

                this.setState({
                ...this.state,//
                userId: id,
                details: newDetails
                })

                
            })
            .catch((error)=>console.log(error))
        }
    }

    onClick = () =>{
        const details = this.state.details;

        //#region wiek
        if( isNaN(details.Age) ){
            this.setState({
                errorMessage:'uzupełnij wiek'
            })
            return;
        }
        if (details.Age <= 0 ){
            this.setState({
                errorMessage:'wiek musi być większy niż zero'
            })
            return;
        }
        //#endregion wiek

        //#region doświadczenie
        if( isNaN(details.Experience) ){
            this.setState({
                errorMessage:'uzupełnij doświadczenie'
            })
            return;
        }
        if( details.Experience <= 0 ){
            this.setState({
                errorMessage:'doświadczenie nie może być ujemne'
            })
            return;
        }
        //#endregion doświadczenie

        //#region waga
        if( isNaN(details.Weight) ){
            this.setState({
                errorMessage:'uzupełnij wagę'
            })
            return;
        }
        if( details.Weight <= 0 ){
            this.setState({
                errorMessage:'waga musi być większa niż zero'
            })
            return;
        }
        //#endregion waga
        
        //#region wzrost
        if( isNaN(details.Height) ){
            this.setState({
                errorMessage:'uzupełnij wzrost'
            })
            return;
        }
        if(details.Height <= 0){
            this.setState({
                errorMessage:'wzrost musi być większy niż zero'
            })
            return;
        }
        //#endregion wzrost

        //#region przysiad
        if( isNaN(details.Squat) ){
            this.setState({
                errorMessage:'uzupełnij przysiad'
            })
            return;
        }
        if(details.Squat <= 0){
            this.setState({
                errorMessage:'przysiad musi być większy niż zero'
            })
            return;
        }
        //#endregion przysiad

        //#region wyciskanie
        if( isNaN(details.BenchPress) ){
            this.setState({
                errorMessage:'uzupełnij wyciskanie'
            })
            return;
        }
        if(details.BenchPress <= 0){
            this.setState({
                errorMessage:'wyciskanie musi być większe niż zero'
            })
            return;
        }
        //#endregion wyciskanie

        //#region martwy ciąg
        if( isNaN(details.Deadlift) ){
            this.setState({
                errorMessage:'uzupełnij martwy ciąg'
            })
            return;
        }
        if(details.Deadlift <= 0){
            this.setState({
                errorMessage:'martwy ciąg musi być większy niż zero'
            })
            return;
        }
        //#endregion martwy ciąg
        
        //#region płeć
        if(details.Gender.length === 0){
            this.setState({
                errorMessage:'musisz wybrać płeć'
            })
            return;
        }
        //#endregion płeć

        //#region SSA
        if(details.Ssa.length === 0){
            this.setState({
                errorMessage:'musisz wybrać SSA'
            })
            return;
        }
        //#endregion SSA
        
        //#region odżywianie
        if(details.Diet.length === 0){
            this.setState({
                errorMessage:'musisz wybrać odżywianie'
            })
            return;
        }
        //#endregion odżywianie
        
        let detailsToSend = this.state.details;
        detailsToSend.Ssa = JSON.parse(detailsToSend.Ssa);

        //console.log(this.props.location.registrationData); -> prawd. nie ma takiego propsa póki co
        console.log('details',detailsToSend);
        
        const {userId} = this.state;//.userId;

        if(userId===null)
            this.registerUser(this.props.location.registrationData,detailsToSend); /////////////////////Wysyłanie////////////////
        else
            this.editPersonalData(userId, detailsToSend);
    }

    async registerUser(registrationData,details){
        await this.props.confirmForm(registrationData,details);

        this.setState({
            status: true
        })
    }

    /*async onPersonalDataChange(userId, details) { //=> Settings => PersonalData
        var body = {
            UserId: userId,
            TrainingData: details//{...details}
        };
        console.log("Wysyłam: "+body)

        const config = {
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
        };
    
        axios.put('api/Auth/editTrainingData', body, config)
        .then(response=>console.log(response))
        .catch(error=>console.log(error))
    
    
      }*/

    async editPersonalData(userId, details) {
        console.log(userId)
        await this.props.editPersonalData(userId, details); //this.onPersonalDataChange(userId, details)

        alert("Zmieniono dane w bazie.");//Snackbar itp.
    }

    handleChangeInput = (e) => {
        const name = e.target.name
        this.setState((prev) =>{
            const prevDetails = prev.details
            prevDetails[name] = parseInt(e.target.value)
            return {
                ...this.state,
                details : prevDetails
            }
        })
    }

    handleChangeRadio = (e) => {
        const name = e.target.name
        console.log(name)
        this.setState((prev) =>{
            const prevDetails = prev.details
            if (name==="Ssa")//
                prevDetails[name] = !prevDetails[name]//e.target.value
            else
            prevDetails[name] = e.target.value
            return {
                ...this.state,
                details : prevDetails
            }
        })
    }

    handleChangeSlider = (e,value,name) =>{
        this.setState((prev) =>{
            const prevDetails = prev.details
            prevDetails[name] = value
            return {
                ...this.state,
                details : prevDetails
            }
        })
    }

    // valueLabelFormat(value) {
    //     return stressValue.findIndex((stressValue) => stressValue.value === value) + 1;
    // }
    
    handleFilterClose = (event,reason) => {
        if (reason === 'clickaway') {
            return;
          }
        this.setState({
            errorMessage:''
        })
    }

    render(){
        const {classes} = this.props
        const {errorMessage, status} = this.state;
        if (status === true)
            return <Redirect to="/login"/>

        const {userId} = this.state;
        console.log(this.state.details)
        return(
            <ContextConsumer>
            {
                language => {
                    const stressValue = [
                        {
                           value: 0,
                           label: language.dictionary.Low 
                        },
                        {
                            value:50,
                            label: language.dictionary.Medium 
                         },
                         {
                            value:100,
                            label: language.dictionary.High 
                         },
                    ];
                    const sleepValue = [
                    {
                        value: 0,
                        label:'< 5h' 
                    },
                    {
                        value:50,
                        label:'5-7h '
                        },
                        {
                        value:100,
                        label:'>7h' 
                        },
                    ];
                    const sportClassValue = [
                        {
                            value:0,
                            label:'III'
                        },
                        {
                            value:33,
                            label:'II'
                        },
                        {
                            value:66,
                            label:'I'
                        },
                        {
                            value:99,
                            label:'M'
                        }
                    ];
                    const startVolumeValue = [
                        {
                            value:0,
                            label: language.dictionary.Low
                        },
                        {
                            value:50,
                            label:language.dictionary.Medium
                        },
                        {
                            value:100,
                            label: language.dictionary.High
                        }
                    ]
                    return(
                        <div className={classes.formPosition} style={{top:`${userId === null ?'10%':'20%'}`}} >
                            <Snackbar className={classes.styledSnackbar} open={errorMessage!==''}
                                      autoHideDuration={3000} onClose={this.handleFilterClose}>
                                <Alert className={classes.styledAlert} onClose={this.handleFilterClose} severity="error">
                                    {errorMessage}
                                </Alert>
                            </Snackbar>
                            <div className={classes.paper}> 
                            {
                                userId === null?
                                <Typography component="h1" variant="h4" style={{color: 'white',marginBottom:'25px'}}>
                                    {language.dictionary.FillInFormBelow}
                                </Typography>:
                                null
                            }
            
                            <form className={classes.form} noValidate>
                                <Grid container spacing={1}  justify='space-between' alignItems='center'>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            variant='filled'
                                            margin="normal"
                                            required
                                            fullWidth
                                            label={language.dictionary.Age}
                                            name="Age"
                                            id="Age"
                                            autoFocus
                                            color='white'
                                            className={classes.formElements}
                                            value={this.state.details.Age}
                                            onChange={(e) => this.handleChangeInput(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            variant='filled'
                                            margin="normal"
                                            required
                                            fullWidth
                                            label={language.dictionary.Experience_years}
                                            name="Experience"
                                            id="Experience"
                                            autoFocus
                                            color='white'
                                            className={classes.formElements}
                                            value={this.state.details.Experience}
                                            onChange={(e) => this.handleChangeInput(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            variant='filled'
                                            margin="normal"
                                            required
                                            fullWidth
                                            label={language.dictionary.Weight + " (kg)"}
                                            name="Weight"
                                            id="Weight"
                                            autoFocus
                                            color='white'
                                            className={classes.formElements}
                                            value={this.state.details.Weight}
                                            onChange={(e) => this.handleChangeInput(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            type="number"
                                            variant='filled'
                                            margin="normal"
                                            required
                                            fullWidth
                                            label={language.dictionary.Height + " (cm)"}
                                            name="Height"
                                            id="Height"
                                            autoFocus
                                            color='white'
                                            className={classes.formElements}
                                            value={this.state.details.Height}
                                            onChange={(e) => this.handleChangeInput(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            variant='filled'
                                            margin="normal"
                                            required
                                            fullWidth
                                            label={language.dictionary.Squat + " (kg)"}
                                            name="Squat"
                                            id="Squat"
                                            autoFocus
                                            color='white'
                                            className={classes.formElements}
                                            value={this.state.details.Squat}
                                            onChange={(e) => this.handleChangeInput(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            variant='filled'
                                            margin="normal"
                                            required
                                            fullWidth
                                            label={language.dictionary.BenchPress + " (kg)"}
                                            name="BenchPress"
                                            id="BenchPress"
                                            autoFocus
                                            color='white'
                                            className={classes.formElements}
                                            value={this.state.details.BenchPress}
                                            onChange={(e) => this.handleChangeInput(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                            type="number"
                                            variant='filled'
                                            margin="normal"
                                            required
                                            fullWidth
                                            label={language.dictionary.Deadlift + " (kg)"}
                                            name="Deadlift"
                                            id="Deadlift"
                                            autoFocus
                                            color='white'
                                            className={classes.formElements}
                                            value={this.state.details.Deadlift}
                                            onChange={(e) => this.handleChangeInput(e)}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                            {language.dictionary.StressLevel}
                                        </Typography>
                                        <CustomSlider
                                            aria-labelledby="discrete-slider-restrict"
                                            step={null}
                                            marks={stressValue}
                                            value={this.state.details.Stress}
                                            onChangeCommitted={(e,val) => this.handleChangeSlider(e,val,"Stress")}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                            {language.dictionary.Sleep}
                                        </Typography>
                                        <CustomSlider
                                            aria-labelledby="discrete-slider-restrict"
                                            step={null}
                                            marks={sleepValue}
                                            value={this.state.details.Sleep}
                                            onChangeCommitted={(e,val) => this.handleChangeSlider(e,val,"Sleep")}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                            {language.dictionary.StartingVolume}
                                        </Typography>
                                        <CustomSlider
                                            aria-labelledby="discrete-slider-restrict"
                                            step={null}
                                            marks={startVolumeValue}
                                            value={this.state.details.StartVolume}
                                            onChangeCommitted={(e,val) => this.handleChangeSlider(e,val,"StartVolume")}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                            {language.dictionary.SportClass}
                                        </Typography>
                                        <CustomSlider
                                            aria-labelledby="discrete-slider-restrict"
                                            step={null}
                                            marks={sportClassValue}
                                            value={this.state.details.SportClass}
                                            onChangeCommitted={(e,val) => this.handleChangeSlider(e,val,"SportClass")}
                                        />
                                    </Grid>
                                    <Grid item xs={6} style={{textAlign:'center'}}>
                                        <FormControl>
                                            <FormLabel component="legend" style={{color:'white'}}>{language.dictionary.Gender}</FormLabel>
                                            <RadioGroup aria-label="Gender" name="Gender" column value={this.state.details.Gender}  onChange={(e) => this.handleChangeRadio(e)} >
                                                <FormControlLabel value="K" control={<WhiteRadio/>} label={language.dictionary.Woman} style={{color:'white'}} />
                                                <FormControlLabel value="M" control={<WhiteRadio/>} label={language.dictionary.Man}   style={{color:'white'}} />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} style={{textAlign:'center'}}>
                                        <FormControl>
                                            <FormLabel component="legend" style={{color:'white'}}>SSA</FormLabel>
                                            <RadioGroup aria-label="SSA" name="Ssa" column value={this.state.details.Ssa}  onChange={(e) => this.handleChangeRadio(e)} >
                                                <FormControlLabel value={true}  control={<WhiteRadio/>} label={language.dictionary.Yes} style={{color:'white'}} />
                                                <FormControlLabel value={false} control={<WhiteRadio/>} label={language.dictionary.No}  style={{color:'white'}} />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} style={{textAlign:'center'}}>
                                        <FormControl>
                                            <FormLabel component="legend" style={{color:'white', textAlign:'center'}}>{language.dictionary.Nutrition}</FormLabel>
                                            <RadioGroup aria-label="Diet" name="Diet" row value={this.state.details.Diet} onChange={(e) => this.handleChangeRadio(e)} >
                                                <FormControlLabel value="Niedostateczne" control={<WhiteRadio/>} label={language.dictionary.Insufficient} style={{color:'white'}} />
                                                <FormControlLabel value="Podstawowe" control={<WhiteRadio/>} label={language.dictionary.Basic} style={{color:'white'}} />
                                                <FormControlLabel value="Pełne" control={<WhiteRadio/>} label={language.dictionary.Full}  style={{color:'white'}} />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                    onClick={this.onClick}
                                >
                                    {
                                        userId === null? language.dictionary.Register: language.dictionary.Edit
                                    }
                                </Button>
                            </form>
                        </div>
                        </div>
                    );
                }
            }
            </ContextConsumer>
        )
    }
}

export default withStyles(styles,{withTheme:true}) (PersonalData);