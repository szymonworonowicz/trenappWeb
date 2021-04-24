import {useContext, useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core'
import {LanguageContext} from '../languages/LanguageContext'
import {Link} from 'react-router-dom'
import axios from 'axios';

import jwt_decode from 'jwt-decode';
// import { withStyles } from "@material-ui/core/styles";
import {
    Grid,
    Button, 
    Avatar,
    Typography} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    formPosition: {
        position: 'absolute',
        width: '10%',
        height: '90%',
        bottom:'0%',
        top: 45,
        borderTop: '1px solid black',
        backgroundColor:'rgb(32, 32, 31);',
        padding:'0px 20px 20px 20px',
      },  
      submit: {
        margin: '10px 0px 2px 0px',
        backgroundColor: 'firebrick',
        "&:focus": {
            color: "red"
          }
      },
      root:{
            
      },    
      large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        left:'30%',
        marginTop:'10px'
      },
}))

const Navbar = () => {
//Funkcyjny

    const [avatar, setAvatar] = useState('../Assets/person.png')

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get('http://localhost:5000/api/Auth/getPhoto/' +
                                            jwt_decode(localStorage.getItem('token')).id);
            setAvatar(result.data);
        };
        if(localStorage.getItem('token')) 
            fetchData()
    });

    const context = useContext(LanguageContext)
    const classes = useStyles()

    var token = localStorage.getItem('token')
    if(token === null) {
        return (
            <div className={classes.root}></div>
        )
    }
    const decode = jwt_decode(token);
    const {role ,name , surname} = decode

    return (
        <div className={classes.formPosition} >
            {
                role === 'none'?
                <div></div>:
                role === 'user'?
                    <Grid container spacing={2} justify='center' alignItems='center' className={classes.root}>
                        <Grid item xs={12}>
                            <Avatar src={avatar} className={classes.large} ></Avatar>
                           
                        </Grid>
                        <Grid item xs={12}>
                            <p  style={{color:'white',padding:'0px',marginTop:'5px',top:'50%'}} >
                                {(name ==='' || name === undefined?context.dictionary.Name:name) + ' ' +(surname==='' || surname === undefined?context.dictionary.Surname:surname)}{}
                            </p>
                        </Grid>
                        <Grid item xs={12}>
                            <Link to="/trainingplan/3days/user">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                >
                                    {context.dictionary.TrainingPlan}
                                </Button>
                            </Link>                            
                        </Grid>
                        <Grid item xs={12}>
                            <Link to="/notifications">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    className={classes.submit}
                                    color="secondary"
                                >
                                    {context.dictionary.Notifications}
                                </Button>
                            </Link>                      
                        </Grid>
                        <Grid item xs={12}>
                            <Link to="/Settings">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}

                                >
                                    {context.dictionary.Settings}
                                </Button>
                            </Link>                            
                        </Grid>
                        <Grid item xs={12}>
                            <Link to="/trainingplan/3days/user">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                >
                                    {context.dictionary.Progress}
                                </Button>
                            </Link>                       
                        </Grid>
                        <Grid item xs={12}>
                            <Link to="/trainingplan/3days/user">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                >
                                    {context.dictionary.Polls}
                                </Button>
                            </Link>                            
                        </Grid>

                        <Grid item xs={12}>
                            <Link to="/passwordchange">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    className={classes.submit}
                                >
                                    {context.dictionary.ResetPassword}
                                </Button>
                            </Link>                         
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={2} justify='center' alignItems='center' className={classes.root}>
                    <Grid item xs={12}>
                        <Avatar src={avatar} className={classes.large} ></Avatar>
                       
                    </Grid>
                    <Grid item xs={12} >
                        <p  style={{color:'white',padding:'0px',marginTop:'5px'}} >
                            {(name ==='' || name === undefined?context.dictionary.Name:name) + ' ' +(surname==='' || surname === undefined?context.dictionary.Surname:surname)}{}
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <Link to="/pupils">
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                            >
                                {context.dictionary.Proteges}
                            </Button>
                        </Link>                          
                    </Grid>
                    <Grid item xs={12}>
                        <Link to="/notifications">
                            <Button
                                fullWidth
                                variant="contained"
                                className={classes.submit}
                                color="secondary"
                            >
                                {context.dictionary.Notifications}
                            </Button>
                        </Link>                        
                    </Grid>
                    <Grid item xs={12}>
                        <Link to="/SettingsTrainer">
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}

                            >
                                {context.dictionary.Settings}
                            </Button>
                        </Link>                          
                    </Grid>
                    <Grid item xs={12}>
                        <Link to="/excerciseList">
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                            >
                                {context.dictionary.ExcerciseDataBase}
                            </Button>
                        </Link>                       
                    </Grid>

                    <Grid item xs={12}>
                        <Link to="/passwordchange">
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                            >
                                {context.dictionary.ResetPassword}
                            </Button>
                        </Link>                        
                    </Grid>
                </Grid>
            }
        </div>
    )
}

export default Navbar;