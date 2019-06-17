import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Index from "./pages/index"
import Header from "./components/header"
import { initializeIcons } from '@uifabric/icons';
import Unite from './pages/unite';
import Automate from './pages/automate';
initializeIcons();


export default class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Header/>
                    <Switch>
                        <Route exact path="/" component={Index} />
                        <Route exact path="/:unite" component={Unite} />
                        <Route exact path="/:unite/:automate" component={Automate} />
                    </Switch>
                </div>
            </Router>
        )
    }
}