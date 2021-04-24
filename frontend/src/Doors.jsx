import { Avatar, Container, Divider, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import axiosClient from './axiosClient';
import { Skeleton } from '@material-ui/lab';
import { MeetingRoom, QueryBuilder } from '@material-ui/icons';
import moment from 'moment';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';


export default function Doors() {

    const [doors, setDoors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('getdoors').then(response => {
            setDoors(response.data)
            setLoading(false)
        })
    }, [])

    return (
        <div>
            <Container>
                <h1 style={{ margin: 0 }}>All Doors</h1>
                <Divider />
                {
                    loading ? <><Skeleton /><Skeleton /><Skeleton /></> :
                        <List>
                            {
                                doors.map((door, index) =>
                                    <>
                                        <ListItem button onClick={() => { }} component={Link} to={"/doordetails?id=" + door.doorid} key={index}>
                                            <ListItemAvatar >
                                                <Avatar style={{ backgroundColor: 'dodgerblue' }}>
                                                    <MeetingRoom />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={door.name} secondary={[door.street, door.city, door.state, door.postal_code].join(", ")} />
                                            <ListItemSecondaryAction>
                                                <h6 style={{ margin: 0, textAlign: 'right' }}>Last Sensor Communication</h6>
                                                <p style={{ margin: 0, color: door.last_communication_time ? 'black' : 'gray', textAlign: 'right' }}>{door.last_communication_time || 'NA'}</p>
                                                {door.last_communication_time && <p style={{ margin: 0, textAlign: 'right', color: 'grey', fontSize: 'smaller' }}>⏱ {moment(door.last_communication_time).fromNow()}</p>}
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </>
                                )
                            }
                        </List>
                }
            </Container>
        </div>
    )
}
