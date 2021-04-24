import React, {Component} from 'react';
import BravermanForm from './BravermanForm';
import axios from "axios";
import { Redirect } from 'react-router-dom';
axios.defaults.baseURL = "http://localhost:5000/";

class BravermanFileForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            PersonalTrainingDataId:-1,
            category: 
            [
                { name: 'dopamina1', counter: 0 },
                { name: 'acetyloholina1',counter: 0 },
                { name: 'gaba1',counter: 0 },
                { name: 'serotonina1',counter: 0 },
                { name: 'dopamina2', counter: 0 },
                { name: 'acetyloholina2',counter: 0 },
                { name: 'gaba2',counter: 0 },
                { name: 'serotonina2',counter: 0 }
            ],
            category_nr: 0,
            redirect: false
        }
    }

    componentDidMount = () =>{
        this.setState({
            PersonalTrainingDataId: this.props.location.state.PersonalTrainingDataId
        })
    }

    async SendBraverman(data){
        const body = {
            PersonalTrainingDataId : this.state.PersonalTrainingDataId,
            Info: {
                Dopamine1: data[0].counter,
                Serotonin1: data[1].counter,
                Acetylocholine1: data[2].counter,
                Gaba1: data[3].counter,
                Dopamine2: data[4].counter,
                Serotonin2: data[5].counter,
                Acetylocholine2: data[6].counter,
                Gaba2: data[7].counter,
            }
        }
        const config = {
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
                withCredentials: true,
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Access-Control-Expose-Headers': '*'
            },
        }
        await axios.post("api/Braverman/addBravermanInfo", body, config)
            .then((response)=>{
                localStorage.setItem('token',response.headers['newtoken'])
                this.setState({
                    redirect: true
                })
            })
            .catch((error)=>{console.log('error',error)});
    }

    submit = (counter) =>
    {
        let cat_nr = this.state.category_nr;
        let categories = this.state.category;
        categories[cat_nr].counter = counter;
        console.log("category: ",categories[cat_nr]);
        if (cat_nr===7) {
            this.SendBraverman(categories);
        }
        else {
            this.setState (() => {
                return {category_nr: cat_nr+1, category: categories};
            })
        }
    }

    render() {
        const { redirect } = this.state;
        if (redirect === true)
            return <Redirect to="/settings"/>
        let nr = this.state.category_nr;
        return(
            <div>
                <BravermanForm Submit={this.submit} category = {this.state.category[nr].name}></BravermanForm>
            </div>
        );
    }
}

export default BravermanFileForm;
