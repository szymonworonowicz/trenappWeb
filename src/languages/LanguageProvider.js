import {useState} from  'react'
import {LanguageContext} from './LanguageContext'
import {languageList, languageOptions} from './LanguageOptions'

const LanguageProvider = ({children}) => {

    const defaultLanguage = window.localStorage.getItem('rcml-lang')
    const [userLanguage,setUserLanguage] = useState(defaultLanguage || 'PL')

    const provider = {
        userLanguage,
        dictionary:languageList[userLanguage],
        userLanguageChange: selected => {
            const newLanguage = languageOptions[selected] ? selected : 'PL'
            setUserLanguage(newLanguage);
            window.localStorage.setItem('rcml-lang', newLanguage);
        }
    }

    return (
        <LanguageContext.Provider value={provider}>
            {children}
        </LanguageContext.Provider>
    )
}

export default LanguageProvider;