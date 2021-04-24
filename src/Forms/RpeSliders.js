import PropTypes from 'prop-types';
import {useContext, useState, useEffect} from 'react'
import { LanguageContext} from '../languages/LanguageContext'
import {
    Grid,
    Typography,
    Button
} from '@material-ui/core'

import {withStyles} from '@material-ui/core/styles'
import {CustomSlider} from '../Components/StyledComponents'

const Slider = withStyles({
    rail: {
        color: 'firebrick'
    },
    markLabel: {
        color: 'black'
    },
})(CustomSlider)

const RpeSliders = (props) => {
    const context = useContext(LanguageContext)
    const [exercisesRPEList,setExercisesRPEList] = useState([]) 
    const {onSave, exercises} = props 

    useEffect(()=>{
        let list = []
        exercises.forEach((exercise)=>{
            list.push({PlanExcerciseId: exercise.excerciseId, RpeValue: 5})
        })
        setExercisesRPEList(list);
    },[exercises])

    const generateSliderValue = () => {
        let sliderValue = []
        for (let i = 1; i <= 10; i += 0.5) {
            sliderValue.push({
                value: i,
                label: `${i%1===0?i:''}`
            })
        }
        return sliderValue
    }

    const onClick = () => {
        onSave(exercisesRPEList)
    }
    const sliderValue = generateSliderValue()

    const handleChangeSlider = (e,value,exerciseId) =>{
        let list = exercisesRPEList
        const index = list.findIndex(x => x.PlanExcerciseId === exerciseId)
        list[index] = {PlanExcerciseId: exerciseId, RpeValue: value}
        setExercisesRPEList(list)
    }

    return(
        <div>
        {
            exercises.map((value,index) => {
                return (
                    <Grid container spacing={1} justify='space-between' alignItems='center' key={index}>
                        <Grid item xs={2}>
                            <Typography component='h5'>
                            { value.excercise.excerciseName} 
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography component='h5'>
                                { value.weight} kg
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography component='h5'>
                                { value.sets}x{value.reps}
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Slider
                                min={1}
                                max={10}
                                aria-labelledby="discrete-slider-restrict"
                                defaultValue={5}
                                step={null}
                                marks={sliderValue}
                                onChangeCommitted={(e,val) => handleChangeSlider(e,val,value.excerciseId)}
                            />
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

RpeSliders.propTypes = {
    exercises:PropTypes.array.isRequired,
    onSave:PropTypes.func.isRequired
}
RpeSliders.defaultProps = {
    exercises:[]  
}

export default RpeSliders;