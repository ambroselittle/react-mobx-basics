import React, { Component } from "react";
import {
  action,
  observe,
  IValueDidChange,
  runInAction,
  observable,
  computed
} from "mobx";
import { observer } from "mobx-react";

export const UpdateModelEvents = {
  /** Update model upon change. */
  Change: 1,
  /** Update model when input loses focus. */
  Blur: 2
};

export const Keyboard = {
  NotSet: "text",
  Text: "text",
  Password: "password",
  Email: "email",
  Number: "text",
  Telephone: "tel"
};
@observer
export class BoundInput extends Component {
  input;
  @observable inputValue = "";

  constructor(props) {
    super(props);
    this.init(props);
  }

  init(props) {
    this.toDispose.push(
      // set up to observe the value of the model, in case it changes outside of user input (also gets initial value from it here)
      observe(
        props.model,
        props.name,
        change => {
          runInAction(() => {
            this.inputValue = this.props.formatDisplayValue
              ? this.props.formatDisplayValue(change.newValue)
              : change.newValue;
          });
        },
        true
      )
    );
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.model !== this.props.model ||
      newProps.name !== this.props.name
    ) {
      this.dispose(); // get rid of old observer
      this.init(newProps); // add new one
    }
  }

  get updateOn() {
    // gets set value or default..
    return this.props.updateOn || UpdateModelEvents.Change;
  }

  @action
  updateValue(value, currentEvent) {
    if (this.props.onUpdatingValue) {
      // give consumers chance to modify value
      value = this.props.onUpdatingValue(this.inputValue, value, currentEvent);
    }
    if (this.updateOn === currentEvent) {
      // only update the model when the event fired is what they want us to use when updating the model
      this.props.model[this.props.name] = value;
    } else {
      // remember we have an observer on the model, so it will update this.inputValue when we update the model, so we only need to directly update it if not updating the model
      this.inputValue = value;
    }
  }

  boundChange = evt => {
    this.updateValue(evt.currentTarget.value, UpdateModelEvents.Change);
    if (typeof this.props.onChange == "function") this.props.onChange(evt);
  };

  boundBlur = evt => {
    this.updateValue(evt.currentTarget.value, UpdateModelEvents.Blur);
    if (typeof this.props.onBlur == "function") this.props.onBlur(evt);
  };

  render() {
    let {
      model,
      name,
      className,
      type,
      keyboard = Keyboard.NotSet,
      id = name,
      defaultValue,
      value,
      updateOn,
      onUpdatingValue,
      formatDisplayValue,
      inputRef,
      ...rest
    } = this.props;
    value = this.inputValue; // override value prop with actual model value

    return (
      <input
        {...rest}
        id={id}
        type={type || keyboard}
        ref={inputRef}
        pattern={keyboard === Keyboard.Number ? "\\d*" : null}
        className={"form-control " + className}
        value={value == null ? "" : value}
        onChange={this.boundChange}
        onBlur={this.boundBlur}
      />
    );
  }

  componentWillUnmount() {
    this.dispose();
  }
}

@observer
export class BoundSelect extends Component {
  @action
  boundChange = evt => {
    const { model, name, onChange } = this.props;
    let value = evt.currentTarget.value;
    if (`${name}_set` in model) {
      model[`${name}_set`](value);
    } else if (`set_${name}` in model) {
      model[`set_${name}`](value);
    } else {
      model[name] = value;
    }
    if (typeof onChange == "function") onChange(evt);
  };

  render() {
    let {
      model,
      name,
      children,
      onChange,
      className,
      id,
      inputRef,
      value,
      ...rest
    } = this.props;
    id = id || name; // allows overriding if there are more than one on the page
    value = model[name]; // override value prop with actual model value

    return (
      <select
        {...rest}
        id={id}
        ref={inputRef}
        value={value == null ? "" : value}
        className={"form-control " + className}
        onChange={this.boundChange}
      >
        {children}
      </select>
    );
  }
}
