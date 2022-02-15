import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react';
import { ServerContext } from './../observables/Server';

import Logo from './Logo';

import { ToggleButtonGroup, ToggleButton, Box, Grid, Button, ButtonGroup, Snackbar, Alert, Card, CardContent, Typography, IconButton, FormControl, Select, MenuItem, TextField, Tabs, Tab, Switch } from '@mui/material';
import { DatePicker } from '@mui/lab';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { TabPanel, a11yProps } from './TabPanel';

var tabId = "control-tab";

const Controls = observer(() => {
    const server = useContext(ServerContext);
    const [tabIndex, setTabIndex] = React.useState(0);
    const [plotIndex, setPlotIndex] = React.useState(0);

    const handleUserChange = (event) => {
        const value = event.target.value;
        if (value == '')
            server.selectedUser = '';
        if (value < server.users.length)
            server.selectedUser = value;
        else {
            server.selectedUser = '';
        }

        if (server.connected) {
            server.fetchUserDevices();
        }
    }
    const handleDeviceChange = (event) => {
        const value = event.target.value;
        if (value === '')
            server.selectedUser = '';
        if (value <= server.users.length)
            server.selectedDevice = value;
        else
            server.selectedDevice = '';

        if (server.connected && !(server.selectedDevice === '')) {
            server.fetchDevicePositions();
        }
    }
    const handleStartDateChange = (value) => {
        server.startDate = value;
        if (server.connected && !(server.selectedDevice === '')) {
            server.fetchDevicePositions();
        }
    }
    const handleEndDateChange = (value) => {
        server.endDate = value;
        if (server.connected && !(server.selectedDevice === '')) {
            server.fetchDevicePositions();
        }
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
    }
    const handleSnackClose = (event) => {
        server.closeSnack();
    }
    const changePlot = (id) => {
        console.log(id);
        if( !server.connected ) {
            server.openSnack("Not connected to a Traccar server.", "error");
        }

        if ( server.plotType != id ) {
            server.plotType = id;
        }
    }

    return (
        <Box className="Controls" sx={{ width: 550, position: "absolute", top: 16, right: 16 }}>
                <Card>
                    <CardContent>
                        <Box direction="row" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'start', mx: '1em' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Logo style={{ height: '3em' }} />
                            </Box>
                            <Box>
                                <IconButton aria-label="menu">
                                    <MenuOpenIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </CardContent>
                    <CardContent>
                        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Control Tabs" variant="fullWidth" centered>
                            <Tab label="Server" {...a11yProps(0, tabId)} />
                            <Tab label="Visualize" {...a11yProps(1, tabId)}/>
                        </Tabs>

                        {/* Server Tab */}
                        <TabPanel value={tabIndex} index={0} id={tabId}>
                            <CardContent>
                                <Grid container rowSpacing={4} columnSpacing={8}>
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>
                                        <FormControl fullWidth>
                                            <Typography variant="body2" color="text.secondary">Username</Typography>
                                            <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">Traccar username to login</Typography>
                                            <TextField fullWidth
                                                id="username-input"
                                                value={server.username}
                                                onChange={() => handleUsernameChange()}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>

                                        <FormControl fullWidth>
                                            <Typography variant="body2" color="text.secondary">Password</Typography>
                                            <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">Traccar password to login</Typography>
                                            <TextField fullWidth
                                                id="password-input"
                                                value={server.password}
                                                onChange={() => handlePasswordChange()}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>
                                        <Typography variant="body2" color="text.secondary">Instance</Typography>
                                        <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">Traccar instance to login onto</Typography>
                                        <TextField fullWidth
                                            id="url-input"
                                            value={server.url}
                                            onChange={handleUrlChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>
                                        <Typography variant="body2" color="text.secondary">Use HTTPS</Typography>
                                        <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">Use HTTPS to talk with the server</Typography>
                                        <Switch checked={server.useHttps} onChange={handleUseHttpsChange} name={server.useHttps ? "HTTPS" : "HTTP"} inputProps={{ 'aria-label': 'controlled' }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ButtonGroup sx={{ width: "100%" }} variant="text" aria-label="text button group">
                                            <Button sx={{ width: "100%" }} onClick={async () => server.connectAndFetch()}>Connect</Button>
                                            <Button sx={{ width: "100%" }} onClick={() => server.reset()}>Reset</Button>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </TabPanel>

                        {/* Visualize Tab */}
                        <TabPanel value={tabIndex} index={1} id={tabId}>
                            <CardContent>
                                <Grid container rowSpacing={4} columnSpacing={8}>
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>
                                        <FormControl fullWidth>
                                            <Typography variant="body2" color="text.secondary">User</Typography>
                                            <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">User for queried locations</Typography>
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
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>
                                        <FormControl fullWidth>
                                            <Typography variant="body2" color="text.secondary">Device</Typography>
                                            <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">Device owned by this user</Typography>
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
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>
                                        <FormControl fullWidth>
                                            <Typography variant="body2" color="text.secondary">Start Date</Typography>
                                            <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">Start of the interval to query</Typography>
                                            <DatePicker
                                                id="start-date"
                                                value={server.startDate}
                                                onChange={handleStartDateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sx={{ textAlign: 'start' }}>
                                        <FormControl fullWidth>
                                            <Typography variant="body2" color="text.secondary">End Date</Typography>
                                            <Typography sx={{ mb: 2 }} variant="caption" color="text.secondary">End of the interval to query</Typography>
                                            <DatePicker
                                                id="end-date"
                                                value={server.endDate}
                                                onChange={handleEndDateChange}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">Location Representation</Typography>
                                        <Typography variant="caption" color="text.secondary">Choose how location data is displayed on the map</Typography>

                                        <ToggleButtonGroup
                                        sx={{ width: "100%", mt: 2 }}
                                        color="primary"
                                        value={server.plotType}
                                        exclusive
                                        >
                                            <ToggleButton sx={{ width: "100%" }} onClick={() => changePlot(0)} value={0}>Dots</ToggleButton>
                                            <ToggleButton sx={{ width: "100%" }} onClick={() => changePlot(1)} value={1}>Lines</ToggleButton>
                                            <ToggleButton sx={{ width: "100%" }} onClick={() => changePlot(2)} value={2}>Heatmap</ToggleButton>
                                        </ToggleButtonGroup>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </TabPanel>
                    </CardContent>
                </Card>
                {/* Snackbar */}
                <Snackbar open={server.snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
                    <Alert onClose={handleSnackClose} severity={server.snackStyle} sx={{ width: '100%' }}>
                        {server.snackMessage}
                    </Alert>
                </Snackbar>
        </Box>
    );
});

export default Controls;