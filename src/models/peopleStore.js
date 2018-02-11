import { observable, action } from "mobx";
import Person from "./person";

export default class PeopleStore {
  @observable people = [];

  @observable pokedPerson;
  @observable editPerson;
  @observable today;

  @action
  poke = person => {
    this.pokedPerson = person;
  };

  @action
  edit = person => {
    this.editPerson = person;
  };

  @action
  load = () => {
    const employee = new Person();
    employee.type = "employee";
    employee.name = "John E. Smith";
    employee.belongsWith = "Jane Cooper";

    const client = new Person();
    client.type = "client";
    client.name = "Richard Ayoade";
    client.belongsWith = "John E. Smith";

    this.people = [employee, client];
  };
}
