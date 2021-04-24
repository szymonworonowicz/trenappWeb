import React, { Component } from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import '../Styles/Forms.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {exportComponentAsPDF} from 'react-component-export-image';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import RpeForm from './RpeForm'
import {
    Stepper,
    Step,
    StepButton,
    Button,
    Grid,
    StepLabel,
    Dialog,
    DialogTitle,
    DialogContent
} from '@material-ui/core';

import { withStyles } from "@material-ui/core/styles";

axios.defaults.baseURL = 'http://localhost:5000/';

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
    stepperRoot:{
        backgroundColor:'black',
        color:'white',
        "& $completed": {
            color: "firebrick"
        },
        "& $active": {
            color: "firebrick"
        },
        "& $disabled": {
            color: "blue"
        }
    },
    step: {
        color:'gray',
        "& $completed": {
            color: "white"
        },
        "& $active": {
            color: "firebrick"
        },
        "& $disabled": {
            color: "blue"
        }
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

class TrainingPlan3days extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plan: [],
            selectedWeek: -1,
            logged: false,
            role: "",
            id: 0,
            openModal:false,
            modalInitValue:[]
        }
        this.componentRef = React.createRef();
    }

    async componentDidMount (){
        let token = localStorage.getItem('token');
        const {idFromProps} = this.props
        if (token!==null)
        {
            this.setState({
                logged: true,
                role: jwt_decode(token).role,
                id: idFromProps ?? jwt_decode(token).id
            })
            await this.fetchData();
        }
    }

    async fetchData ()
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

        await axios.post('api/trainingplan/getplan', 13, config)
        .then ((response) => {
            if(response.headers['newtoken'] !== undefined) {
                localStorage.setItem('token',response.headers['newtoken']);
            }
            let plan = response.data.plan;
            this.setState({
                plan: plan,
                selectedWeek: plan.length-1,
            })
        })
        .catch((error) => {
            console.log("error",error);
        });        
    }

    changeWeek = (e) =>{
        this.setState({
            selectedWeek: e.target.value-1
        })
    }

    getStepps = () => {
        let steps = []
        for(let i=1;i<=5;i++){
            steps.push('Tydzień '+i)
        }

        return steps;
    }

    handleStep = (index) => () => {
        this.setState({
            selectedWeek:index
        })
    }

    closeModal = () => {
		this.setState({
			openModal: false,
			modalInitValue: [],
		});
	}

	onClick = (day) => {
        const {plan,selectedWeek} = this.state
		var data = plan[selectedWeek].exercises.filter(x => x.dayId === day )
        var filtered = data.filter( x => x.weight !== 0 && x.weight !== null)

        this.setState({
            openModal:true,
            modalInitValue:filtered
        })

	}

    PNGClick = () =>{
        var buttons = document.getElementsByName("rateRPEButton");
        buttons.forEach(element => {
            element.style.visibility = "hidden";
        });
        htmlToImage.toPng(document.getElementById('divToPrint'))
        .then(function (dataUrl) {
            //console.log(dataUrl)
            buttons.forEach(element => {
                element.style.visibility = "visible";
            });
            download(dataUrl, 'plan.png');
        });
    }

    PDFClick = () =>{
        var buttons = document.getElementsByName("rateRPEButton");
        buttons.forEach(element => {
            element.style.visibility = "hidden";
        });
        const pdfOptions = {
            fileName: 'plan',
            pdfOptions:{
                w: 295,
                h: 208,
                orientation: 'l',
                unit: 'mm'
            }
        }
        exportComponentAsPDF(this.componentRef,pdfOptions)
        .then(()=>{
            buttons.forEach(element => {
                element.style.visibility = "visible";
            });
        })
    }

    render() {
        if( this.state.logged  && this.state.selectedWeek >= 0 )
        {
            const plan = this.state.plan;
            let exerciseList = plan[this.state.selectedWeek].exercises;

            let eListLength = exerciseList.length;
            let statsArray = new Array(eListLength);
            let emptyField = "-";
            for (let i=0; i<eListLength; i++)
                statsArray[i] = new Array(10);
            let i = -1;
            exerciseList.forEach(e => {
                i++;
                statsArray[i][0] = e.dayId;
                statsArray[i][1] = e.excercise.type;
                statsArray[i][2] = e.excercise.excerciseName;
                if (e.excercise.progresMethod!==null)
                    statsArray[i][3] = e.excercise.progresMethod;
                else
                    statsArray[i][3] = emptyField;
                if (e.weight!==null)
                    statsArray[i][4] = e.weight;
                else
                    statsArray[i][4] = emptyField;
                if (e.sets !== null)
                    statsArray[i][5] = e.sets;
                else
                    statsArray[i][5] = e.excercise.sets;
                if (e.reps !== null)
                    statsArray[i][6] = e.reps;
                else
                    statsArray[i][6] = e.excercise.reps;
                statsArray[i][7] = emptyField; //tymczasowo -- tempo
                statsArray[i][8] = emptyField; //tymczasowo -- przerwa
                if (e.comments!==null)
                    statsArray[i][9] = e.comments;
                else
                    statsArray[i][9] = emptyField;
                
            });
            const steps = this.getStepps()
            i = 0;
            const {selectedWeek,openModal,modalInitValue} = this.state
            const {classes } = this.props
            return (
                <ContextConsumer>
                    {
                        language => {
                            return (
                                <div className="Forms-div">
                                    <Dialog
                                        open={openModal}
                                        maxWidth="md"
                                        fullWidth={true}
                                        onBackdropClick={this.closeModal}
                                        onEscapeKeyDown={this.closeModal}
                                    >
                                        <DialogTitle>{language.dictionary.RPERating}</DialogTitle>
                                        <DialogContent>
                                            <RpeForm
                                                closeModalFn = {this.closeModal}
                                                exercises = {modalInitValue}
                                                planId = {plan[selectedWeek].planUserId} 
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <Grid container justify='center' alignItems='center' spacing={1} style ={{width:'55%',marginTop:'20px',marginLeft:'25%'}}>
                                        <Grid item xs={12}>
                                            <Stepper nonLinear activeStep={selectedWeek} classes={{root:classes.stepperRoot}}  >
                                                {
                                                    steps.map((label,index) => (
                                                        <Step key={label} 
                                                            classes={{
                                                                root: classes.step,
                                                                active:classes.stepLabelActiveComplete,
                                                                completed:classes.stepLabelActiveComplete,
                                                            }}>
                                                            <StepButton onClick={plan[index] !==undefined && index < plan.length?this.handleStep(index):null} 
                                                                completed={plan[index] !==undefined && index < plan.length -1} 
                                                                active={plan[index] !==undefined }
                                                                disabled={index >= plan.length || plan[index] === undefined}>
                                                                    <StepLabel  classes={{
                                                                            label:classes.stepLabelActiveComplete,
                                                                            labelContainer: classes.labelContainer,
                                                                            active: classes.active,
                                                                            disabled: classes.disabled
                                                                        }} StepIconProps={{
                                                                            classes: {
                                                                            root: classes.step,
                                                                            completed: classes.completed,
                                                                            active: classes.active,
                                                                            disabled: classes.disabled
                                                                            }
                                                                        }}>
                                                                        {label}
                                                                        </StepLabel>

                                                            </StepButton>
                                                        </Step>
                                                        
                                                    ))    
                                                }
                                            </Stepper>
                                        </Grid>
                                        <Grid item xs ={12} >
                                                <table className="Forms-table" id="divToPrint" ref={this.componentRef}>
                                                {/* Day I */}
                                                <tbody className="Forms-tbody1">
                                                    <tr style={{backgroundColor:'firebrick',color:'white'}}>
                                                        <th>{language.dictionary.ExcerciseName}</th>
                                                        <th>{language.dictionary.ProgressionMethod}</th>
                                                        <th>{language.dictionary.Weight2}</th>
                                                        <th>{language.dictionary.Sets}</th>
                                                        <th>{language.dictionary.Reps}</th>
                                                        <th>Tempo</th>
                                                        <th>{language.dictionary.Comments}</th>
                                                    </tr>
                                                    <tr  >
                                                        <th  style={{backgroundColor:'firebrick',color:'white'}} colSpan="7" className={classes.header} >
                                                            {language.dictionary.Day} I
                                                            <BootstrapButton
                                                                name="rateRPEButton"
                                                                variant="contained"
                                                                color="secondary"
                                                                className={classes.toggler}
                                                                onClick={(e) => this.onClick(1)}
                                                                style={{visibility:`${selectedWeek !== plan.length-1?'hidden':'visible'}`}}
                                                            >
                                                                {language.dictionary.RateRPE}
                                                            </BootstrapButton>
                                                        </th>
                                                        
                                                    </tr>
                                                    {statsArray.map((x,key)=>{
                                                        if (x[0]===1)
                                                            {i++;
                                                            return(
                                                                <tr id={"trday1"+key} key={"day1"+key} className={classes.tableCellStyle} >
                                                                    <td>{x[2]}</td>
                                                                    <td>{x[3]}</td>
                                                                    <td>{x[4]}</td>
                                                                    <td>{x[5]}</td>
                                                                    <td>{x[6]}</td>
                                                                    <td>{x[7]}</td>
                                                                    <td>{x[9]}</td>
                                                                </tr>
                                                            )
                                                            }
                                                        else
                                                            {
                                                            statsArray = statsArray.slice(i);
                                                            i = 0;
                                                            return null;
                                                            }
                                                    })}
                                                </tbody>
                                                {/* Day II */}
                                                <tbody className="Forms-tbody2">
                                                    <tr>
                                                    <th  style={{backgroundColor:'firebrick',color:'white'}} colSpan="7" className={classes.header} >
                                                        {language.dictionary.Day} II
                                                            <BootstrapButton
                                                                name="rateRPEButton"
                                                                variant="contained"
                                                                color="secondary"
                                                                className={classes.toggler}
                                                                onClick={(e) => this.onClick(2)}
                                                                style={{visibility:`${selectedWeek !== plan.length-1?'hidden':'visible'}`}}
                                                            >
                                                                {language.dictionary.RateRPE}
                                                            </BootstrapButton>
                                                        </th>
                                                    </tr>
                                                    {statsArray.map((x,key)=>{
                                                        if(x[0]===2)
                                                        {
                                                            i++;
                                                            return(
                                                                <tr id={"trday2"+key} key={"day2"+key} className={classes.tableCellStyle}>
                                                                    <td>{x[2]}</td>
                                                                    <td>{x[3]}</td>
                                                                    <td>{x[4]}</td>
                                                                    <td>{x[5]}</td>
                                                                    <td>{x[6]}</td>
                                                                    <td>{x[7]}</td>
                                                                    <td>{x[9]}</td>
                                                                </tr>
                                                            )
                                                        }
                                                        else 
                                                        {
                                                            statsArray = statsArray.slice(i);
                                                            i = 0;
                                                            return null;
                                                        }
                                                    })}
                                                </tbody>
                                                {/* Day III */}
                                                <tbody className="Forms-tbody3">
                                                    <tr>
                                                    <th  style={{backgroundColor:'firebrick',color:'white'}} colSpan="7" className={classes.header} >
                                                        {language.dictionary.Day} III
                                                            <BootstrapButton
                                                                name="rateRPEButton"
                                                                variant="contained"
                                                                color="secondary"
                                                                className={classes.toggler}
                                                                onClick={(e) => this.onClick(3)}
                                                                style={{visibility:`${selectedWeek !== plan.length-1?'hidden':'visible'}`}}
                                                            >
                                                                {language.dictionary.RateRPE}
                                                            </BootstrapButton>
                                                        </th>
                                                    </tr>
                                                    {statsArray.map((x,key)=>{
                                                        if(x[0]===3)
                                                        {
                                                            return(
                                                                <tr id={"trday3"+key} key={"day3"+key} className={classes.tableCellStyle}>
                                                                    <td>{x[2]}</td>
                                                                    <td>{x[3]}</td>
                                                                    <td>{x[4]}</td>
                                                                    <td>{x[5]}</td>
                                                                    <td>{x[6]}</td>
                                                                    <td>{x[7]}</td>
                                                                    <td>{x[9]}</td>
                                                                </tr>
                                                            )
                                                        }
                                                        else return null;
                                                    })}
                                                </tbody>
                                            </table>                                        
                                        </Grid>
                                        <Grid item xs ={12} container justify="space-evenly">
                                            <Button variant="contained"
                                                    color="secondary"
                                                    className={classes.button}  
                                                    onClick={this.PDFClick}>
                                                {language.dictionary.ExportPDF}
                                            </Button>
                                            <Button variant="contained"
                                                    color="secondary"
                                                    className={classes.button}  
                                                    onClick={this.PNGClick}>
                                                {language.dictionary.ExportPNG}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            )
                        }
                    }
                </ContextConsumer>
            )
        }
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

export default withStyles(styles, {withTheme: true})(TrainingPlan3days);