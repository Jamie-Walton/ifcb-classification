import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom"

import Annotations from './components/annotations/Annotations';
import Notebook from './components/annotations/Notebook';
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import PrivateRoute from './components/common/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return(
            <Provider store={store}>
                <Router>
                    <Switch>
                        <PrivateRoute exact path="/" component={Annotations} />
                        <PrivateRoute exact path="/notebook" component={Notebook} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                    </Switch>
                </Router>
            </Provider>
        );
    }

}

export default App;