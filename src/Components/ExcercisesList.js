import React, {Component} from 'react'
import {ContextConsumer, LanguageContext} from '../languages/LanguageContext'
import axios from 'axios'
import { withStyles } from "@material-ui/core/styles";
import '../Styles/ExercisesList.css';
import PropTypes from 'prop-types';
import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { TableFooter } from '@material-ui/core';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

axios.defaults.baseURL = 'http://localhost:5000/';

const styles = theme => ({
    table: {
        minWidth: 750, 
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
        backgroundColor: 'firebrick'
    }
});

const StyledTableSortLabel = withStyles({
  root: {
    '&:hover': {
        color: 'firebrick',
        opacity: 0.5,
      '& $icon': {
        opacity: 0.5,
      },
    },
    '&$active': {
      color: 'firebrick',
      '&& $icon': {
        opacity: 1,
        color: 'firebrick'
      },
    },
  },
  active: {},
  icon: {}
})(TableSortLabel);

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: 'rgb(32, 32, 31)',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
}))(TableRow);

const StyledTablePagination = withStyles({
    root: {
        color: 'white',
    },
    selectIcon: {
        color: 'white'
    },
    actions: {
        '&& .MuiIconButton-root.Mui-disabled':{
            color: 'gray'
        }
    }
})(TablePagination);

const StyledEditIcon = withStyles({
    root:{
        '&:hover':{
            color: 'firebrick',
            cursor: 'pointer'
        }
    }
})(EditIcon);

const StyledDeleteIcon = withStyles({
    root:{
        '&:hover':{
            color: 'firebrick',
            cursor: 'pointer'
        }
    }
})(DeleteIcon);

const EnhancedTableHead = (props) =>{
    const { data, order, orderBy, onRequestSort } = props;
    const languageContext = React.useContext(LanguageContext);
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {data.map((headCell) => {
                if(!headCell.hide){
                    return(
                        <StyledTableCell
                            key={headCell.field}
                            align={headCell.alignleft ? 'left' : 'center'}
                            sortDirection={orderBy === headCell.field ? order : false}
                            width={headCell.width}
                            >
                            <StyledTableSortLabel
                                active={orderBy === headCell.field}
                                direction={orderBy === headCell.field ? order : 'asc'}
                                onClick={createSortHandler(headCell.field)}
                                >
                                {headCell.label}
                            </StyledTableSortLabel>
                        </StyledTableCell>
                    )
                }
                else return null;
            })}
            <StyledTableCell>{languageContext.dictionary.Edit}</StyledTableCell>
            <StyledTableCell>{languageContext.dictionary.Delete}</StyledTableCell>
        </TableRow>
      </TableHead>
    );
}
  
EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const descendingComparator = (a, b, orderBy) =>{
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

const stableSort = (array, comparator) =>{
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const getComparator = (order, orderBy) =>{
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

const config = {
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        withCredentials: true,
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Access-Control-Expose-Headers': '*'
    }
}

class ExcercisesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data : {
                columns:[
                    {field:'id',hide:true},
                    {field:'excerciseName',headerName:'Nazwa ćwiczenia', width:300},
                    {field:'type',headerName:'Typ',width:200},
                    {field:'lift',headerName:'Rodzaj',width:200},
                    {field:'stickyPoint',headerName:'Słabe strony',width:300},
                    {field:'progresMethod',headerName:'Metoda Progresji',width:300},
                    {field:'sets',headerName:'Serie',hide:true,width:100},
                    {field:'reps',headerName:'Powtórzenia',hide:true,width:'100px'},

                ],
                columns2:[
                    {field:'id', hide:true},
                    {field:'excerciseName', alignleft: true, label:'Nazwa ćwiczenia', width: '28%'},
                    {field:'type', alignleft: false, label:'Typ', width: '18%'},
                    {field:'lift', alignleft: false, label:'Rodzaj', width:'14%'},
                    {field:'stickyPoint', alignleft: false, label:'Słabe strony', width:'14%'},
                    {field:'progresMethod',  alignleft: false,label:'Metoda Progresji', width:'18%'}
                ],
                rows:[]
            },
            page: 0,
            rowsPerPage: 5,
            order: 'asc',
            orderBy: '',
            selectedId: '',
            modalDelete: false
        }
    }

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        })
    };

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };
    
    handleChangeRowsPerPage = (event) => {
        this.setState({
            page: 0,
            rowsPerPage: +event.target.value
        })
    };

    async componentDidMount() {
        var token  = localStorage.getItem('token')

        if(token!==null) {
           await this.fetchData()
        }
    }

    fetchData = async () => {
        await axios.get('api/excercises/getall',config)
        .then(resp => {
            const {excercises} = resp.data
            localStorage.setItem('token',resp.headers['newtoken'])
            this.setState((prev) => {
                const {data} = prev
                data.rows = excercises
                return {data}
            })
        }).catch(err=> {
            console.log(err)
        })
    }

    EditClick = (event, exercise) =>{
        console.log('edit click',exercise)
        this.props.changeFormValuesFn(exercise);
    }

    DeleteClick = (event, id) =>{
        this.setState({
            modalDelete: true,
            selectedId: id
        })
    }

    handleCloseDelete = () =>{
        this.setState({
            modalDelete: false
        })
    }

    handleDeleteAction = async () =>{
        let success = false;
        console.log('chcesz usunac',this.state.selectedId)
        success = await this.deleteExcercise();
        if(success)
            this.handleCloseDelete();
    }

    deleteExcercise = async () =>{
        let result = false;
        await axios.delete('/api/excercises/delete/' + this.state.selectedId, config)
        .then((response)=>{
            localStorage.setItem('token',response.headers['newtoken'])
            alert("usunięto"); //temp
            result = true;
        })
        .catch(()=>{
            alert("Error - nie usunięto"); //temp
            result = false;
        })

        return result;
    }

    render () {
        const {data, page, rowsPerPage, order, orderBy} = this.state
        const {classes } = this.props

        return (
        <ContextConsumer>
            {
            language =>{
                return(
                    <div className='main_div'>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="customized table">
                                <EnhancedTableHead
                                    data={data.columns2}
                                    classes={classes}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={this.handleRequestSort}
                                    rowCount={data.rows.length}
                                />
                                <TableBody>
                                {stableSort(data.rows, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.excerciseName}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.type}</StyledTableCell>
                                        <StyledTableCell align="right">{row.lift}</StyledTableCell>
                                        <StyledTableCell align="right">{row.stickyPoint}</StyledTableCell>
                                        <StyledTableCell align="right">{row.progresMethod}</StyledTableCell>
                                        <StyledTableCell align="center"><StyledEditIcon onClick={ (event) => this.EditClick(event,row)}/></StyledTableCell>
                                        <StyledTableCell align="center"><StyledDeleteIcon onClick={ (event) => this.DeleteClick(event,row.id)}/></StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                </TableBody>
                                <TableFooter style={{backgroundColor: 'rgb(32, 32, 31)'}}>
                                    <TableRow>
                                        <TableCell colSpan={7} style={{padding: '0'}}>
                                            <StyledTablePagination
                                                className={classes.test}
                                                rowsPerPageOptions={[5, 10, 15]}
                                                component="div"
                                                count={data.rows.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onChangePage={this.handleChangePage}
                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            />
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                        <Dialog
                            PaperProps={{
                                style: {
                                backgroundColor: 'rgb(32, 32, 31)',
                                marginLeft: '15%',
                                color: 'white'
                                },
                            }}
                            open={this.state.modalDelete}
                            onBackdropClick={this.handleCloseDelete}
                            onEscapeKeyDown={this.handleCloseDelete}
                        >
                            <DialogTitle>{language.dictionary.ExcerciseDelete}</DialogTitle>
                            <DialogContent>
                                <DialogContentText
                                    style={{color: 'white'}}
                                    tabIndex={-1}
                                >
                                    {language.dictionary.AskConfirmDeleteExercise}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained"
                                        color="secondary"
                                        className={classes.submit} 
                                        onClick={this.handleDeleteAction}>
                                    {language.dictionary.Yes}
                                </Button>
                                <Button variant="contained"
                                        color="secondary"
                                        className={classes.submit} 
                                        onClick={this.handleCloseDelete}>
                                    {language.dictionary.No}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                )
            }
            }
        </ContextConsumer>
        )
    }
}

export default withStyles(styles, { withTheme: true })(ExcercisesList);