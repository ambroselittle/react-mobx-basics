import React, { Component } from "react";
import { observer } from "mobx-react";

const Employee = observer(({ person }) => (
  <div>
    <div>{person.name}</div>
    <div>Manager: {person.belongsWith}</div>
  </div>
));

const Client = observer(({ person }) => (
  <div>
    <div>{person.name}</div>
    <div>Account Exec: {person.belongsWith}</div>
  </div>
));

const persons = {
  employee: Employee,
  client: Client
};

export default class PersonDetail extends Component {
  pokeClicked = evt => {
    const { pokeHandler, person } = this.props;
    if (pokeHandler) {
      pokeHandler(person);
    }
  };
  editClicked = evt => {
    const { editHandler, person } = this.props;
    if (editHandler) {
      editHandler(person);
    }
  };
  render() {
    const { person } = this.props,
      PersonComponet = persons[person.type];

    return (
      <div style={{ margin: "10px" }}>
        <PersonComponet person={person} />
        <button onClick={this.pokeClicked}>Poke this Person</button>
        <button onClick={this.editClicked}>Edit this Person</button>
      </div>
    );
  }
}
