import React from 'react';
import superagent from 'superagent';

import { greeting } from '../util.js';

export default class Hello extends React.Component {
  static get displayName() {
    return 'Hello';
  }

  constructor(props) {
    super(props);
    this.state = {greeting: 'おまちください'};
  }

  componentDidMount() {
    greeting().then((res) => {
      this.setState(res);
    });
  }

  componentWillUnmount() {
    superagent.abort();
  }

  render() {
    return (
      <div>{this.state.greeting}</div>
    );
  }
}
