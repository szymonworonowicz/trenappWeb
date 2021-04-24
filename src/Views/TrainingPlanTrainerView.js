import {useState} from 'react'

import {
    Grid,
    Button,
    Box,
    Dialog,
    DialogContent,
    DialogTitle
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import TrainingPlan3daysUser from '../Forms/TrainingPlan3daysUser'
import TrainingPlan3days from '../Forms/TrainingPlan3days'
import CreatePlanForm from '../Forms/CreatePlanForm'

const useStyles = makeStyles((theme) => ({
    button:{
        margin: '20px 10px 0px',
        backgroundColor: 'firebrick'
    },
}))

const TraininingPlanTrainerView = (props) => {

    const [editDialog,setEditDialog] = useState(false)
    const [editPlan,setEditPlan] = useState(false)

    const createPlanClick = () => {
        setEditDialog(true)
    }
    const closeEditModalFn = () => {
        setEditDialog(false)
    }

    const editPlanClick =() => {
        setEditPlan(true)
    }

    /*const clickPostPlan=() => {
    }*/

    let [postplan, doPostplan] = useState(0); //Dla testów
    postplan = (postplanF) => {
        postplanF()
    }
    //const {userid} = props
    let userid=13
    const classes = useStyles()

    //TODO dodac context
    return (
        <div>
            <Dialog
                open={editDialog}
                maxWidth="sm"
                fullWidth={true}
                onBackdropClick={closeEditModalFn}
                onEscapeKeyDown={closeEditModalFn}
            >
                <DialogTitle>Stworz plan</DialogTitle>
                <DialogContent>
                    <CreatePlanForm
                        closeModalFn = {closeEditModalFn}
                    />
                </DialogContent>
            </Dialog>
            <Grid container spacing={1} justify='space-between' alignItems='center'> 
            <Grid item xs={12}>
                <Box display="flex" justifyContent="center" >
                    <Button variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => editPlanClick()}
                            >
                        Edytuj plan
                    </Button>
                    <Button variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => createPlanClick()}
                            >
                        Stworz nowy plan
                    </Button>
                    {
                        editPlan === true ?
                        <Button variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={() => doPostplan(prev=>prev+1)}
                            >
                        Wyślij plan
                        </Button>
                    :
                        <Button variant="contained"
                            disabled="true"
                            color="secondary"
                            className={classes.button}
                            onClick={() => doPostplan(prev=>prev+1)}
                            >
                        Wyślij plan
                        </Button>
                    }
                </Box>
            </Grid>
            {
                editPlan === false ?
                <Grid item xs={12} >
                    <TrainingPlan3daysUser idFromProps={userid} />
                </Grid>
                :
                <Grid item xs={12} >
                    <TrainingPlan3days idFromProps={userid} postplan={postplan} />
                </Grid>
            }


        </Grid>
        </div>
    )
}


export default TraininingPlanTrainerView;