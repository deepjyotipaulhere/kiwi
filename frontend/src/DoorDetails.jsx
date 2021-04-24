import { Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Chip, Container, Divider, FormControl, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Popover, TextField, Tooltip, Typography } from '@material-ui/core'
import { Build, Explore, LocationOn, MeetingRoom, Person, PersonAdd, PersonOutline, PersonOutlined, SettingsEthernet, VerifiedUser, VpnKey } from '@material-ui/icons'
import { Autocomplete, Skeleton } from '@material-ui/lab'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axiosClient from './axiosClient'

export default function DoorDetails() {
    let query = new URLSearchParams(useLocation().search)

    const [door, setDoor] = useState({})
    const [loading, setLoading] = useState(true)
    const [anchorEl, setAnchorEl] = useState(null)
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState('')

    const getDoorUsers = () => {
        axiosClient.get("getdoorusers/" + query.get('id')).then(response => {
            setDoor(response.data)
            setLoading(false)
        })
    }

    const getUsers = () => {
        axiosClient.get("getusers/" + query.get('id')).then(response => {
            setUsers(response.data)
        }).then(() => {
            console.log(users[0]);
            // setNewUser(users[0].id + "." + users[0].first_name + " " + users[0].last_name)

        })
    }

    useEffect(() => {
        getDoorUsers()
        getUsers()
        setNewUser(users[0])
    }, [])

    const addUser = () => {
        axiosClient.post("adddooruser", {
            door_id: query.get('id'),
            user_id: newUser.id
        }).then(response => {
            getDoorUsers()
            getUsers()
            setNewUser(users[0])
            setAnchorEl(null)
        })
    }

    return (
        <div>
            <Container>
                {!loading && <Tooltip title="Sensor UUID"><Chip
                    avatar={<VpnKey />}
                    label={door.sensor_uuid}
                    color="primary"
                    style={{ float: 'right' }}
                /></Tooltip>}
                <p style={{ margin: 0, marginTop: 20, textTransform: 'uppercase' }}>Door Details</p>
                {!loading && <h1 style={{ margin: 0 }}>{door.name}</h1>}
                <Divider />
                {
                    loading ? <><Skeleton /><Skeleton /><Skeleton /></> :
                        <>
                            <List>
                                <ListItem>
                                    <ListItemAvatar >
                                        <Avatar style={{ backgroundColor: 'dodgerblue' }}>
                                            <LocationOn />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Address" />
                                    <ListItemSecondaryAction>
                                        {[door.street, door.city, door.state, door.postal_code].join(", ")}
                                        {/* <h6 style={{ margin: 0, textAlign: 'right' }}>Last Sensor Communication</h6>
                            <p style={{ margin: 0, color: door.last_communication_time ? 'black' : 'gray', textAlign: 'right' }}>{door.last_communication_time || 'NA'}</p>
                        {door.last_communication_time && <p style={{ margin: 0, textAlign: 'right', color: 'grey', fontSize: 'smaller' }}>⏱ {moment(door.last_communication_time).fromNow()}</p>} */}
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar >
                                        <Avatar style={{ backgroundColor: 'dodgerblue' }}>
                                            <Explore />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Geolocation" />
                                    <ListItemSecondaryAction>
                                        {door.geolocation}
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar >
                                        <Avatar style={{ backgroundColor: 'dodgerblue' }}>
                                            <Build />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Installation Time" />
                                    <ListItemSecondaryAction>
                                        {door.installation_time}
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar >
                                        <Avatar style={{ backgroundColor: 'purple' }}>
                                            <SettingsEthernet />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Last Communication Time" />
                                    <ListItemSecondaryAction>
                                        {door.last_communication_time} <label style={{ color: 'gray' }}>({moment(door.last_communication_time).fromNow()})</label>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar >
                                        <Avatar style={{ backgroundColor: 'purple' }}>
                                            <SettingsEthernet />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Last Opening Time" />
                                    <ListItemSecondaryAction>
                                        {door.last_opening_time} <label style={{ color: 'gray' }}>({moment(door.last_opening_time).fromNow()})</label>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </List>
                            <Divider />
                            <p style={{ textTransform: 'uppercase' }}>Authorized Users for this door</p>
                            <Grid container spacing={3}>
                                {
                                    door.users.map((user, index) => (

                                        <Grid item>
                                            <Card>
                                                <CardHeader
                                                    avatar={
                                                        <Person fontSize='large' color='primary' />
                                                    }
                                                    action={
                                                        <Tooltip title="Authorized User"><VerifiedUser color='green' style={{ color: 'green' }} /></Tooltip>
                                                    }
                                                    title={<h3 style={{ margin: 0 }}>{user.first_name + " " + user.last_name}</h3>}
                                                    subheader={<a href={"mailto:" + user.email}>{user.email}</a>}
                                                />
                                                {/* <CardContent>
                                                    <Person fontSize='large' />
                                                    <Typography variant="h5" component="h2">{user.first_name + " " + user.last_name}</Typography>
                                                    <a href={"mailto:" + user.email}>{user.email}</a>
                                                </CardContent> */}
                                            </Card>
                                        </Grid>
                                    ))
                                }
                                <Grid item>
                                    <Card onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                                        <CardActionArea>
                                            <CardHeader
                                                avatar={
                                                    <PersonAdd fontSize='large' />
                                                }
                                                title={<h3 style={{ margin: 0 }}>Add User</h3>}
                                            />
                                        </CardActionArea>
                                    </Card>
                                    <Popover
                                        onClose={() => setAnchorEl(null)}
                                        open={Boolean(anchorEl)}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <Card>
                                            <CardHeader
                                                title={<h6 style={{ margin: 0 }}>Add User</h6>}
                                            />
                                            <CardContent>
                                                <FormControl>
                                                    <Autocomplete
                                                        options={users}
                                                        getOptionLabel={(option) => option.first_name + " " + option.last_name}
                                                        value={newUser}
                                                        onChange={(e, newVal) => {
                                                            console.log(newVal);
                                                            setNewUser(newVal)
                                                        }}
                                                        style={{ width: 300 }}
                                                        renderInput={(params) => <TextField {...params} label="Search Users" variant="outlined" size='small' />}
                                                    />
                                                    <Button variant='contained' color='primary' onClick={addUser}>Grant Access</Button>
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Popover>
                                </Grid>
                            </Grid>
                        </>
                }
            </Container>
        </div >
    )
}
