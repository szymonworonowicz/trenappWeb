import React, { useState, useEffect, useContext } from 'react';
import {LanguageContext} from '../languages/LanguageContext'
import axios from "axios";
import jwt_decode from 'jwt-decode';
import SearchBar from "material-ui-search-bar";
import { makeStyles,withStyles } from "@material-ui/core/styles";
import CreateIcon from '@material-ui/icons/Create';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {GiMuscleUp} from 'react-icons/gi'
import { AiOutlineLineChart} from 'react-icons/ai';
import {FaHammer} from 'react-icons/fa'
import {BsTable} from 'react-icons/bs'
import { createMuiTheme } from '@material-ui/core/styles';
import {StyledPagination, StyledPaginationItem} from '../Components/StyledComponents';
import { Link } from 'react-router-dom';
import {
    Grid,
    Button,
    
    ButtonGroup,
    ClickAwayListener,
    Grow,
    Paper,
    Popper,
    MenuItem,
    MenuList,
    Typography,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box
    } from '@material-ui/core'

    const styles = makeStyles ((theme) => (
    {
      heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '45.33%',
        flexShrink: 1,
        marginLeft:'5px'
      },
      submit: {
        margin: '10px 0px 2px 0px',
        backgroundColor: 'firebrick',
      },
      formPosition: {
        position:'fixed',
        width: '35vw',
        height: '40vh',
        left: '35%',
        top:'10%',
        marginBottom: '10%',
        backgroundColor:'black',
        padding:'0px 20px 20px 20px',
      }, 
      formElements: {
          backgroundColor:'white',
          borderRadius: '5px',
          minWidth:'20%',
          display:'flex',
          
      },
      pupilElement: {
          backgroundColor: 'rgb(32, 32, 31);'
      },
      small: {
        width: theme.spacing(3.5),
        height: theme.spacing(3.5),
      },
      expandedAcordionDetails: {
          marginTop:'0px',
          padding:'0px'
      },
      rootAcordionDetails: {
          marginTop:'0px',
          padding:'0px 15px 5px 15px'
      },
      rootAcordionSummary: {
          marginBottom:'0px'
      },
      contentAcordionSummary: {
          margin:'10px'
      }
    }
    ))
    
    const StyledTypography = withStyles({
        root:{
            minWidth:'100px',
            marginTop:'3px'
        }
    })(Typography)

    const filterOptions = ['NOWE','KONIEC PLANU',];
    const sortOptions = ['ALFABETYCZNIE [A-Z]','ALFABETYCZNIE [Z-A]']

const  Pupils = () =>  {
    //Funkcyjny
    const context = useContext(LanguageContext)
    const [filterOpen, setfilterOpen] = React.useState(false);
    const filterAnchorRef = React.useRef(null);
    const [filterSelectedIndex, setfilterSelectedIndex] = React.useState(-1);
    const [sortOpen, setSortOpen] = React.useState(false);
    const sortAnchorRef = React.useRef(null);
    const [sortSelectedIndex, setSortSelectedIndex] = React.useState(-1);
    const [searchValue,setSearchValue] = React.useState('')
    const [expanded,setExpanded] = React.useState(false)
    const [usersx, setUsers] = useState([]);
    const [modifiedUsers, setmUsers] = useState([]);

    let users = [
        {
            id: 13,
            firstName: "plan", 
            lastName: "treningowy", 
            mikrocykl: 2
        },{
            id: 12,
            firstName: "plan1", 
            lastName: "treningowy1", 
            mikrocykl: 1
        },{
            id: 11,
            firstName: "adam", 
            lastName: "testowy", 
            mikrocykl: 1
        },{
            id: 15,
            firstName: "zenek", 
            lastName: "arbuz", 
            mikrocykl: 4
        },{
            id: 16,
            firstName: "krzysiek", 
            lastName: "rataj", 
            mikrocykl: 3
        }
    ];

    const [pageUsers,setPage] = React.useState(users.slice(0,3));
    const [pageSize,setSize]=React.useState(4);
    const [pageNR,setPageNR]=React.useState(1);
    const [pageCount,setPageCount] = React.useState(Math.ceil(users.length/pageSize));

    useEffect(() => {
        const fetchData = async () => {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Accept: 'application/json',
                    withCredentials: true,
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Access-Control-Expose-Headers': '*'
                }
            }
            const result = 
                await axios.get('http://localhost:5000/api/trainers/getUsers/' + 
                                jwt_decode(localStorage.getItem('token')).id,
                                config);
            localStorage.setItem('token',result.headers['newtoken'])
            console.log('response',result.data.pupils); //coś
            setmUsers(users);
            //setmUsers(result.data.pupils);
            //setUsers(result.data.pupils);
            //setPage(result.data.pupils.slice(0,3));
            //setPageCount(Math.ceil(result.data.pupils.length/pageSize));
        };
        fetchData();
    }, []);

    const SortByPropAscending = (prop) =>{    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }
    
    const SortByPropDescending = (prop) =>{    
        return function(a, b) {    
            if (a[prop] < b[prop]) {    
                return 1;    
            } else if (a[prop] > b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }

    const handleFilterClick = () => {
        console.info(`You clicked ${filterOptions[filterSelectedIndex]}`);
    };

    const handleMenuFilterClick = (event, index) => {
        setfilterSelectedIndex(index);
        console.log(filterOptions[index])
        setfilterOpen(false);

        var filteredUsers =[];
        switch(index){
            case 0:
                console.log('poczatek');
                filteredUsers = users.filter((x)=>{return x.mikrocykl === 1});
                break;
            case 1:
                console.log('koniec');
                filteredUsers = users.filter((x)=>{return x.mikrocykl === 4});
                break;
            default:
                break;
        }
        console.log(filteredUsers);
        setmUsers(filteredUsers);
        setPage(filteredUsers.slice(0,3));
        setPageCount(Math.ceil(filteredUsers.length/pageSize));
    };

    const handleFilterToogle = () => {
        console.log(filterOpen)
        setfilterOpen((prevfilterOpen) => !prevfilterOpen);
    };

    const handleFilterClose = (event) => {
        if (filterAnchorRef.current && filterAnchorRef.current.contains(event.target)) {
        return;
        }

        setfilterOpen(false);
    };

    const handleSortClick = () => {
        console.info(`You clicked ${sortOptions[sortSelectedIndex]}`);
    };

    const handleMenuSortClick = (event, index) => {
        setSortSelectedIndex(index);
        console.log(filterOptions[index])
        setSortOpen(false);

        var sortedUsers =[];
        switch(index){
            case 0:
                console.log('a-z');
                sortedUsers = modifiedUsers.sort(SortByPropAscending("lastName"));
                break;
            case 1:
                console.log('z-a');
                sortedUsers = modifiedUsers.sort(SortByPropDescending("lastName"));
                break;
            default:
                break;
        }
        console.log(sortedUsers);
        setmUsers(sortedUsers);
        setPage(sortedUsers.slice(0,3));
        setPageCount(Math.ceil(sortedUsers.length/pageSize));
    };

    const handleSortToogle = () => {
        setSortOpen((prevSortOpen) => !prevSortOpen);
    };

    const handleSortClose = (event) => {
        if (sortAnchorRef.current && sortAnchorRef.current.contains(event.target)) {
        return;
        }

        setSortOpen(false);
    };
    
    const resetFilters = () => {
        setfilterSelectedIndex(-1);
        setSortSelectedIndex(-1);
        setmUsers(users);
        setPage(users.slice(0,3));
        setPageCount(Math.ceil(users.length/pageSize));
    }

    const handleExpandChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const getRomanNumber=(number) => {
        if(number === undefined || isNaN(number)) {
            return '0'
        }
        if(number ===1) {
            return 'I'
        }
        else if(number ===2) {
            return 'II'
        }
        else if(number ===3) {
            return 'III'
        }
        else if(number ===4) {
            return 'IV'
        }
        else if(number ===5) {
            return 'V'
        }
    }

    const PaginationFun=(e,page)=>
      {
        let pageUserslocal=modifiedUsers.slice((page-1)*pageSize,page*pageSize);
        //e.currentTarget.value=page;
        setPage(pageUserslocal);
        setPageNR(page);
        console.log(pageUsers);
    }

    const Search=()=> {
        
    }
        const classes = styles()
        return (
            <div className={classes.formPosition}>
                    <Grid container  spacing={1}  justify='space-evenly' alignItems='center'  >
                        <Grid item xs={12} >
                                <SearchBar
                                        value={searchValue}
                                        onChange={(newValue) => setSearchValue(newValue)}
                                        onRequestSearch={() => Search()}
                                    />
                        </Grid>
                        <Grid item xs={4} style={{ zIndex:'1' }} >
                            <ButtonGroup variant="contained" color="secondary" ref={filterAnchorRef} aria-label="split button" >
                            <Button color='secondary' onClick={handleFilterClick} className={classes.submit} >{filterSelectedIndex ===-1?context.dictionary.Filter: filterOptions[filterSelectedIndex]}</Button>
                            <Button
                                color="secondary"
                                size="small"
                                aria-controls={filterOpen ? 'split-button-menu' : undefined}
                                aria-expanded={filterOpen ? 'true' : undefined}
                                aria-label={context.dictionary.Filter}
                                aria-haspopup="menu"
                                onClick={handleFilterToogle}
                                className={classes.submit}
                            >
                                <ArrowDropDownIcon />
                            </Button>
                            </ButtonGroup>
                            <Popper open={filterOpen} anchorEl={filterAnchorRef.current} role={undefined} transition disablePortal style={{color:'firebrick'}}>
                                    {({ TransitionProps, placement }) => (
                                <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                                >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleFilterClose}>
                                    <MenuList id="split-button-menu" style={{backgroundColor:'firebrick',minWidth:'100px'}}>
                                        {filterOptions.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            style={{backgroundColor:'firebrick',color:'white'}}
                                            selected={index === filterSelectedIndex}
                                            onClick={(event) => handleMenuFilterClick(event, index)}
                                            >
                                            {option}
                                        </MenuItem>
                                        ))}
                                    </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                                </Grow>
                            )}
                            </Popper>
                        </Grid> 
                        <Grid item xs={5} style={{ zIndex:'1' }} >
                            <ButtonGroup variant="contained" color="secondary" ref={sortAnchorRef} aria-label="split button" >
                            <Button color='secondary' onClick={handleSortClick} className={classes.submit} >{sortSelectedIndex ===-1?context.dictionary.Sort: sortOptions[sortSelectedIndex]}</Button>
                            <Button
                                color="secondary"
                                size="small"
                                aria-controls={sortOpen ? 'split-button-menu' : undefined}
                                aria-expanded={sortOpen ? 'true' : undefined}
                                aria-label={context.dictionary.Sort}
                                aria-haspopup="menu"
                                onClick={handleSortToogle}
                                className={classes.submit}
                            >
                                <ArrowDropDownIcon />
                            </Button>
                            </ButtonGroup>
                            <Popper open={sortOpen} anchorEl={sortAnchorRef.current} role={undefined} transition disablePortal style={{backgroundColor:'firebrick'}}>
                                    {({ TransitionProps, placement }) => (
                                <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                                >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleSortClose}>
                                    <MenuList id="split-button-menu" style={{backgroundColor:'firebrick',minWidth:'100px'}}>
                                        {sortOptions.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            style={{backgroundColor:'firebrick',color:'white'}}
                                            selected={index === sortSelectedIndex}
                                            onClick={(event) => handleMenuSortClick(event, index)}
                                            >
                                            {option}
                                        </MenuItem>
                                        ))}
                                    </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                                </Grow>
                            )}
                            </Popper>
                        </Grid> 
                        <Grid item xs={3} style={{ zIndex:'1' }}>
                            <Button className={classes.submit} color='secondary' variant='contained' fullWidth onClick={() => resetFilters()}>
                                {context.dictionary.RemoveFilters}
                            </Button>
                        </Grid>                             
                    </Grid>
                    <Grid container justify = "center" >
                        <StyledPagination count={pageCount} showFirstButton showLastButton defaultPage={1} page={pageNR} 
                            onChange={(e,page)=>PaginationFun(e,page)}
                            renderItem={(item)=> 
                                <StyledPaginationItem {...item}/>}
                        />
                    </Grid>
                    
                    <Grid  container spacing ={1} justify='space-evenly' alignItems='center' style ={{minWidth: '250px',marginTop:'25px'}} >
                        {/* TODO Mapowanie listy uzytkownikow na grida */}
                        {
                            pageUsers.map((value,index) => {
                                return (
                                    <Grid item xs={12} key={index} >
                                        <Accordion expanded={expanded === 'panel'.concat(index)} onChange={handleExpandChange('panel'.concat(index))} variant='outlined' >
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            classes={{root:classes.rootAcordionSummary,content:classes.contentAcordionSummary}}
                                            >
                                                <Box display="flex" flexDirection="row" p={0} m={0}> 
                                                    <Avatar src={value.photo === null || value.photo ===undefined?'../Assets/person.png':value.photo } className={classes.small} /> 
                                                    <StyledTypography className={classes.heading}  display='inline'>{value.firstName.concat(' ').concat(value.lastName)}</StyledTypography>
                                                </Box>
                                                
                                            </AccordionSummary>
                                            <AccordionDetails classes={{root:classes.rootAcordionDetails}}>
                                                <Grid container xl={12} spacing={0}  justify='flex-start' alignItems='center' >
                                                    <Grid item xs={2}  >
                                                        {/* TODO tutaj dodac obsluge zdjecia z bazy */}
                                                            <Link  
                                                                to={{
                                                                    pathname: '/userProfile',
                                                                    state: {
                                                                        AthleteId: value.id
                                                                    }
                                                                }}
                                                            >
                                                                    <div style={{color:'black',marginTop:'2px',padding:'5px 0px 0px 2px',display:'inline-flex'}}>
                                                                        <p style={{marginTop:'5px'}}>{context.dictionary.Profile}</p>
                                                                        <GiMuscleUp style={{marginTop:'2px',marginLeft:'5px',width:'25px',height:'25px'}}/>                                                                     
                                                                    </div>
                                                            </Link>
                                                                   
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                        {/* TODO do dostylowania buttony */}
                                                            <Link  to={{
                                                                    pathname: '/trainingplan/3days',
                                                                    state: {
                                                                        AthleteId: value.id
                                                                     }}}>
                                                                        <div style={{color:'black',marginTop:'2px',padding:'5px 0px 0px 2px',display:'inline-flex'}}>
                                                                        <p style={{marginTop:'2px'}}>{context.dictionary.Plan}</p>
                                                                        <FaHammer style={{marginTop:'2px',marginLeft:'5px',width:'25px',height:'25px'}}/>                                                                     
                                                                        </div>
                                                            </Link>
                                                    </Grid>
                                                    <Grid item xs={3} >
                                                            <Link  to={{
                                                                    pathname: '/trainingplan/3days',
                                                                    state: {
                                                                        AthleteId: value.id
                                                                     }}}>
                                                                        <div style={{color:'black',marginTop:'2px',padding:'5px 0px 0px 2px',display:'inline-flex'}}>
                                                                        <p style={{marginTop:'2px'}}>{context.dictionary.Progress}</p>
                                                                        <AiOutlineLineChart style={{marginTop:'2px',marginLeft:'5px',width:'25px',height:'25px'}} />                                                                    
                                                                        </div>
                                                                </Link>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                       <Typography component='h6' display='inline' >
                                                            <BsTable  style={{marginTop:'2px',marginRight:'5px',width:'15px',height:'15px'}}/>
                                                            {context.dictionary.MesocyclePhase}: {getRomanNumber(value.mikrocykl)}
                                                       </Typography>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                )                               
                            })
                        }                       
                    </Grid>              
            </div>
        )
    }
   
export default Pupils;