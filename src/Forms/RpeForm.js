import PropTypes from 'prop-types';
import {useState} from 'react'
import RpeSlider from './RpeSliders'
import RpeQuestionnaire from './RpeQuestionnaire'
import axios from 'axios'

const RpeForm = (props) =>   {
    const [questionnaireData,setQuestionnaireData] = useState([])
    const {exercises,closeModalFn, planId} = props
    
    const config = {
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        }
    }

    const onClickSaveRPE = async (exercisesList) => {
        const body = {
            PlanId: planId,
            exercises: exercisesList
        }
        await axios.post('http://localhost:5000/api/trainingplan/addRPE', body, config)
        .then((response) => {
            let list = []
            if(response.data && response.data.length > 0){
                response.data.forEach((item)=>{
                    let exe = exercises.find(x => x.excerciseId === item.excerciseId)
                    if(exe !== undefined){
                        let obj = item
                        obj.exerciseName = exe.excercise.excerciseName
                        list.push(obj)
                    } 
                })
                setQuestionnaireData(list)
            }
            else{
                closeModalFn()
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const onClickSaveQuestionnaire = async (RPEAnswer) =>{
        await axios.post('http://localhost:5000/api/trainingplan/postAnswerRPE', RPEAnswer, config)
        .then((response) => {
            console.log('response',response)
            closeModalFn()
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    return (
        questionnaireData.length === 0 
            ? <RpeSlider exercises={exercises} onSave={onClickSaveRPE}/>
            : <RpeQuestionnaire data={questionnaireData} onSave={onClickSaveQuestionnaire}/>
    )

}
RpeForm.propTypes = {
    closeModalFn:PropTypes.func.isRequired,
    exercises:PropTypes.array.isRequired
}
RpeForm.defaultProps = {
    exercises:[]  
}

export default RpeForm;