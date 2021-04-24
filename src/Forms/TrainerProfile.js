import React, {Component} from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import '../Styles/Forms.css';
import axios from "axios";
import jwt_decode from 'jwt-decode';
import TrainingPlan3days  from'./TrainingPlan3days';
axios.defaults.baseURL = 'http://localhost:5000/';

class TrainerProfile extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:null
        };
        //this.load = this.loadPlan.bind(this);
        // bindowanie funkcji asynchronicznych
    }
    

    
    async loadUsers()
    {
        const config = {
            headers: {
              "Content-type": "application/json",
               Accept: "application/json",
               withCredentials: true,
               Authorization: `Bearer ${localStorage.getItem('token')}`,
               'Access-Control-Expose-Headers': '*'
            },
          };
          let data = localStorage.getItem('token');
          
          data = jwt_decode(data);
          console.log("token",data.id);
          let id = Number(data.id);

          let jsonID = JSON.parse(id);
          console.log(jsonID);
          //console.log("token",jwt_decode(data));
          await axios
            .get("api/trainers/getUsers/"+id ,config)
            .then((response) =>{
                localStorage.setItem('token',response.headers['newtoken'])
                this.setState(()=>{
                    return {data:response.data}
                })
                console.log(response);
               /* var token = localStorage.getItem('token');
                var role = "none";
                if(token != null)
                {
                    //how to decode token
                    console.log("token",jwt_decode(token));
                    role = jwt_decode(token).role;
                }*/
            }).catch(error=>{console.log(error)});
    }
    
    

    componentDidMount=()=>
    {
        this.loadUsers();
    }

    
    render=()=>
    {
        return (
            <ContextConsumer>
                {
                    language => {
                        return (
                            <div>
                                {this.state.data==null ? language.dictionary.DataNotLoaded:
                                <div>                        
                                    <select>
                                        {this.state.data.pupils.map((value,id)=>
                                        {
                                            console.log(value);
                                            return <option key={id}>
                                                
                                                    {value.firstName}
                                                    {" "}
                                                    {value.lastName}
                                                
                                                
                                            </option>
                                        }
                                        )}
                                    </select>
                                    <TrainingPlan3days/>
                                </div>}
                            </div>
                        )
                    }
                }
            </ContextConsumer>
        );
    }
}

export default TrainerProfile;