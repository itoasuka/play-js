import "babel-polyfill";
import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/confitureStore';
import Hello from './component/Hello.jsx';

export default function () {
  const store = configureStore();
  const main = (
    <Provider store={store}>
      <Hello />
    </Provider>
  );

  return main;
}

