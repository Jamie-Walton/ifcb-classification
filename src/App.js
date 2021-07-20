import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import Header from './components/layout/Header';
import Annotations from './components/annotations/Annotations';
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import PrivateRoute from './common';

class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return(
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
        );
    }

}