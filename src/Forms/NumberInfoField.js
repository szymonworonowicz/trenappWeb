import {useState,useContext} from 'react'
import NumberFormat from 'react-number-format';
import {LanguageContext} from '../languages/LanguageContext'


const NumberInfoField = (props) =>  {

    const context = useContext(LanguageContext)
    const [value,setValue] = useState('')
    
      return (
        <NumberFormat
          placeholder={context.dictionary['Variant%']}
          isNumericString={true}
          format='##%'
          value={value}
          onValueChange={vals => setValue(vals.formattedValue)}
          {...props}
        />
      );
    }
export default NumberInfoField;