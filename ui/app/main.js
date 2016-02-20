import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';

import './main.scss';

import Hello from './component/Hello.jsx';

ReactDOM.render(<Hello />, document.getElementById('greeting'));

