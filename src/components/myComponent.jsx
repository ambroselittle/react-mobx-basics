import React, { Component } from "react";

export default class MyComponent extends Component {
  render() {
    const { useYourImagination } = this.props;

    return <div>{useYourImagination}</div>;
  }
}
