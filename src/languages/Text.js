import {useContext} from 'react'
import {LanguageContext} from './LanguageContext'

export function Text({ tid }) {
    const languageContext = useContext(LanguageContext);
  
    return languageContext.dictionary[tid] || tid;
  };