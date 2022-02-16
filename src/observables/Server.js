// MobX
import {createContext} from 'react';
import { makeAutoObservable } from "mobx";
import axios from 'axios';
import moment from 'moment';

import { Settings } from './../settings';

export class Server {
    url = Settings.url
    username = Settings.username
    password = Settings.password
    useHttps = Settings.useHttps

    connected = false
    connecting = false
    userId = null
    userName = ""
    userIsAdmin = false

    snackOpen = false
    snackMessage = ""
    snackStyle = "info"
    
    plotType = 0;
    users = []
    selectedUser = Settings.defaultUser;
    devices = []
    selectedDevice = Settings.defaultDevice;
    startDate = moment().subtract(1, 'days').format();
    endDate = moment().add(1, 'days').format();
    positions = [];
    positionsChanged = false;

    constructor () {
        makeAutoObservable(this);
    }

    /*
    ** Getter and Setters
    */

    get url() { return this._url; } 
    set url(newValue) { this._url = newValue; }
    get username() { return this._username; } 
    set username(newValue) { this._username = newValue; }
    get password() { return this._password; } 
    set password(newValue) { this._password = newValue; }
    get useHttps() { return this._useHttps; } 
    set useHttps(newValue) { this._useHttps = newValue; }
    
    get connected() { return this._connected; } 
    set connected(newValue) { this._connected = newValue; }
    get connecting() { return this._connecting; } 
    set connecting(newValue) { this._connecting = newValue; }
    get userId() { return this._userId; } 
    set userId(newValue) { this._userId = newValue; }
    get userName() { return this._userName; } 
    set userName(newValue) { this._userName = newValue; }
    get userIsAdmin() { return this._userIsAdmin; } 
    set userIsAdmin(newValue) { this._userIsAdmin = newValue; }

    get snackOpen() { return this._snackOpen; } 
    set snackOpen(newValue) { this._snackOpen = newValue; }
    get snackMessage() { return this._snackMessage; } 
    set snackMessage(newValue) { this._snackMessage = newValue; }
    get snackStyle() { return this._snackStyle; } 
    set snackStyle(newValue) { 

        this._snackStyle = newValue; 
        switch(newValue) {
            case "success":
                return "success";
            case "warning":
                return "warning";
            case "info":
                return "info";
            default:
                return "info"
        }
    }
    get positionsChanged() { return this._positionsChanged; } 
    set positionsChanged(newValue) { this._positionsChanged = newValue; }

    get plotType() { return this._plotType; } 
    set plotType(newValue) { this._plotType = newValue; }
    get users() { return this._users; } 
    set users(newValue) { this._users = newValue; }
    get selectedUser() { 
        if( this.users.length == 0)
            return '';
        else
            return this._selectedUser; 
    } 
    set selectedUser(newValue) { this._selectedUser = newValue; }
    get devices() { return this._devices; } 
    set devices(newValue) { this._devices = newValue; }
    get selectedDevice() { 
        if( this.devices.length == 0)
            return '';
        else
            return this._selectedDevice; 
    } 
    set selectedDevice(newValue) { this._selectedDevice = newValue; }
    get startDate() { return this._startDate; } 
    set startDate(newValue) { this._startDate = newValue; }
    get endDate() { return this._endDate; } 
    set endDate(newValue) { this._endDate = newValue; }

    /*
    ** Methods
    */

    resetAll = () => {
        this.url = "demo4.traccar.org"
        this.username = "manuel@felines.space"
        this.password = "manuel"
        this.useHttps = true
    
        this.connected = false
        this.connecting = false
        this.userId = null
        this.userName = ""
        this.userIsAdmin = false
    
        this.snackOpen = false
        this.snackMessage = ""
        this.snackStyle = "info"
        
        this.plotType = 0;
        this.users = []
        this.selectedUser = '';
        this.devices = []
        this.selectedDevice = '';
        this.startDate = moment().subtract(1, 'days').format();
        this.endDate = moment().add(1, 'days').format();
        this.positions = [];
        this.positionsChanged = false;
    }

    resetQueried = () => {
        this.connected = false
        this.userId = null
        this.userName = ""
        this.userIsAdmin = false
    
        this.snackOpen = false
        this.snackMessage = ""
        this.snackStyle = "info"
        
        this.plotType = 0;
        this.users = []
        this.selectedUser = '';
        this.devices = []
        this.selectedDevice = '';
        this.positions = [];
        this.positionsChanged = false;
    }

    buildQuery = (path) => { 
        var safePath = path[0] === '/' ? path.slice(1) : path;
        return `${this.useHttps ? 'https' : 'http' }://${this.url}/api/${safePath}`;
}

    openSnack = async (message, style = "info") => {
        if(this.snackOpen) {
            this.snackOpen = false;
        }

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

    getSelectedDevice = () => {
        return this.devices[ this.selectedDevice ];
    }

    connect = () => {
        this.connected = false;
        return axios
            .get(this.buildQuery('server'), {}, {auth: { username: this.username, password: this.password}})
            .catch((error) => {
                this.openSnack("Couldn't connect to Traccar server.", "error")
            })
            .then(response => {
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
                        this.userId = response.data.id;
                        this.userName = response.data.name;
                        this.userIsAdmin = response.data.administrator;
                    })
                );
    }

    fetchUsers = () => {
        if( !this.connected ) {
            this.openSnack("Not connected to a Traccar server.", "error");
            return;
        }

        if( this.userIsAdmin )
            return axios
            .get(this.buildQuery('users'), {}, {auth: { username: this.username, password: this.password}})
            .catch((error) => {
                this.openSnack("Couldn't fetch user list.", "error")
            })
            .then(response => {
                this.users = response.data;
            });
        else
            this.users.push({
                id: this.userId,
                name: this.userName
            });
    }

    fetchUserDevices = () => {
        if( !this.connected ) {
            this.openSnack("Not connected to a Traccar server.", "error");
            return;
        }

        return axios({
            method: "get",
            url: `${this.buildQuery('/devices')}?userId=${this.getSelectedUser().id}`,
            auth: { username: this.username, password: this.password }
          })
        .catch((error) => {
            this.openSnack("Couldn't fetch devices list.", "error")
        })
        .then(response => {
            this.devices = response.data;
            this.openSnack(`Found ${ this.devices.length } devices`, "info")
        });
    }

    fetchDevicePositions = () => {
        if( !this.connected ) {
            this.openSnack("Not connected to a Traccar server.", "error");
            return;
        }
        
        var startDate = this.startDate != null ? '&from=' + moment(this.startDate).toISOString() : '';
        var endDate = this.endDate != null ? '&to=' + moment(this.endDate).toISOString() : '';
        return axios({
            method: "get",
            url: `${this.buildQuery('/positions')}?deviceId=${this.getSelectedDevice().id}${startDate}${endDate}`,
            auth: { username: this.username, password: this.password }
          })
        .catch((error) => {
            this.openSnack("Couldn't fetch devices list.", "error")
        })
        .then(response => {
            this.positions = response.data;
            this.positionsChanged = !this.positionsChanged;
            this.openSnack(`Found ${ this.positions.length } positions`, "info")
        });
    }

    connectAndFetch = async () => {
        this.resetQueried();

        await this.connect();
        this.connecting = false;
        
        if( this.connected )       
            this.fetchUsers();        
    }    
}

export const ServerContext = createContext(Server);