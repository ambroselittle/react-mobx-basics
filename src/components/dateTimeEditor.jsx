import React, { Component } from "react";
import { observable, observe } from "mobx";
import { observer } from "mobx-react";
import { BoundInput, BoundSelect } from "./editors";

export class DateTimeEditorStore {
  @observable hour;
  @observable minutes;
  @observable seconds;

  model;
  name;
  setter;
  getter;

  validateProps = (model, name) => {
    if (model == null) {
      throw "Model cannot be null.";
    }
    if (name == null || name === "") {
      throw "Name cannot be null or empty.";
    }

    if (!model.hasOwnProperty(name)) {
      throw `${name} is not a valid property on the given model.`;
    }

    const setter = `${name}_set`,
      getter = `${name}_get`;
    this.setter = setter in model ? setter : name;
    this.getter = getter in model ? getter : name;

    this.model = model;
    this.name = name;
  };

  set boundValue(newValue) {
    this.model[this.setter] = newValue;
  }
  get boundValue() {
    return this.model[this.getter];
  }

  updateBoundValue = change => {};

  addWatcher = prop => {
    this.toDispose.push(observe(this, prop, this.updateBoundValue));
  };

  parse = () => {
    const val = this.boundValue;
  };

  constructor(model, name) {
    this.validateProps(model, name);

    this.toDispose = [];
    this.addWatcher("hour");
    this.addWatcher("minutes");
    this.addWatcher("seconds");
  }
}

const timeTextStyles = {
  width: "24px",
  textAlign: "center"
};

const TimeTextEditor = observer(({ ...rest }) => (
  <span>
    <span> : </span>
    <BoundInput
      type="text"
      keyboard="number"
      maxLength="2"
      style={timeTextStyles}
      {...rest}
    />
  </span>
));

@observer
export class DateTimeEditor extends Component {
  onChange = evt => {
    evt.stopPropagation();
    evt.preventDefault();
  };
  render() {
    const { store } = this.props;

    return (
      <div>
        <div className="date-picker" />
        <div className="date-time">
          <BoundSelect model={store} name={"hour"}>
            {Array.from({ length: 24 }, (item, i) => {
              return {
                value: i,
                display:
                  i < 12
                    ? i === 0 ? "12a" : i + "a"
                    : i === 12 ? "12p" : i - 12 + "p"
              };
            }).map(hour => (
              <option key={hour.value} value={hour.value}>
                {hour.display}
              </option>
            ))}
          </BoundSelect>
          <TimeTextEditor
            placeholder="MM"
            className="minutes"
            model={store}
            name={"minutes"}
          />
          <TimeTextEditor
            placeholder="SS"
            classNames="seconds"
            model={store}
            name={"seconds"}
          />
        </div>
      </div>
    );
  }
}
export default DateTimeEditor;
