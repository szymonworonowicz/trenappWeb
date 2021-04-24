import React ,{Component} from 'react';
import {ContextConsumer} from '../languages/LanguageContext'
import { Container, Typography, Fab, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { Add } from '@material-ui/icons';
import ExcerciseForm from '../Forms/ExcerciseForm'
import ExcercisesList from '../Components/ExcercisesList'

const isObjectEmpty = obj => Object.keys(obj).length === 0;

const styles = theme => ({
    fab: {
        position: 'fixed',
        top: '85vh',
        right: '2vw',
    },
    header : {
        padding: '24px 0',
        borderBottom: '1px solid #DDD',
        textTransform: 'uppercase',
        color:'white',
		marginLeft: '15%'
    }

})

const StyledFab = withStyles({
    secondary:{
        backgroundColor:'firebrick'
    }
})(Fab)

class ExcerciseView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            openModal:false,
            formInitValues:{}
        }
    }

    closeModal = () => {
		this.setState({
			openModal: false,
			formInitValues: {},
		});
	}

	openModal = (newExcercise = true) => {
		if(newExcercise) {
			this.setState({
				openModal: true,
				formInitValues: {}
			});
		} else {
			this.setState({
				openModal: true,
			});
		}
	}

    changeFormInitValues = newValues => {
		this.setState({
			formInitValues: newValues,
		});
		
		this.openModal(false);
	}

    render() {
        const {classes } = this.props
		return (
			<ContextConsumer>
				{
					language => {
						return (
							<>
								<Dialog
									open={this.state.openModal}
									maxWidth="sm"
									fullWidth={true}
									onBackdropClick={this.closeModal}
									onEscapeKeyDown={this.closeModal}
								>
									<DialogTitle>{isObjectEmpty(this.state.formInitValues) ? language.dictionary.ExcerciseAdd : language.dictionary.Edit}</DialogTitle>
									<DialogContent>
										<ExcerciseForm
											closeModalFn={this.closeModal}
											excercise={this.state.formInitValues}
										/>
									</DialogContent>
								</Dialog>
					
								<Container maxWidth="lg">
									<Typography variant="h4" component="h1" className={classes.header}>{language.dictionary.Excercises}</Typography>
					
									<ExcercisesList changeFormValuesFn={this.changeFormInitValues} />
					
									<StyledFab
										onClick={this.openModal}
										className={classes.fab} 
										color="secondary"
										aria-label="add"
									>
										<Add/>
									</StyledFab>
								</Container>
							</>
						)
					}
				}
			</ContextConsumer>
		);
	}

}

export default withStyles(styles,{withTheme:true})(ExcerciseView)