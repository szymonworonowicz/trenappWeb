import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { LanguageContext } from '../languages/LanguageContext'
import { CanvasJSChart } from 'canvasjs-react-charts'
import axios from "axios"

const ARIChart = ({userId, width, height}) =>{
    const context = useContext(LanguageContext)
    const [squatChartOptions,setSquatChartOptions] = useState({})
    const [deadliftChartOptions,setDeadliftChartOptions] = useState({})
    const [bpChartOptions,setBPChartOptions] = useState({})

    useEffect(() => {
        const id = 13 // tymczasowo
        //const id = userId tak powinno byc 
        const fetchData = async () => {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Accept: 'application/json'
                }
            }
            await axios.get('api/charts/ARIChart/'+id,config)
            .then( response => {
                setChartData(response.data)
            })
            .catch(error=>console.log(error));
        }
        const setChartData = (data) =>{    
            const baseOptions = {
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2", // "light1", "dark1", "dark2"
                title:{
                    text: ""
                },
                axisY: {
                    suffix: "%",
                    maximum: 100
                },
                data: [
                    {
                        type: "column",
                        toolTipContent: "{label}: {y}%",
                        dataPoints: []
                    }
                ]
            }
    
            if(data.squatResult.length !== 0){
                let squatResultDataPoints = [];
                data.squatResult.forEach(elem=>{
                    squatResultDataPoints.push({label: "M" + elem.key, y: elem.value * 100})
                })
                const squatOptions = baseOptions
                squatOptions.title.text = context.dictionary.ARIChart + " (" + context.dictionary.Squat + ")"
                squatOptions.data[0].dataPoints = squatResultDataPoints;
                setSquatChartOptions(squatOptions)
            }
    
            if(data.deadliftResult.length !== 0){
                let deadliftResultDataPoints = [];
                data.deadliftResult.forEach(elem=>{
                    deadliftResultDataPoints.push({label: "M" + elem.key, y: elem.value * 100})
                })
                const deadliftOptions = baseOptions
                deadliftOptions.title.text = context.dictionary.ARIChart + " (" + context.dictionary.Deadlift + ")"
                deadliftOptions.data[0].dataPoints = deadliftResultDataPoints;
                setDeadliftChartOptions(deadliftOptions)
            }
    
            if(data.bpResult.length !== 0){
                let bpResultDataPoints = [];
                data.bpResult.forEach(elem=>{
                    bpResultDataPoints.push({label: "M" + elem.key, y: elem.value * 100})
                })
                const bpOptions = baseOptions
                bpOptions.title.text = context.dictionary.ARIChart + " (" + context.dictionary.BenchPress + ")"
                bpOptions.data[0].dataPoints = bpResultDataPoints;
                setBPChartOptions(bpOptions)
            }
        }
        fetchData();
    },[context.dictionary])
    
    return(
        <div style={{width: {width}, height: {height}, margin: 'auto'}}>
            {Object.keys(squatChartOptions).length !== 0 &&
                <CanvasJSChart options = {squatChartOptions}/>
            }
            {Object.keys(deadliftChartOptions).length !== 0 &&
                <CanvasJSChart options = {deadliftChartOptions}/>
            }
            {Object.keys(bpChartOptions).length !== 0 &&
                <CanvasJSChart options = {bpChartOptions}/>
            }
        </div>
    )
}

ARIChart.propTypes = {
    userId: PropTypes.number.isRequired,
    width: PropTypes.string,
    height: PropTypes.string
}

export default ARIChart;