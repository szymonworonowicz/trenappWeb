import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { LanguageContext } from '../languages/LanguageContext'
import { CanvasJSChart } from 'canvasjs-react-charts'
import axios from "axios"

const VolumeChart = ({userId, width, height}) =>{
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
            await axios.get('api/charts/VolumeChart/'+id,config)
            .then( response => {
                setChartData(response.data)
            })
            .catch(error=>console.log(error));
        }
        const setChartData = (data) =>{
            
            let squatVolumeDataPoints = [];
            data.squatVolume.forEach(elem=>{
                squatVolumeDataPoints.push({x: elem.key, y: elem.value})
            })
    
            let deadliftVolumeDataPoints = [];
            data.deadliftVolume.forEach(elem=>{
                deadliftVolumeDataPoints.push({x: elem.key, y: elem.value})
            })
    
            let bpVolumeDataPoints = [];
            data.bpVolume.forEach(elem=>{
                bpVolumeDataPoints.push({x: elem.key, y: elem.value})
            })
    
            const options = {
                animationEnabled: true,
                exportEnabled: true,
                theme: "light2", // "light1", "dark1", "dark2"
                title:{
                    text: context.dictionary.VolumeChart
                },
                toolTip: {
                    shared: true
                },
                axisY: {
                    title: context.dictionary.SetsRepsWeight,
                },
                axisX: {
                    title: context.dictionary.Microcycle,
                    prefix: "M",
                    interval: 1
                },
                data: [
                    {
                        type: "line",
                        name: context.dictionary.SquatVolume,
                        showInLegend: true,
                        dataPoints: squatVolumeDataPoints
                    },
                    {
                        type: "line",
                        name: context.dictionary.DeadliftVolume,
                        showInLegend: true,
                        dataPoints: deadliftVolumeDataPoints
                        // [
                        //     {x: 1, y: 800},
                        //     {x: 2, y: 1000},
                        //     {x: 3, y: 1000},
                        // ]
                    },
                    {
                        type: "line",
                        name: context.dictionary.BPVolume,
                        showInLegend: true,
                        dataPoints: bpVolumeDataPoints
                        // [
                        //     {x: 1, y: 600},
                        //     {x: 2, y: 220},
                        //     {x: 3, y: 110}
                        // ]
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

VolumeChart.propTypes = {
    userId: PropTypes.number.isRequired,
    width: PropTypes.string,
    height: PropTypes.string
}

export default VolumeChart;