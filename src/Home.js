import React, {Component} from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './Styles/Home.css';
import mainImage from './Assets/mainPage.jpg'

axios.defaults.baseURL = 'http://localhost:5000/';

class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
        role: 'none',
        personalData: [],
        trainingData: []
        };
    }

    async componentDidMount (){
        var token = localStorage.getItem('token');
        var role = "none";
        if(token != null)
        {
            role = jwt_decode(token).role;
            const config = {
                headers: {
                  "Content-type": "application/json",
                  Accept: "application/json",
                },
            };
            if(role === 'user')
            {
                await axios.get("api/Auth/getUser/" + jwt_decode(token).id, config)
                .then((response) => {
                    console.log("response",response.data);
                    let personalData = [];
                    personalData.push(response.data.user.firstName,response.data.user.lastName);
                    this.setState({
                        trainingData: response.data.user.trainingData,
                        personalData: personalData
                    })
                })
                .catch((error) => {
                    console.log("error",error);
                });
            }
        }
        this.setState({
            role: role
        })
    }

    render(){
        const role = this.state.role;
        let content;
        switch(role)
        {
            case 'none':
                content = 
                    <div className="Home-div"></div>
                break;
            case 'user':
                const personalData = this.state.personalData;
                content = 
                <div className="Home-div">
                    <h1 style={{color: "white", textAlign: "center"}}>Welcome User: {personalData[0] + personalData[1]}</h1>
                </div>
                break;
            case 'admin':
                content =
                    <div className="Home-div">
                        <h1 className="Home-h1">Welcome in TrenApp</h1>
                    </div>
                break;
            default:
                break;
        }
        return(
            <div style={{width:'100vh', position:'relative'}}>{content}</div>
        );
    }
}

export default Home;