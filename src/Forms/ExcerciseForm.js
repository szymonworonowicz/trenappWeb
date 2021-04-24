import React,{useContext,useEffect,useState} from 'react';
import {LanguageContext} from '../languages/LanguageContext'
import PropTypes from 'prop-types';
import { Formik, Form,Field } from 'formik';
import axios from 'axios'
import { FormikTextField } from 'formik-material-fields';
import { TextField } from 'formik-material-ui';
import { Button,MenuItem, Select } from '@material-ui/core'
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import NumberInfoField from './NumberInfoField'

//const isObjectEmpty = obj => Object.keys(obj).length===0;
const isObjectEmpty = obj => {
    for (var key in obj){
        if (obj[key]!=="" && obj[key]!==0)
            return false;
    }
    return true;
}

const useStyles = makeStyles((theme) => ({
    formStyle: {
        marginBottom: '16px',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
    },
    submit: {
        marginTop: '32px' ,
        backgroundColor:'firebrick'
    },

})) 



function ExcerciseForm(props) {
    //Funkcyjny
    const context = useContext(LanguageContext)
    const [Muscle,setMuscle] = useState([])
    const { excercise , closeModalFn } = props;
    const types = [{value:'Squat',label:context.dictionary.Squad},{value:'Benchpress',label:context.dictionary.BenchPress},{value:'Deadlift',label:context.dictionary.Deadlift}
                    ,{value:'Bodybuilding',label:context.dictionary.Bodybuilding},{value:'Prehab',label:context.dictionary.Prehab},{value:'Core',label:context.dictionary.Core}]
    const progressMethod = [context.dictionary.ConstantWeight,context.dictionary.BodyWeight,context.dictionary.Band,context.dictionary.Kettle,context.dictionary.RampClosed]
    const stickySQBP=[context.dictionary.onTheBottom,context.dictionary.inTheMiddle,context.dictionary.onTop,context.dictionary.upperRidge]
    const stickyDL=[context.dictionary.onTheBottom,context.dictionary.underTheKnee,context.dictionary.behindTheKnee,context.dictionary.grip]
    const initialValues = {
        Id:excercise.id,
        excerciseName: excercise.excerciseName,
        type:excercise.type,
        lift: excercise.lift,
        stickyPoint: excercise.stickyPoint,
        progresMethod: excercise.progresMethod,
        sets: excercise.sets,
        reps:excercise.reps,
        description:excercise.description,
        Muscle:[],
        Variant:0
    };
    console.log(excercise)

    useEffect(() => {
        const config = {
            headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            withCredentials: true,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Access-Control-Expose-Headers': '*'
            },
        };
        if(Muscle.length === 0)
        axios.get('/api/excercises/getAllMuscle',config)
            .then(response => {
                localStorage.setItem('token',response.headers['newtoken'])
                const{data} = response.data
                setMuscle(data)
            })
    })


    const validationSchema = Yup.object().shape({
        excerciseName: Yup.string().required(context.dictionary.Required),
        type: Yup.string().required(context.dictionary.Required),
        lift: Yup.string(),
        stickyPoint: Yup.string(),
        progresMethod: Yup.string().required(context.dictionary.Required),
        sets: Yup.number().positive(context.dictionary.greaterThan0),
        reps: Yup.string(),
        description: Yup.string(),
        Muscle: Yup.array()
            .of(
                Yup.number()
            ),
        Variant:Yup.number()
    });

    const addExcercise = async (values) =>{
        const config = {
            headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            withCredentials: true,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Access-Control-Expose-Headers': '*'
            },
        };
        let result = false;
        await axios.post('/api/excercises/add', values, config)
        .then((response)=>{
            localStorage.setItem('token',response.headers['newtoken'])
            alert(context.dictionary.ExcerciseAdded); //temp
            result = true;
        })
        .catch(()=>{
            alert(context.dictionary.Error + " " + context.dictionary.ExcerciseNotAdded); //temp
            result = false;
        })

        return result;
    }

    const updateExcercise = async (values) =>{
        const config = {
            headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            withCredentials: true,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Access-Control-Expose-Headers': '*'
            },
        };
        let result = false;
        await axios.put('/api/excercises', values, config)
        .then((response)=>{
            localStorage.setItem('token',response.headers['newtoken'])
            alert(context.dictionary.ExcerciseEdited); //temp
            result = true;
        })
        .catch(()=>{
            alert(context.dictionary.Error + " " + context.dictionary.ExcerciseNotEdited); //temp
            result = false;
        })

        return result;
    }

    const handleSubmit = async (values) => {
        let success = false;
        console.log(excercise)
        if(isObjectEmpty(excercise)) {
            success = await addExcercise(values);
        } else {
            success = await updateExcercise(values);
        }
        if (success)
            closeModalFn();
    }
  
    const removePolishLetter = (str) => {
        return str
            .replace(/[ą]/g,"a")
            .replace(/[ó]/g,"o")
            .replace(/[ś]/g,"s")
            .replace(/[ę]/g,"e")
    }

    const classes = useStyles()
    
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={() =>  validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {formik => (
                <Form className={classes.formStyle}>
                    <FormikTextField
                        type="text"
                        id="excerciseName"
                        name="excerciseName"
                        label={context.dictionary.ExcerciseName}
                    />
                    <Field
                        component={TextField}
                        select
                        id="type"
                        name="type"
                        margin='normal'
                        label={context.dictionary.Type}
                        >
                        {
                            types.map((type,index) => {
                                return (
                                    <MenuItem
                                        key={`type${index}`}
                                        value={removePolishLetter(type.value)}>
                                            {type.label}
                                    </MenuItem>

                                )
                            })
                        }
                    </Field>
                    {formik.values.type==='Bodybuilding' && (
                        <Field
                            component={TextField}
                            select
                            name="Muscle"
                            id="Muscle"
                            SelectProps={{
                                multiple: true,
                              }}
                            >
                            {
                                Muscle.map(elem => {
                                    return (
                                        <MenuItem
                                            key={`muscle${elem.id}`}
                                            value={elem.id}
                                        >
                                            {elem.muscleName}
                                        </MenuItem>                                    
                                    )

                                })
                            }
                            
                        </Field>
                        // <SelectField
                        //     id="Muscle"
                        //     margin='normal'
                        //     name="Muscle"
                        //     options={Muscle}
                        //     values={formik.values.Muscle}
                        //     isMulti={true}
                        //     onChange={formik.setFieldValue}
                        //     onBlur={formik.setFieldTouched}
                        //     touched={formik.touched.fieldOfResearch}
                        //     error={formik.errors.fieldOfResearch}
                        //     isClearable={true}
                        //     backspaceRemovesValue={true}
                        //     />
                    )}
                    {(formik.values.type=== 'Squat'|| formik.values.type === 'Benchpress' || formik.values.type === 'Deadlift') &&                  ( 
                                                <Field
                                                component={TextField}
                                                select
                                                id="lift"
                                                name="lift"
                                                margin='normal'
                                                label={context.dictionary.Type}
                                                >
                                                <MenuItem value='Basic'>{context.dictionary.Basic}</MenuItem>
                                                <MenuItem value='Accesory'>{context.dictionary.Accessory}</MenuItem>
                                                <MenuItem value='Variant'>{context.dictionary.Variant}</MenuItem>
                                            </Field>)}
                    {((formik.values.type=== 'Squat' || formik.values.type === 'Benchpress') && formik.values.lift !=='Accesory' ) && (
                            <Field
                            component={TextField}
                            select
                            id="stickyPoint"
                            name="stickyPoint"
                            margin='normal'
                            label={context.dictionary.Weaknesses}
                            >
                            {
                                stickySQBP.map((type,index) => {
                                    return (
                                        <MenuItem
                                            key={`sticky${index}`}
                                            value={removePolishLetter(type)}>
                                                {type}
                                        </MenuItem>

                                    )
                                })
                            }
                        </Field>)}
                        {(( formik.values.type === 'Deadlift') && formik.values.lift ==='Variant' ) && (
                            <Field
                            component={TextField}
                            select
                            id="stickyPoint"
                            name="stickyPoint"
                            margin='normal'
                            label={context.dictionary.Weaknesses}
                            >
                            {
                                stickyDL.map((type,index) => {
                                    return (
                                        <MenuItem
                                            key={`sticky${index}`}
                                            value={removePolishLetter(type)}>
                                                {type}
                                        </MenuItem>

                                    )
                                })
                            }
                        </Field>)}
                        {((formik.values.type=== 'Deadlift' || formik.values.type=== 'Squat' || formik.values.type === 'Benchpress') && formik.values.lift !== 'Accesory' ) && (
                        //     <Field
                        //         component={<NumberFormat format="##" suffix=" %"/>}
                        //         id="Variant"
                        //         name="Variant"
                        //         margin='normal'
                        //         label={context.dictionary['Variant%']}
                        //     >
                        // </Field>
                        <NumberInfoField
                            placeholder={context.dictionary['Variant%']}
                            value={formik.values.Variant}
                            onValueChange={val => formik.setFieldValue("Variant",val.floatValue)}
                        />
                        )}

                    <Field
                        component={TextField}
                        select
                        id="progresMethod"
                        name="progresMethod"
                        margin='normal'
                        label={context.dictionary.ProgressionMethod}>
                        {
                            progressMethod.map((type,index) => {
                                return (
                                    <MenuItem
                                        key={`progress${index}`}
                                        value={type}>
                                            {type}
                                    </MenuItem>

                                )
                            })
                        }
                    </Field>
                    <FormikTextField
                        type='number'
                        id="sets"
                        name="sets"
                        label={context.dictionary.Sets}
                        margin="normal"
                    />
                    <FormikTextField
                        id="reps"
                        name="reps"
                        label={context.dictionary.Reps}
                        margin="normal"
                    />
                    <FormikTextField
                        id="description"
                        name="description"
                        label={context.dictionary.Description}
                        margin="normal"
                        multiline
                        rows={5}
                    />
                    <Button
                        className={classes.submit}
                        type="submit"
                        variant="contained"
                        color="secondary"
                        disabled={!formik.isValid}
                    >
                        {context.dictionary.Save}
                    </Button>
                </Form>
            )}
        </Formik>
    );
}

ExcerciseForm.propTypes = {
    closeModalFn: PropTypes.func.isRequired,
    excercise: PropTypes.shape({
        excerciseName: PropTypes.string,
        type:PropTypes.string,
        lift:PropTypes.string,
        stickyPoint: PropTypes.string,
        progresMethod: PropTypes.string,
        sets: PropTypes.number,
        reps:PropTypes.string,
        description: PropTypes.string,
        Muscle:PropTypes.array,
        Variant:PropTypes.number
    }),
};

// when we are adding a new movie we don't have to pass any props
ExcerciseForm.defaultProps = {
    excercise: {
        excerciseName: '',
        type:'',
        lift:'',
        stickyPoint: '',
        progresMethod: '',
        sets: 0,
        reps:'',
        description:'',
        Muscle:[],
        Variant:0
    },
};

export default ExcerciseForm;