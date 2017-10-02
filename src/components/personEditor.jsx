import React, { Component } from "react";
import { observer } from "mobx-react";

@observer
export default class PersonEditor extends Component {
  propEdited = evt => {
    const { person } = this.props;
    person.updateProperty(evt.target.name, evt.target.value);
  };
  render() {
    const { person } = this.props;

    return (
      <div>
        <h3>Editing: {person.name}</h3>
        <div>
          Name:{" "}
          <input
            type="text"
            onChange={this.propEdited}
            name="name"
            value={person.name}
          />
        </div>
        <div>
          Belongs With:{" "}
          <input
            type="text"
            onChange={this.propEdited}
            name="belongsWith"
            value={person.belongsWith}
          />
        </div>
      </div>
    );
  }
}
