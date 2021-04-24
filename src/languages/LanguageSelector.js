import React, { useContext } from 'react';
import { languageOptions } from './LanguageOptions';
import { LanguageContext } from './LanguageContext';
import Flag from 'react-flagkit'
import {makeStyles} from '@material-ui/core/styles'

const useStyle = makeStyles((theme) => ({
    list__navbar__element:{
        marginLeft: '5px',
        backgroundColor: 'rgb(32, 32, 31)'
    },
    inlineAnchor : {
        verticalAlign: 'middle',
        marginLeft: '10px',
        backgroundColor: 'rgb(32, 32, 31)',
        cursor:'pointer'
    }

}))
const  LanguageSelector = () =>  {

  const { userLanguage, userLanguageChange } = useContext(LanguageContext);

  // set selected language by calling context method
  const handleLanguageChange = e => {
      const splitted = e.target.alt.split(' ')
      userLanguageChange(splitted[0])
    };


  const classes = useStyle()
  return (
    <li className={classes.list__navbar__element}>
        <Flag
            country="GB"
            className={classes.inlineAnchor}
            role="button"
            onClick={handleLanguageChange}
        />
        <Flag
            country="PL"
            role="button"
            className={classes.inlineAnchor}
            onClick={handleLanguageChange}
        />
    </li>
)
}

export default LanguageSelector