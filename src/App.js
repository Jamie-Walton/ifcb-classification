import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom"

import Header from './components/layout/Header';
import Annotations from './components/annotations/Annotations';
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import PrivateRoute from './components/common/PrivateRoute';

import { Provider } from 'react-redux';
import store from './store';

class App extends Component {
    componentDidMount() {
        
    }

    render() {
        return(
            <Provider store={store}>
                <Router>
                    <body>
                        <Header />
                        <main>
                            <div class="page">

                            <div class="content">
                                <Switch>
                                    <PrivateRoute exact path="/" component={Annotations} />
                                    <Route exact path="/register" component={Register} />
                                    <Route exact path="/login" component={Login} />
                                </Switch>
                            </div>

                            </div>
                        </main>

                        <footer>
                        </footer>
                    </body>
                </Router>
            </Provider>
        );
    }

}

export default App;