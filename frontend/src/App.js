import { Avatar, Container, Divider, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import axiosClient from './axiosClient';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import moment from 'moment';
import Doors from './Doors';
import DoorDetails from './DoorDetails'


export default function App() {


  return (
    <div>
      <Router>
        <div>
          {/* <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav> */}

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/doordetails">
              <DoorDetails />
            </Route>
            <Route path="/">
              <Doors />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}
