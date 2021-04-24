import React, { useState, useContext } from 'react';
import {LanguageContext} from '../languages/LanguageContext'
import { makeStyles } from "@material-ui/core/styles";
import {Typography, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import {StyledPagination, StyledPaginationItem} from '../Components/StyledComponents'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';


const styles = makeStyles ((theme) => ({
    header : {
        padding: '24px 0',
        borderBottom: '1px solid #DDD',
        textTransform: 'uppercase',
        color:'white',
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%'
    },
    icon: {
        color: 'firebrick',
        verticalAlign: 'middle'
    },
    card: {
        width: '50%',
        backgroundColor: 'white',
        margin: 'auto',
        marginTop: 10,
        borderRadius: 10
    },
    not_received:{
        backgroundColor: '#ffe6e6'
    },
    inline_div: {
        verticalAlign: 'middle',
        marginLeft: 10,
    },
    inline_p: {
        marginLeft: 5,
        display: 'inline',
        verticalAlign: 'middle',
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
        backgroundColor: 'firebrick'
    }
}))

const Notifications = () =>{

    const [notifications, setNotifications] = useState([
        {
            id: 0,
            content:    `1 - Cras mattis consectetur purus sit amet fermentum.
                        Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                        Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
            received: false
        },
        {
            id: 1,
            content: '2- some very very very long text of message number 2',
            received: false
        },
        {
            id: 2,
            content:    `3- Cras mattis consectetur purus sit amet fermentum.
                        Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                        Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
            received: true
        },
        {
            id: 3,
            content: '4- some text of message number 4',
            received: false
        },
        {
            id: 4,
            content: '5 - some text text text text text text text text text of message number 5',
            received: false
        },
        {
            id: 5,
            content: '6 - some text of message message message message message message number 6',
            received: true
        },
        {
            id: 6,
            content: '7 - some text of message number 1',
            received: true
        }
    ])
    const context = useContext(LanguageContext)
    const [pageNotifications,setPage] = useState(notifications.slice(0,5));
    const pageSize = 5;
    const [pageNR,setPageNR] = useState(1);
    const pageCount = Math.ceil(notifications.length/pageSize);
    const [open, setOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState({});
    const classes = styles()

    const PaginationFun=(e,page)=>{
        let pageNotificationslocal=notifications.slice((page-1)*pageSize,page*pageSize);
        setPage(pageNotificationslocal);
        setPageNR(page);
        console.log(pageNotifications);
    }

    const handleClickOpen = (event,notification) => {
        setSelectedNotification(notification)
        setOpen(true);
    };

    const handleClose = (event, notification) => {
        if(notification !== 'backdropClick')
            notifications[notifications.findIndex(x => x.id === notification.id)].received = true
        setOpen(false);
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [open]);

    return(
        <div style={{marginTop: '2%', marginLeft: '15%',marginRight: '2%'}}>
            <Typography variant="h4" component="h1" className={classes.header}>{context.dictionary.Notifications}</Typography>
            <Grid container justify = "center" >
                <StyledPagination count={pageCount} showFirstButton showLastButton defaultPage={1} page={pageNR} 
                    onChange={(e,page)=>PaginationFun(e,page)}
                    renderItem={(item)=> 
                        <StyledPaginationItem {...item}/>}
                />
            </Grid>
            {pageNotifications.map((value,index)=>{
                return(
                    value.received ?
                    <Card className={classes.card} key={index}>
                        <CardActionArea onClick={(event) => handleClickOpen(event,value)}>
                            <CardContent>
                                <div className={classes.inline_div}>
                                    <NotificationsNoneIcon className={classes.icon} fontSize='large'/>
                                    <p className={classes.inline_p}>
                                        {value.content.length>40 ? 
                                            value.content.slice(0,40)+"..." : 
                                            value.content}
                                    </p>
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    :
                    <Card className={classes.card}>
                        <CardActionArea onClick={(event) => handleClickOpen(event,value)}>
                            <CardContent className={classes.not_received}>
                                <div className={classes.inline_div}>
                                    <NotificationsActiveIcon className={classes.icon} fontSize='large'/>
                                    <p className={classes.inline_p}>
                                        {value.content.length>40 ? 
                                            value.content.slice(0,40)+"..." : 
                                            value.content}
                                    </p>
                                </div>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                )
            })}
            <Dialog
                PaperProps={{
                    style: {
                      backgroundColor: 'rgb(32, 32, 31)',
                      marginLeft: '15%',
                      color: 'white'
                    },
                }}
                open={open}
                onClose={handleClose}
                scroll='paper'
            >
                <DialogTitle id="scroll-dialog-title">Title</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        style={{color: 'white'}}
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {selectedNotification.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained"
                            color="secondary"
                            className={classes.submit} 
                            onClick={(event) => handleClose(event, selectedNotification)}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Notifications;