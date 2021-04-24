import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { LanguageContext } from '../languages/LanguageContext'
import { CanvasJSChart } from 'canvasjs-react-charts'
import axios from "axios"

const INOLChart = ({userId, width, height}) =>{
    const context = useContext(LanguageContext)
    const [chartOptions,setChartOptions] = useState({})

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
            await axios.get('api/charts/INOLChart/'+id,config)
            .then( response => {
                setChartData(response.data)
            })
            .catch(error=>console.log(error));
        }
        const setChartData = (data) =>{
            let squatINOLDataPoints = [];
            data.squatINOL.forEach(elem=>{
                squatINOLDataPoints.push({x: elem.key, y: Math.round((elem.value + Number.EPSILON) * 100) / 100})
            })
    
            let deadliftINOLDataPoints = [];
            data.deadliftINOL.forEach(elem=>{
                deadliftINOLDataPoints.push({x: elem.key, y: Math.round((elem.value + Number.EPSILON) * 100) / 100})
            })
    
            let bpINOLDataPoints = [];
            data.bpINOL.forEach(elem=>{
                bpINOLDataPoints.push({x: elem.key, y: Math.round((elem.value + Number.EPSILON) * 100) / 100})
            })
    
            const options = {
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2", // "light1", "dark1", "dark2"
                title:{
                    text: context.dictionary.INOLChart
                },
                toolTip: {
                    shared: true
                },
                axisY: {
                    title: context.dictionary.INOL,
                },
                axisX: {
                    title: context.dictionary.Microcycle,
                    prefix: "M",
                    interval: 1
                },
                data: [
                    {
                        type: "line",
                        name: context.dictionary.Squat,
                        showInLegend: true,
                        dataPoints: squatINOLDataPoints
                    },
                    {
                        type: "line",
                        name: context.dictionary.Deadlift,
                        showInLegend: true,
                        dataPoints: deadliftINOLDataPoints
                    },
                    {
                        type: "line",
                        name: context.dictionary.BenchPress,
                        showInLegend: true,
                        dataPoints: bpINOLDataPoints
                    }
                ]
            }
            setChartOptions(options)
        }
        fetchData();
    },[context.dictionary])
    
    return(
        <div style={{width: {width}, height: {height}, margin: 'auto'}}>
            <CanvasJSChart options = {chartOptions}/>
        </div>
    )
}

INOLChart.propTypes = {
    userId: PropTypes.number.isRequired,
    width: PropTypes.string,
    height: PropTypes.string
}

export default INOLChart;