import {observer} from 'mobx-react-lite'
import React, {useContext} from 'react';
import { ServerContext } from './../observables/Server';

import Logo from './Logo';

import {Container, Box, Grid, Button, ButtonGroup, Snackbar, Alert, Card, CardContent, Typography, IconButton, FormControl, Select, MenuItem, TextField, Tabs, Tab, Switch } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {TabPanel, a11yProps} from './TabPanel';

var tabId = "control-tab";

const Controls = observer(() => {
    const server = useContext(ServerContext);
    const [tabIndex, setTabIndex] = React.useState(0);

    const handleUserChange = (event) => {     
        const value = event.target.value;
        const loadDevices = ( value != server.selectedUser );
        if( value < server.users.length )
            server.selectedUser = value;
        else
        server.selectedUser = '';

        if(loadDevices) {
            server.clearDevices();
            server.fetchUserDevices();
        }

        console.log(`User: ${value} - ${ loadDevices ? 'changed' : 'same' }`);
    }
    const handleDeviceChange = (event) => {
        const value = event.target.value;
        if( value < server.users.length )
            server.selectedDevice = value;
        else
            server.selectedDevice = '';
    }
    const handleStartDateChange = (event) => {
        const value = event.target.value;
        server.startDate = value;
    }
    const handleEndDateChange = (event) => {
        const value = event.target.value;
        server.endDate = value;
    }

    const handleUrlChange = (event) => {
        const value = event.target.value;
        server.url = value;
    }
    const handleUsernameChange = (event) => {
        const value = event.target.value;
        server.username = value;
    }
    const handlePasswordChange = (event) => {
        const value = event.target.value;
        server.password = value;
    }
    const handleUseHttpsChange = (event) => {
        const value = event.target.checked;
        server.useHttps = value;
    }

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };
    const handleSnackClose = (event) => {
        server.closeSnack();
    }

    return (
    <Container maxWidth="sm">
        <Box className="Controls">
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Box direction="row" sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'start', mx: '1em'}}>
                        <Box sx={{flexGrow: 1}}>
                            <Logo style={{height: '3em'}}/>
                        </Box>
                        <Box>
                        <IconButton aria-label="menu">
                            <MenuOpenIcon  />
                        </IconButton>
                        </Box>
                    </Box>
                </CardContent>

                <CardContent>
                    <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Control Tabs" variant="fullWidth" centered>
                        <Tab label="Server" {...a11yProps(0, tabId)} />
                        <Tab label="Visualize" {...a11yProps(1, tabId)} disabled={!server.connected} />
                    </Tabs>

                    {/* Server Tab */}
                    <TabPanel value={tabIndex} index={0} id={tabId}>
                        <CardContent>
                            <Grid container rowSpacing={4} columnSpacing={8}>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                    <FormControl fullWidth>
                                        <Typography variant="body2" color="text.secondary">Username</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">Traccar username to login</Typography>
                                        <TextField fullWidth
                                            id="username-input"
                                            value={server.username}
                                            onChange={this.handleUsernameChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                    
                                    <FormControl fullWidth>
                                        <Typography variant="body2" color="text.secondary">Password</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">Traccar password to login</Typography>
                                        <TextField fullWidth
                                            id="password-input"
                                            value={server.password}
                                            onChange={this.handlePasswordChange}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                        <Typography variant="body2" color="text.secondary">Instance</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">Traccar instance to login onto</Typography>
                                        <TextField fullWidth
                                            id="url-input"
                                            value={server.url}
                                            onChange={handleUrlChange}
                                        />
                                </Grid>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                        <Typography variant="body2" color="text.secondary">Use HTTPS</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">Use HTTPS to talk with the server</Typography>
                                        <Switch checked={server.useHttps} onChange={handleUseHttpsChange} name={server.useHttps ? "HTTPS" : "HTTP"} inputProps={{ 'aria-label': 'controlled' }}/>
                                </Grid>
                            </Grid>
                            <Box sx={{mt: 4}}>
                                <ButtonGroup sx={{width: "100%"}} variant="text" aria-label="text button group">
                                    <Button sx={{width: "100%"}} onClick={async () => server.connectAndFetch() }>Connect</Button>
                                    <Button sx={{width: "100%"}} onClick={() => server.reset()}>Reset</Button>
                                </ButtonGroup>
                            </Box>
                        </CardContent>
                    </TabPanel>

                    {/* Visualize Tab */}
                    <TabPanel value={tabIndex} index={1} id={tabId}>
                        <CardContent>
                            <Grid container rowSpacing={4} columnSpacing={8}>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                    <FormControl fullWidth>
                                        <Typography variant="body2" color="text.secondary">User</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">User for queried locations</Typography>
                                        <Select
                                            id="user-select"
                                            value={server.selectedUser}
                                            onChange={handleUserChange}
                                        >
                                            {
                                                server.users.map((user, index) => <MenuItem key={`user-select-${user.id}`} value={index}>{user.name}</MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                    <FormControl fullWidth>
                                        <Typography variant="body2" color="text.secondary">Device</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">Device owned by this user</Typography>
                                        <Select
                                            id="device-select"
                                            value={server.selectedDevice}
                                            onChange={handleDeviceChange}
                                        >
                                        {
                                            server.devices.map((device, index) => <MenuItem key={`device-select-${device.id}`} value={index}>{device.name}</MenuItem>)
                                        }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                    <FormControl fullWidth>
                                        <Typography variant="body2" color="text.secondary">Start Date</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">Start of the interval to query</Typography>
                                        <TextField 
                                            id="start-date"
                                            type="date"
                                            defaultValue=""
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sx={{textAlign: 'start'}}>
                                    <FormControl fullWidth>
                                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                                        <Typography sx={{mb: 2}} variant="caption" color="text.secondary">End of the interval to query</Typography>
                                        <TextField
                                            id="end-date"
                                            type="date"
                                            defaultValue=""
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </TabPanel>
                </CardContent>
            </Card>
        </Box>

        {/* Snackbar */}
        <Snackbar open={server.snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
            <Alert onClose={handleSnackClose} severity={server.snackStyle} sx={{ width: '100%' }}>
                {server.snackMessage}
            </Alert>
        </Snackbar>
    </Container>
    );
});

export default Controls;