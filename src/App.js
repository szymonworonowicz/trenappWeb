import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import Registration from "./Forms/Registration";
import Login from "./Forms/Login";
import PasswordRecovery from "./Forms/PasswordRecovery";
import PasswordChange from "./Forms/PasswordChange";
import PasswordReset from "./Forms/PasswordReset";
import PersonalData from "./Forms/PersonalData";
import axios from "axios";
import Home from "./Home";
import BravermanFileForm from "./Forms/BravermanFileForm";
import PersonalTrainingData from "./Forms/PersonalTrainingData";
import MesocycleForm from "./Forms/MesocycleForm";
import TrainingPlan3days from "./Forms/TrainingPlan3days";
import TrainingPlan3daysUser from "./Forms/TrainingPlan3daysUser";
import SettingsTrainer from "./Forms/settingsTrainer";
import Header from './Navs/Header';
import Navbar from './Navs/Navbar'
import Pupils from './Forms/Pupils'
import "./Styles/App.css";
import jwt_decode from 'jwt-decode';
import TrainerProfile from "./Forms/TrainerProfile";
import Footer from './Footer'
import Settings from "./Forms/Settings";
import ExcerciseView from './Views/ExcerciseView'
import Notifications from './Views/Notifications'
import LanguageProvider from './languages/LanguageProvider'
import TraininingPlanTrainerView from './Views/TrainingPlanTrainerView'
import UserProfile from './Views/UserProfile'

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "https://localhost:5001/";
axios.defaults.headers.get["Access-Control-Allow-Origin"] = "https://localhost:5001/";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "none",
      isToogled: false,
      isLoading:false
    };
  }

  componentDidMount = () => {
    var token = localStorage.getItem('token');
    console.log('token',token);
    var role = "none";
    if (token != null && token !== undefined) {
      //how to decode token
      //console.log("token", jwt_decode(token));
      role = jwt_decode(token).role;
    }
    this.setState({
      role: role
    })
  }

  async onRegistration (registationData, details) {
    var body = {
      User: {
        Name: registationData.login,
        Password: registationData.password,
      },
      Data: {
        ...details
        /*Gender: details.Gender,
        Weight: details.Weight,
        Height: details.Height,
        SportClass: details.SportClass,
        Experience: details.Experience,
        Age: details.Age,
        Diet: details.Diet,
        Sleep: details.Sleep,
        Stress: details.Stress,
        Ssa: details.Ssa,
        BenchPress: details.BenchPress,
        Squat: details.Squat,
        Deadlift: details.Deadlift,
        StartVolume: details.StartVolume,*/
      },
    };

    const config = {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };

    axios
      .post("api/Auth/register", body, config)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  async onPersonalDataChange(userId, details) { //=> Settings => PersonalData
    var body = {
      UserId: userId,
      TrainingData: details//{...details}
  };
  console.log("Wysyłam: "+body)
    const config = {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };

    axios.put('api/Auth/editTrainingData', body, config)
    .then(response=>console.log(response))
    .catch(error=>console.log(error))


  }

  async onPasswordChange(data) {
    var body = {
      UserId: data.UserId,
      OldPassword: data.OldPassword,
      NewPassword: data.NewPassword
    };
    const config = {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };
    let result = false;
    await axios.put("/api/Auth/passwordchange", body, config)
      .then(() => {
        result = true;
      })
      .catch(() => {
        result = false;
      });
    return result;
  };

  async onPasswordRecover(email) {
    const config = {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };
    let result = false;
    await axios.post(`/api/auth/remindPassword/${email}`, config)
    .then((response) => {
      console.log(response.data);
      result = true;
    })
    .catch(() => {
      result = false;
    })
    return result;

  }

  hamburgerHandle = (e) => {
    const istoogled = this.state.isToogled;
    this.setState({
      role: this.state.role,
      isToogled: !istoogled
    })
  }
  render() {
    const role = this.state.role;
    
    return (
      <Router>
      <LanguageProvider>
          <div className="pageContainer">
            <Header/>              
              <Navbar role={role}></Navbar>
              
              <Route exact path="/" render={() =>{
                if(role===undefined || role===null || role ==="none") 
                  return <Home/>
                  else if(role==="user")
                  return <Redirect to="/trainingplan/3days/user"/>
                  else if(role==="admin")
                    return <Redirect to= "/pupils"/>
                    else return "błąd"
              } } />
              <Route exact path="/registration" render={() => <Registration />} />
              <Route
                exact
                path="/login"
                render={() => <Login />}
              />
              <Route
                exact
                path="/profile"
                render={(props) => (
                  <PersonalData confirmForm={this.onRegistration.bind(this)} {...props} />
                )}
              />
              <Route
                exact
                path="/passwordchange"
                render={() => <PasswordChange onClick={this.onPasswordChange.bind(this)} />}
              />
              <Route
                exact
                path="/passwordreset"
                render={() => <PasswordReset onClick={null} />}
              />
              
              <Route 
              exact path="/forgotpassword" 
              render={() => <PasswordRecovery onClick={this.onPasswordRecover.bind(this)}/>}
              />
              <Route
              
                exact
                path="/pupils"
                render={()=><Pupils/>}>

              </Route>
              <Route
                exact
                path="/bravermantest"
                render={(props) => <BravermanFileForm {...props}/>}
              />
              <Route
                exact
                path="/personaltrainingdata"
                render={() => <PersonalTrainingData />}
              />
              <Route exact path="/mesocycledays" render={() => <MesocycleForm />} />
              <Route
                exact
                path="/trainingplan/3days"
                render={(props) => <TraininingPlanTrainerView {...props} />}
              />
              <Route
                exact
                path="/trainingplan/3days/user"
                render={() => <TrainingPlan3daysUser />}
              />
              <Route
                exact
                path="/excerciseList"
                render={() => <ExcerciseView />}
              />
              <Route
                exact
                path="/settings"
                render={() => <Settings editPersonalData={this.onPersonalDataChange.bind(this)} />}
              />
              <Route
                exact
                path="/trainerProfile"
                render={() => <TrainerProfile />}
              />
              <Route
                exact
                path="/notifications"
                render={() => <Notifications />}
              />
               <Route
                exact
                path="/settingsTrainer"
                render={() => <SettingsTrainer editPersonalData={this.onPersonalDataChange.bind(this)}/>}
              />
              <Route
                exact
                path="/userProfile"
                render={(props) => <UserProfile {...props}/>}
              />

            <Footer></Footer>
          </div>
      </LanguageProvider>
      </Router>
    );
  }

}
export default App;
