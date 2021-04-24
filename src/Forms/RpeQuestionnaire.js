import {useContext, useState, useEffect} from 'react'
import { LanguageContext} from '../languages/LanguageContext'
import PropTypes from 'prop-types';
import {
    Radio,
    Button,
    RadioGroup,
    Typography,
    FormControl,
    FormLabel,
    FormControlLabel,
    Tooltip,
    Grid} from '@material-ui/core'
const RpeQuestionnaire = (props) => {

    const context = useContext(LanguageContext)
    const [RPEAnswer,setRPEAnswer] = useState([])
    const {data, onSave} = props

    useEffect(()=>{
        let list = []
        data.forEach((item)=>{
            list.push({
                ExcerciseId: item.excerciseId,
                isToHeavy: false,
                isVolume: false,
                isWeight: false
            })
        })
        setRPEAnswer(list);
    },[data])

    const onClick = () => {
        onSave(RPEAnswer)
    }

    const handleChangeRadio = (e,value,exerciseId) => {
        let list = RPEAnswer
        const index = list.findIndex(x => x.ExcerciseId === exerciseId)
        list[index].isToHeavy = false
        list[index].isVolume = false
        list[index].isWeight = false
        list[index][value] = true
        setRPEAnswer(list)
    }
    return(
        <div>          
        {
            data.map((value,index) => {
                return (
                    <Grid container spacing={1} justify='space-between' alignItems='center' key={index}>
                        <Grid item xs={12}>
                            <Typography component='h5' style={{fontWeight:'bold'}}>
                            { value.exerciseName} 
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel component="legend" > {context.dictionary.WhatWrong}</FormLabel>
                                <RadioGroup aria-label="Gender" name="Gender" row  onChange={(e,val) => handleChangeRadio(e,val,value.excerciseId)} >
                                    <FormControlLabel value="isWeight" control={<Radio />} label={context.dictionary.ToHeavy} />
                                    <FormControlLabel value="isVolume" control={<Radio />} label={context.dictionary.ToHeightVolume} />
                                    <Tooltip title={context.dictionary.Trouble} >
                                        <FormControlLabel value="isToHeavy"  control={<Radio/>} label={context.dictionary.PreviousExcercise} />
                                    </Tooltip>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                )
            
        })}        
        <Grid container spacing={1} justify='center' alignItems='center'>
            <Grid item xs={8}>
                <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        style={{margin: '10px 0px 2px 0px',backgroundColor: 'firebrick',}}
                        onClick={onClick}
                    >
                       {context.dictionary.Save}
                </Button>
            </Grid>
        </Grid>    
                    
        </div>
    )

}

RpeQuestionnaire.propTypes = {
    closeModalFn:PropTypes.func.isRequired,
    exercises:PropTypes.array.isRequired
}
RpeQuestionnaire.defaultProps = {
    exercises:[]  
  }
export default RpeQuestionnaire