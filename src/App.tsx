import React from 'react';
import MyContentList from './pages/MyContentList/index';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/my-content-card">
          <MyContentList />
        </Route>
        <Route path="/my-content-list">
          <MyContentList />
        </Route>
        <Route path="/">
          <Redirect to="/my-content-card?layout=card" />
        </Route>
      </Switch>

    </HashRouter>
  );
}

export default App;
