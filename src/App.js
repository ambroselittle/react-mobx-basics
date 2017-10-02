import React, { Component } from "react";
import { observer } from "mobx-react";
import logo from "./logo.svg";
import "./App.css";
import PersonDetails from "./components/strategy";
import PersonEditor from "./components/personEditor";

import PeopleStore from "./models/peopleStore";

@observer
class App extends Component {
  peopleStore = new PeopleStore();

  componentDidMount() {
    this.peopleStore.load();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React and MobX People Editor</h1>
        </header>
        <div>
          {this.peopleStore.people.map(p => (
            <PersonDetails
              key={p.name}
              person={p}
              pokeHandler={this.peopleStore.poke}
              editHandler={this.peopleStore.edit}
            />
          ))}
          {this.peopleStore.pokedPerson && (
            <h1>{this.peopleStore.pokedPerson.name} was poked!</h1>
          )}
          {this.peopleStore.editPerson && (
            <PersonEditor person={this.peopleStore.editPerson} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
