import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";


import "./App.css";
import Home from "./components/TastingSession/Home";
import CreateTastingSession from "./components/TastingSession/Form/CreateTastingSession";
import Menu from "./components/Menu";
import Wines from "./components/wines/wines";

import resolvers from "./graphql/resolvers";
import initialState from "./graphql/initialState";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const client = new ApolloClient({
  uri: "http://192.168.99.100:4466",
  clientState: {
    defaults: initialState,
    resolvers,
  },
});
class App extends Component {
  render() {
    return (
       <Router>
      <ApolloProvider client={client}>

        <div className="App">
          <Menu />
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/wines" component={Wines} />
          <Route path="/tastingSession" component={CreateTastingSession} />

          
        </div>
      </ApolloProvider>
       </Router>
    );
  }
}

function About() {
  return (
    <div className="flex">
      <h2 style={{marginTop:"40vh"}}>A code challenge from BlueCoding by Armando Roque</h2>
    </div>
  );
}

export default App;
