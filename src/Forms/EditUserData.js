import React,{Component} from 'react'
import {ContextConsumer} from '../languages/LanguageContext'
import {Redirect} from 'react-router-dom'
import '../Styles/Forms.css';
import { withStyles } from "@material-ui/core/styles";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import AvatarForm from './AvatarForm';
import jwtDecode from 'jwt-decode';
import axios from "axios";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Fab,
  Avatar,
  Grid
} from '@material-ui/core';

const styles = theme => ({
    paper: {
      marginTop: theme.spacing(0),
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
    },
    large: {
      width: theme.spacing(15),
      height: theme.spacing(15),
      left:'35%',
      marginTop:'10px',
      position:'absolute',
    },
    container: {
      display:'flex',
      position:'relative',
      marginBottom:'20vh',
      marginLeft:'2vw'
    },
    toggler:{
      position:'absolute',
      left:'30%',
      opacity:'0.8'
    }

  });

class EditUserData extends  Component {

    constructor(props) {
        super(props);
        this.state = {
            //TODO dodac state
            login:"",
            password:"",
            repeatedPassword: "",
            areDetailsVisible:false,
            errorMessage:'',
            src:'',
            image:null,
            openModal : false,
            readOnly: false,//,
            logged:false
        };
    }

    onChange = (e) =>{

        this.setState((prevstate)=>{
          let state = prevstate;  
          
          state.data[e.target.id] = e.target.value;
          return {state};
        })

    }
    
    handleUploadClick = (e) => {
      var file = e.target.files[0]
      let reader = new FileReader()
      reader.onloadend = () => {
        this.setState({
          image: reader.result,
          openModal:true
        })
      }
      reader.readAsDataURL(file)
    }
    loadData=()=>{
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
      if(encrypted === null || undefined)
      {
        this.setState({
          logged:true
        })
      }
      let token = jwtDecode(encrypted);
      
      axios.get('api/auth/getBasicData/'+token.id,config)
      .then( x => {
          // set new token to refresh expire time
         // localStorage.setItem('token',x.headers['newtoken'])
          console.log('getpersonalTrainingData',x.data);
          this.setState((prevstate)=>
          {
            let state = prevstate;
            state.data = x.data;
            return {state};
          })
      })
      .catch(error=>console.log(error));
  }
  componentDidMount() {
    this.loadData();
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
        "Id": jwtDecode(localStorage.getItem('token')).id,
        "FirstName":data.firstName,
        "LastName":data.lastName,
        "Email":data.email
    }
    let str = JSON.stringify(dto);
    
    await axios.put('api/auth/editBasicData/',dto,config)
    .then( x => {
        console.log("udalo sie wyslac dane");
        this.setState(prevstate=>
            {
                let state = prevstate;
                state.successmsg="wysłano nowe dane";
                return {state};
            });
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

    closeModal = (photo = null) => {
      if(photo!==null) {
        this.setState({
          openModal:false,
          image:photo
        })
      } 
      else {
        this.setState({
          openModal:false
        })
      }

    }
    sendClick=()=>
    {
      this.sendForm();
    }
    render () {
      
        const {classes} = this.props
        const {image,openModal, logged} = this.state;
        const userData = this.state?.data;
        console.log(image)
        if(logged === true) {
          return (
            <Redirect to="/login" />
          )
        }
        return (
          <ContextConsumer>
            {
              language => {
                return (
                  <div className={classes.formPosition}>
                  <Dialog
                    open={openModal}
                    maxWidth="sm"
                    fullWidth={true}
                    onBackdropClick={this.closeModal}
                    onEscapeKeyDown={this.closeModal}
                  >
                  <DialogContent>
                    <AvatarForm
                      closeModalFn={this.closeModal}
                      image = {image}
                    />
                  </DialogContent>
                </Dialog>

            <div className={classes.paper}>
          
              <form className={classes.form} noValidate>
                <Grid container spacing={0} justify='center' alignItems='center' >
                    <Grid item xs={12} >
                      <div className={classes.container}>
                        <Avatar src={/*image === null && openModal===false ?"../Assets/person.png":image*/userData?.photo||"../Assets/person.png"} className={classes.large} ></Avatar>
                        <div className={classes.toggler}>
                          <input
                              accept="image/*"
                              className={classes.input}
                              id="contained-button-file"
                              type="file"
                              onChange={this.handleUploadClick}
                              hidden
                              value ={openModal === false?'':''}
                            />
                          
                          <label htmlFor="contained-button-file">
                            <Fab component="span" className={classes.button}>
                              <AddPhotoAlternateIcon />
                            </Fab>
                          </label>
                        </div>
                        
                      </div>
                          
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='filled'
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    value={userData?.firstName||""}
                    label={language.dictionary.Name}
                    autoFocus
                    disabled={this.state.readOnly}
                    className={classes.formElements}
                    onChange = {(e) => this.onChange(e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='filled'
                    margin="normal"
                    required
                    fullWidth
                    id="surname"
                    value={userData?.lastName||""}
                    label={language.dictionary.Surname}
                    autoFocus
                    disabled={this.state.readOnly}
                    className={classes.formElements}
                    onChange = {(e) => this.onChange(e)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant='filled'
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    value={userData?.email||""}
                    label="Email"
                    autoFocus
                    disabled={this.state.readOnly}
                    className={classes.formElements}
                    onChange = {(e) => this.onChange(e)}
                  />
                </Grid>
                 <Grid item xs={12}>
                    <TextField
                      variant='filled'
                      margin="normal"
                      required
                      fullWidth
                      id="login"
                      value={userData?.name||""}
                      label={language.dictionary.UserName}
                      autoFocus
                      disabled
                      className={classes.formElements}
                      onChange = {(e) => this.onChange(e)}
                    />
                 </Grid>
                  <Grid>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    disabled={this.state.readOnly}
                    className={classes.submit}
                    onClick={(e) => this.sendClick()}
                  >
                    {language.dictionary.Edit}
                  </Button>
                </Grid>
              </form>
            </div>
        </div>
                )
              }
            }
          </ContextConsumer>
        )
    }
}

export default withStyles(styles,{withTheme:true})(EditUserData);