import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import './css/master.css';
import './css/classify-styles.css';
import Header from './components/layout/Header';
import Annotations from './App';
import Login from './components/accounts/Login';
import Register from './components/accounts/Register';
import PrivateRoute from './common';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>

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

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
