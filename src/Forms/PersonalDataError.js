import React, {Component} from 'react';

import '../Styles/Errors.css';
export class PersonalDataError extends Component{
    

    render()
    {
        //const {values,errors} = this.state;
        let message;
        let min="";
        let max="";
        
        let comma="";
        const errors =this.props.error;
        console.log("error",this.props.error);
        if(errors==null)
        {
            return "";
        }
        
        let keys = Object.keys(errors);
        if(keys.includes("minimum"))
        {
            if(errors.minimum===false)
            {
            min = <div>liczba musi wynosić conajmniej {this.props.min}</div>
            }
        }
        if(keys.includes("maximum"))
        {
            if(errors.maximum===false)
            {
            max = <div>wartośc musi być mniejsza bądź równa {this.props.max}</div>
            }
        }
        /*
        if(keys.includes("sumlen"))
        {
            if(errors.sumlen==false)
            {
                sum = <div>zbyt dużo cyfr po przecinku</div>
            }
        }*/
        if(keys.includes("comma"))
        {
            if(errors.comma===false)
            {
                if(this.props.comma===0)
                {
                    comma =<div>liczba nie może zawierać ani jednej cyfry po przecinku</div>
                }else
                if(this.props.comma===1)
            comma = <div>liczba może zawierać co najwyżej {this.props.comma} cyfrę po przecinku</div>
            else if(this.props.comma<5)
            comma = <div>liczba może zawierać co najwyżej {this.props.comma} cyfry po przecinku</div>
            else
            comma = <div>liczba może zawierać co najwyżej {this.props.comma} cyfr po przecinku</div>
            }
        }
    message = <div class="error">{min}{max}{comma}</div>
    return (message)
    }
}
export default PersonalDataError;