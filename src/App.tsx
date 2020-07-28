import React from 'react';
import ReactDOM from 'react-dom';
import MyContentList from './pages/MyContentList/index';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/my-content-list">
          <MyContentList />
        </Route>
        <Route path="/">
          <Redirect to="/my-content-list" />
        </Route>
      </Switch>

    </HashRouter>
  );
}

export default App;
