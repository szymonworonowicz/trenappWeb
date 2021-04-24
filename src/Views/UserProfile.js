import React, { useState, useEffect, useContext} from 'react'
import {useLocation} from 'react-router-dom'
import {LanguageContext} from '../languages/LanguageContext'
import axios from "axios"
import { makeStyles } from "@material-ui/core/styles"
import { CustomSlider } from '../Components/StyledComponents'
import { Grid, TextField, Avatar, Typography } from '@material-ui/core'

const styles = makeStyles ((theme) => ({
    paper: {
        marginTop: '8px 0px 0px 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
    },
    section: {
        width: '100%',
        marginTop: '1px'
    },
    submit: {
        margin: '10px 0px 2px 0px',
        backgroundColor: 'firebrick'
    },
    viewPosition: {
        margin: 'auto',
        display: 'flex',
        width: '30%',
        backgroundColor:'black',
        padding:'0px 20px 20px 20px'
    }, 
    formElements: {
        backgroundColor:'white',
        borderRadius: '5px',
        minWidth:'20%',
        display:'flex',
    },
    container: {
        display:'flex',
        position:'relative',
        marginBottom:'12vh',
        marginLeft:'2vw'
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        left:'35%',
        marginTop:'10px',
        position:'absolute',
    },
    slider: {
        '&.MuiSlider-root.Mui-disabled': {
            color: 'firebrick'
        },
        '& .MuiSlider-thumb.Mui-disabled': {
            width: 20,
            height: 20,
            marginTop: -9,
            marginLeft: -11,
        },
    },
    formControlLabel: {
        '& .MuiFormControlLabel-label.Mui-disabled': {
            color: 'white'
        }
    }
}))

const stressValue = [
    {
       value: 0,
       label:'Niski' 
    },
    {
        value:50,
        label:'Średni' 
     },
     {
        value:100,
        label:'Wysoki' 
     },
]
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
]
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
]
const startVolumeValue = [
    {
        value:0,
        label:'Niska'
    },
    {
        value:50,
        label:'Średnia'
    },
    {
        value:100,
        label:'Wysoka'
    }
]

const UserProfile = () =>{
    const context = useContext(LanguageContext)
    const location = useLocation()
    const [basicData,setBasicData] = useState({});
    const [personalData,setPersonalData] = useState({});
    const classes = styles()

    useEffect(() => {
        const id = location.state.AthleteId
        const config = {
            headers: {
                'Content-type': 'application/json',
                Accept: 'application/json'
            }
        }
        const fetchBasicData = async () => {
            await axios.get('api/auth/getBasicData/'+id,config)
            .then( response => {
                setBasicData(response.data)
            })
            .catch(error=>console.log(error));
        }
        const fetchPersonalData = async () =>{
            axios.get('api/auth/gettrainingdata/'+id, config)
            .then(response=>{
                const personalData = {
                    Gender: response.data.data.gender.trim(),
                    Weight: response.data.data.weight,
                    Height: response.data.data.height,
                    SportClass: response.data.data.sportClass.trim(),
                    Experience: response.data.data.experience,
                    Age: response.data.data.age,
                    Diet: response.data.data.diet.trim(),
                    Sleep: response.data.data.sleep,
                    Stress: response.data.data.stress.trim(),
                    Ssa: response.data.data.ssa,
                    BenchPress: response.data.data.benchPress,
                    Squat: response.data.data.squat,
                    Deadlift: response.data.data.deadlift,
                    StartVolume: response.data.data.startVolume.trim()
                }
                console.log(personalData)
                setPersonalData(personalData)               
            })
            .catch((error)=>console.log(error))
        }
        fetchBasicData();
        fetchPersonalData();
    }, []);

    return(
        <div className={classes.viewPosition}>
            <div className={classes.paper}>
                <div className={classes.section}>
                    <Grid container spacing={0} justify='center' alignItems='center' >
                        <Grid item xs={12} >
                            <div className={classes.container}>
                                <Avatar src={basicData?.photo||"../Assets/person.png"} className={classes.large}/>
                            </div> 
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant='filled'
                            margin="normal"
                            fullWidth
                            value={basicData?.firstName||""}
                            label={context.dictionary.Name}
                            className={classes.formElements}
                            InputProps={{readOnly: true}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant='filled'
                            margin="normal"
                            fullWidth
                            value={basicData?.lastName||""}
                            label={context.dictionary.Surname}
                            className={classes.formElements}
                            InputProps={{readOnly: true}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant='filled'
                            margin="normal"
                            fullWidth
                            value={basicData?.email||""}
                            label="Email"
                            className={classes.formElements}
                            InputProps={{readOnly: true}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                        variant='filled'
                        margin="normal"
                        fullWidth
                        value={basicData?.name||""}
                        label={context.dictionary.UserName}
                        className={classes.formElements}
                        InputProps={{readOnly: true}}
                        />
                    </Grid>
                </div>
                <div className={classes.section}>
                    <Grid container spacing={1}  justify='space-between' alignItems='center'>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Age||""}
                                label={"wiek"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Experience||""}
                                label={"doświadczenie (lat)"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Weight||""}
                                label={"waga"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                type="number"
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Height||""}
                                label={"wzrost(cm)"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                type="number"
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Squat||""}
                                label={"Przysiad (kg)"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                type="number"
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.BenchPress||""}
                                label={"Wyciskanie (kg)"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                type="number"
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Deadlift||""}
                                label={"Martwy ciąg (kg)"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                Poziom Stresu
                            </Typography>
                            <CustomSlider
                                className={classes.slider}
                                aria-labelledby="discrete-slider-restrict"
                                step={null}
                                marks={stressValue}
                                value={parseInt(personalData.Stress)}
                                disabled
                                />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                Sen
                            </Typography>
                            <CustomSlider
                                className={classes.slider}
                                aria-labelledby="discrete-slider-restrict"
                                step={null}
                                marks={sleepValue}
                                value={parseInt(personalData.Sleep)}
                                disabled
                                />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                Objętość Startowa
                            </Typography>
                            <CustomSlider
                                className={classes.slider}
                                aria-labelledby="discrete-slider-restrict"
                                step={null}
                                marks={startVolumeValue}
                                value={parseInt(personalData.StartVolume)}
                                disabled
                                />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography id="discrete-slider-restrict" gutterBottom style={{color:'white'}}>
                                Klasa Sportowa
                            </Typography>
                            <CustomSlider
                                className={classes.slider}
                                aria-labelledby="discrete-slider-restrict"
                                step={null}
                                marks={sportClassValue}
                                value={parseInt(personalData.SportClass)}
                                disabled
                                />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Gender?personalData.Gender==="M"?"Mężczyzna":"Kobieta":""}
                                label={"płeć"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData.Ssa!=null?personalData.Ssa?"Tak":"Nie":""}
                                label={"Ssa"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='filled'
                                margin="normal"
                                fullWidth
                                value={personalData?.Diet||""}
                                label={"Odżywianie"}
                                className={classes.formElements}
                                InputProps={{readOnly: true}}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}
   
export default UserProfile;