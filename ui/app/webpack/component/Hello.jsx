import React from 'react';

import { greeting } from '../util.js';

export default class Hello extends React.Component {
  static get displayName() {
    return 'Hello';
  }

  constructor(props) {
    super(props);
    this.state = {greeting: 'おまちください'};
    this.promise = null;
  }

  componentDidMount() {
    this.promise = greeting().then((res) => {
      this.setState(res);
    }).catch((error) => {
      this.setState({greeting: error.body});
    }).finally(() => {
      this.promise = null;
    });
  }

  componentWillUnmount() {
    if (this.promise) {
      this.promise.cancel();
    }
  }

  render() {
    return (
      <div>{this.state.greeting}</div>
    );
  }
}
