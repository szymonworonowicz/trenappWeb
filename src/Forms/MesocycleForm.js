import React, { Component } from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import { Redirect } from 'react-router-dom';
import '../Styles/Forms.css';

class MesocycleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            status:false,
            days:-1
        }
        //this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount = () =>{
        var token = localStorage.getItem('token');
        var logged = false;
        if(token != null)
            logged = true;
        this.setState({
            logged: logged
        })
    }

    handleChange=(nr,event)=> {
        //event.target.value.
        this.setState({
            days: nr
        });
        console.log("days: ",this.state.days);

    }
    handleSubmit(event) {
        
        
        this.setState({
            status: true
        })

        //console.log(this.state);

    }

    render() {
        const { status } = this.state.status;
        if (status === true)
            return <Redirect to="/" />

        if(this.state.logged)
        {
            let description;
            if(this.state.days!==-1)
            {
                description=
                <div>
                    <p>
                        <label className="Forms-label">wybrano {this.state.days} dni</label>
                    </p>
                    <button className="Forms-button" onClick={this.handleSubmit}>zatwierdź</button>
                </div>
            }
            else
            {
                description= 
                <div>
                    <label className="Forms-label">nie wybrano liczby dni</label>
                </div>
            }
            
            return (
                <ContextConsumer>
                    {
                        language => {
                            return (
                                <div className="Forms-div">
                                    <p>
                                        <label className="Forms-label">{language.dictionary.trainingDaysPerWeek}</label>
                                        <button onClick={()=>this.handleChange(3)}>3</button>
                                        <button onClick={()=>this.handleChange(4)}>4</button>
                                    </p>
                                    <div>{description}</div>
                                </div>
                            )
                        }
                    }
                </ContextConsumer> 
            );
        }
        else return(
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

export default MesocycleForm;
