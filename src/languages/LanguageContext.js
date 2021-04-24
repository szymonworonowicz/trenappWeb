import {createContext} from 'react'
import {languageList} from './LanguageOptions'

export let LanguageContext = createContext({
    userLanguage : 'PL',
    dictionary: languageList.PL
})

export const ContextConsumer = LanguageContext.Consumer
// export default LanguageContext