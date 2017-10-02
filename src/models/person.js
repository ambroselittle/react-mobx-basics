import { observable, computed, action } from "mobx";

export default class Person {
  @observable type = "employee";
  @observable name = "";
  @observable belongsWith = "";

  @computed
  get isEmployee() {
    return this.type === "employee";
  }

  @action
  updateProperty = (name, value) => {
    this[name] = value;
  };
}
