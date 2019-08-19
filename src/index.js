import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from "react-intl";
import locale_en from "react-intl/locale-data/en";
import locale_ru from "react-intl/locale-data/ru";
import messages_en from "./translations/en.json";
import messages_ru from "./translations/ru.json";

import * as serviceWorker from './common/serviceWorker';

import App from './App';

const supportedLanguages = ['en', 'ru'];

const messages = {
  'en': messages_en,
  'ru': messages_ru,
};

function toSupportedLang(lang) {
  return supportedLanguages.indexOf(lang) >= 0 ? lang : 'en';
};
const language = toSupportedLang(localStorage.getItem('lang') || navigator.language.split(/[-_]/)[0]);  // language without region code

addLocaleData([...locale_en, ...locale_ru]);

ReactDOM.render(
  <IntlProvider locale={language} messages={messages[language]} supportedLanguages={supportedLanguages} >
    <App />
  </IntlProvider>,
  document.getElementById('root'));

serviceWorker.unregister();
