import {useState, useContext,useEffect} from 'react';
import {LanguageContext} from '../languages/LanguageContext'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {CgGym} from 'react-icons/cg'
import {GiSkeleton} from 'react-icons/gi'
import PersonalData from './PersonalData'
import EditUserData from './EditUserData'
import PersonalTrainingData from './PersonalTrainingData'
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import axios from "axios";
import {
    Tab ,
    Tabs,
    Paper,
    Box,
    Typography } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor:'black',
        marginTop:'20px'
    },
    tabItem: {
        // backgroundColor:'firebrick',
        color:'white'
    },
    IconStyle: {
        width:'25px',
        height:'25px'
    },
    content: {
        marginTop:'30px',
        backgroundColor:'black'
    }
    }));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box p={3} >
                <Typography style={{color:'white',backgroundColor:'black'}}>{children}</Typography>
            </Box>
        )}
        </div>
    );
    }
    
    TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
    };

const SettingsTrainer = (props) => {
//Funkcyjny
    const context = useContext(LanguageContext)
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = useState(0);

    function a11yProps(index) {
        return {
          id: `full-width-tab-${index}`,
          'aria-controls': `full-width-tabpanel-${index}`,
        };
      }
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleChangeIndex = (index) => {
        setValue(index);
      };
   
    return (
        <div>
             <Paper className={classes.root}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    centered

                >
                    <Tab icon={<AccountCircleIcon className={classes.IconStyle }/>} label={context.dictionary.PersonalData} className={classes.tabItem} {...a11yProps(0)}  />
                    
                </Tabs>
                </Paper>
                <div className={classes.content}>
                    <TabPanel value={value} index={0} dir={theme.direction} style={{backgroundColor:'black'}} >
                        <EditUserData/>
                    </TabPanel>
                    
                </div>                
        </div>        
      );
}

export default SettingsTrainer;