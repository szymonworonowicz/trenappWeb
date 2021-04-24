import {useState} from 'react'
import PropTypes from 'prop-types';
import { Formik, Form,Field } from 'formik';
import * as Yup from 'yup';
import {Button,MenuItem} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import { FormikTextField } from 'formik-material-fields';
import { TextField  } from 'formik-material-ui';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker } from "formik-material-ui-pickers";
import { pl } from "date-fns/locale";

const useStyles = makeStyles((theme) => ({
    button:{
        margin: '20px 10px 0px',
        backgroundColor: 'firebrick'
    },
    formStyle: {
        marginBottom: '16px',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
    },
}))



const CreatePlanForm = (props) => {

    const {closeModalFn} = props

    const initialValues = {
        Name:'',
        Phase:'',
        Type:'',
        StartDate:new Date().toLocaleDateString()
    }
    const Phases = [
        {
            value:"intensyfikacja",
            label:'intensyfikacja'
        },
        {
            value:"akumulacja",
            label:'akumulacja'
        },
        {
            value:"peak",
            label:'peak'
        }
    ]
    const Types= [
        {
            value:"trzydniowy",
            label:'trzydniowy'
        },        
        {
            value:"czterodniowy",
            label:'czterodniowy'
        }
    ]
    const validationSchema = Yup.object().shape({
        Name:Yup.string(),
        Phase:Yup.string().required("Faza jest wymagana"),
        Type:Yup.string().required('typ planu jest wymagany'),
        StartDate:Yup.date()
        .min(new Date())
        .max(new Date("2050-01-01T00:00:00"))
        .required("Required"),
    })

    const handleSubmit = () => {

    }

    //TODO context
    const classes = useStyles()
    return (
        <Formik
            initialValues = {initialValues}
            onSubmit = {handleSubmit}
            validationSchema ={validationSchema}
            render = {({ 
                submitForm, 
                isSubmitting, 
                values, 
                setFieldValue, 
                isValid,
                handleChange, 
                handleBlur,
                 }) => (
                <Form className={classes.formStyle}>
                    <FormikTextField
                        type="text"
                        id="name"
                        name="name"
                        label="Nazwa planu"/>
                    <Field
                        component={TextField}
                        select
                        id="Phase"
                        name="Phase"
                        margin='normal'
                        label="Phase"
                        >
                        {
                            Phases.map((type,index) => {
                                return (
                                    <MenuItem
                                        key={`type${index}`}
                                        value={type.value}>
                                            {type.label}
                                    </MenuItem>

                                )
                            })
                        }
                    </Field>
                    <Field
                        component={TextField}
                        select
                        id="Type"
                        name="Type"
                        margin='normal'
                        label="Type"
                        >
                        {
                            Types.map((type,index) => {
                                return (
                                    <MenuItem
                                        key={`type${index}`}
                                        value={type.value}>
                                            {type.label}
                                    </MenuItem>

                                )
                            })
                        }
                        </Field>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
                            <Field
                            component={DatePicker}
                            id="time"
                            name="time"
                            margin="normal"
                            format="dd-MM-yyyy"
                            label="Data"
                            />
                        </MuiPickersUtilsProvider>
                    <Button
                        className={classes.button}
                        type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={!isValid}
                    >
                        Przejdz dalej
                    </Button>
                </Form>
            )}
        />
    )

}

CreatePlanForm.propTypes = {
    closeModalFn: PropTypes.func.isRequired,
}

export default CreatePlanForm;

