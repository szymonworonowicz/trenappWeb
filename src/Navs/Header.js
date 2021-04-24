import React, { Component } from "react";
import {ContextConsumer} from '../languages/LanguageContext'
import PersonIcon from '@material-ui/icons/Person';
import PersonAdd from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import '../Styles/Header.css'
import LanguageSelector from '../languages/LanguageSelector'


class Header extends Component {

    // static contextType = LanguageContext
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props)
    }
    
    logOut = () => {
        localStorage.removeItem('token');
        window.location.replace("/");
      }

    isTokenExist = () => {
        const token = localStorage.getItem('token')
        return token !== null
    }

    render () {
        return (
            <ContextConsumer>
                {
                    language => {
                        console.log(language)
                        return (
                            <div className="headerContent">
                            <a href="/" className="logo">
                                <img alt="Strona Główna" src="https://podsztanga.pl/wp-content/themes/storefront/assets/img/logo-home.png" height="30px"></img>
                            </a>
                            <div className="account_Elements">
                                {
                                    !this.isTokenExist()? 
                                    (
                                        <ul className="list__navbar">
                                            <li className="list__navbar__element"> 
                                                <a href="/login">
                                                    <div className="inlineAnchor">
                                                        <PersonIcon className="ico"></PersonIcon>
                                                        <p className="anchorInfo">{language.dictionary.SignIn}</p>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="list__navbar__element">
                                                <a href="/registration">
                                                    <div className="inlineAnchor">
                                                        <PersonAdd className="ico"/>
                                                        <p className="anchorInfo">{language.dictionary.Register}</p>
                                                    </div>
                                                </a>
                                            </li>
                                            <LanguageSelector/>
                                        </ul>
                                    )
                                    :(
                                        <ul className="list__navbar">
                                            <li className="list__navbar__element">
                                                <div className="logOut_button inlineAnchor" onClick={this.logOut}>
                                                    <ExitToAppIcon className="ico"/>
                                                    <p className="anchorInfo">{language.dictionary.SignOut}</p>
                                                </div>
                                            </li>
                                            <LanguageSelector/>
                                        </ul>
                                    )
                                }
                            </div>
                        </div>                    
                        )
                    }
                }
            </ContextConsumer>
        )
    }
}
// Header.contextType = LanguageContext
export default Header;