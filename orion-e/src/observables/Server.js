// MobX
import {createContext} from 'react';
import { makeAutoObservable } from "mobx";
import axios from 'axios';

export class Server {
    url = "demo3.traccar.org"
    username = "manuel@felines.space"
    password = "manuel"
    useHttps = true

    connected = false
    userId = null
    userName = ""
    userIsAdmin = false

    snackOpen = false
    snackMessage = ""
    snackStyle = "info"

    server = null;
    users = []
    selectedUser = '';
    devices = []
    selectedDevice = '';
    startDate = null
    endDate = null

    constructor () {
        makeAutoObservable(this);
    }

    /*
    ** Getter and Setters
    */

    get url() { return this._url; } set url(newValue) { this._url = newValue.trim(); }
    get username() { return this._username; } set username(newValue) { this._username = newValue.trim(); }
    get password() { return this._password; } set password(newValue) { this._password = newValue.trim(); }
    get useHttps() { return this._useHttps; } set useHttps(newValue) { this._useHttps = newValue; }
    
    get connected() { return this._connected; } set connected(newValue) { this._connected = newValue; }
    get userId() { return this._userId; } set userId(newValue) { this._userId = newValue; }
    get userName() { return this._userName; } set userName(newValue) { this._userName = newValue; }
    get userIsAdmin() { return this._userIsAdmin; } set userIsAdmin(newValue) { this._userIsAdmin = newValue; }

        get snackOpen() { return this._snackOpen; } set snackOpen(newValue) { this._snackOpen = newValue; }
    get snackMessage() { return this._snackMessage; } set snackMessage(newValue) { this._snackMessage = newValue; }
    get snackStyle() { return this._snackStyle; } set snackStyle(newValue) { 
        this._snackStyle = newValue; 
        switch(newValue) {
            case "success":
                return "success";
                break;
            case "warning":
                return "warning";
                break;
            case "info":
                return "info";
                break;
            default:
                return "info"
        }
    }

    get selectedUser() { return this._selectedUser; } set selectedUser(newValue) { this._selectedUser = newValue.trim(); }
    get selectedDevice() { return this._selectedDevice; } set selectedDevice(newValue) { this._selectedDevice = newValue.trim(); }
    get startDate() { return this._startDate; } set startDate(newValue) { this._startDate = newValue; }
    get endDate() { return this._endDate; } set endDate(newValue) { this._endDate = newValue; }

    /*
    ** Methods
    */

    reset = () => {
        this.url = "demo4.traccar.org";
        this.username = "manuel@felines.space";
        this.password = "manuel";
        this.useHttps = true;
        this.successful = false;
        this.server = null;
        this.users = [];
        this.selectedUser = '';
        this.devices = [];
        this.selectedDevice = '';
        this.startDate = null;
        this.endDate = null;
    }

    buildQuery = (path) => { return `${this.useHttps ? 'https' : 'http' }://${this.url}/api/${path}` }

    openSnack = (message, style = "info") => {
        this.snackStyle = style;
        this.snackMessage = message;
        this.snackOpen = true;
    }

    closeSnack = () => {
        this.snackOpen = false;
        this.snackMessage = "";
        this.snackStyle = "info";
    }

    clearDevices = () => {
        this.devices = [];
    }

    getSelectedUser = () => {
        return this.users[ this.selectedUser ];
    }

    connect = () => {
        this.connected = false;
        return axios
            .get(this.buildQuery('server'), {}, {auth: { username: this.username, password: this.password}})
            .catch((error) => {
                this.openSnack("Couldn't connect to Traccar server.", "error")
            })
            .then(response => {
                console.log(response);
                this.connected = true;
                this.openSnack("Successfully connected to Traccar server.", "success")
            })
            .then(response => axios
                    .post(this.buildQuery('session'), 
                        new URLSearchParams({ 
                            email: this.username, 
                            password: this.password
                        }), 
                        {
                            auth: { username: this.username, password: this.password},
                        }
                    )
                    .catch((error) => {
                        this.openSnack("Couldn't get user data.", "error")
                    })
                    .then(response => {
                        console.log(response);
                                                
                        this.userId = response.data.id;
                        this.userName = response.data.name;
                        this.userIsAdmin = response.data.administrator;
                    })
                );
    }

    fetchUsers = (handleSnackOpen) => {
        if( this.userIsAdmin )
            return axios
            .get(this.buildQuery('users'), {}, this.buildOpts())
            .catch((error) => {
                this.openSnack("Couldn't fetch user list.", "error")
            })
            .then(response => {
                console.log(response);
                this.users = response.data.map(user => {
                    return {
                        id: user.id,
                        name: user.name
                    };
                });
            });
        else
            this.users.push({
                id: this.userId,
                name: this.userName
            });
    }

    fetchUserDevices = (handleSnackOpen) => {
        return axios
        .get(this.buildQuery('devices'), {userId: this.getSelectedUser()}, this.buildOpts())
        .catch((error) => {
            this.openSnack("Couldn't fetch devices list.", "error")
        })
        .then(response => {
            console.log(response);
            this.devices = response.data.map(device => {
                return {
                    id: device.id,
                    name: device.name
                };
            });
        });
    }

    connectAndFetch = async () => {
        if ( !this.connected )
            await this.connect();

        this.fetchUsers();        
    }    
}

export const ServerContext = createContext(Server);