import React, { Component } from 'react';
import { withRouter } from "react-router";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Annotations from './components/annotations/Annotations';
import Notebook from './components/features/Notebook';
import Analysis from './components/features/Analysis';
import ClassDownload from './components/features/ClassDownload';
import Search from './components/features/Search';
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
                <BrowserRouter>
                    <Switch>
                        <PrivateRoute 
                            exact path="/classify/:timeseries/:file" 
                            key={window.location.pathname}
                            component={withRouter(Annotations)} />
                        <PrivateRoute 
                            exact path="/classify/:timeseries/:file/:target" 
                            key={window.location.pathname}
                            component={withRouter(Annotations)} />
                        <PrivateRoute exact path="/classify/" component={Annotations} />
                        <PrivateRoute exact path="/notebook/" component={Notebook} />
                        <PrivateRoute exact path="/analysis" component={Analysis} />
                        <PrivateRoute exact path="/analysis/classdownload" component={ClassDownload} />
                        <PrivateRoute exact path="/analysis/search" component={Search} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <PrivateRoute exact path="/" component={Annotations} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        );
    }

}

export default App;