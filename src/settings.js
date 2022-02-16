export const Settings = {
    url: process.env.REACT_APP_CONNECTION_URL,
    username: process.env.REACT_APP_CONNECTION_USERNAME ? process.env.REACT_APP_CONNECTION_USERNAME : '',
    password: process.env.REACT_APP_CONNECTION_PASSWORD ? process.env.REACT_APP_CONNECTION_PASSWORD : '',
    useHttps: process.env.REACT_APP_CONNECTION_USEHTTPS ? ( process.env.REACT_APP_CONNECTION_USEHTTPS.toLowerCase() === 'true' ) : false,
    connect: process.env.REACT_APP_CONNECTION_CONNECT ? process.env.REACT_APP_CONNECTION_CONNECT : false,

    defaultUser: process.env.REACT_APP_CONNECTION_DEFAULTUSER ? process.env.REACT_APP_CONNECTION_DEFAULTUSER : '',
    defaultDevice: process.env.REACT_APP_CONNECTION_DEFAULTDEVICE ? process.env.REACT_APP_CONNECTION_DEFAULTDEVICE : '',

    tabServer: process.env.REACT_APP_CONNECTION_TAB_SERVER ? process.env.REACT_APP_CONNECTION_TAB_SERVER : true,
    theme: process.env.REACT_APP_CONNECTION_THEME ? process.env.REACT_APP_CONNECTION_THEME : 'heatmap'
};