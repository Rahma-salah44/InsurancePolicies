import { PublicClientApplication, LogLevel } from '@azure/msal-browser';

const CLIENT_ID = process.env.REACT_APP_MSAL_CLIENT_ID;
const AUTHORITY  = process.env.REACT_APP_MSAL_AUTHORITY  || 'https://login.microsoftonline.com/common';
const REDIRECT   = process.env.REACT_APP_MSAL_REDIRECT_URI || window.location.origin;

export const msalConfig = {
  auth: {
    clientId:                CLIENT_ID,
    authority:               AUTHORITY,
    redirectUri:             REDIRECT,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation:       'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii) console.warn('[MSAL]', message);
      },
    },
  },
};

export const loginRequest = {
  scopes: [
    'openid',
    'profile',
    'email',
    `api://${CLIENT_ID}/access_as_user`,
  ],
};

export const msalInstance = new PublicClientApplication(msalConfig);
