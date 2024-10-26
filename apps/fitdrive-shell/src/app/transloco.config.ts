import { TranslocoConfig } from '@ngneat/transloco';

export const translocoConfiguration: TranslocoConfig = {
  availableLangs: ['en', 'es'], // add your available languages
  defaultLang: 'en', // set your default language
  fallbackLang: 'en', // set your fallback language
  reRenderOnLangChange: true, // enable re-render on language change
  prodMode: false, // set to true in production
};
