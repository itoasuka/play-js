import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  return (__DEV__) ? (function () {
    const finalCreateStore = compose(
      applyMiddleware(thunk),
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : (f) => f
    )(createStore);

    const store = finalCreateStore(rootReducer, initialState);

    if (module.hot) {
      // Webpack のホットモジュール入れ替えが有効ならそれを使う
      module.hot.accept('../reducers', () => {
        const nextReducer = require('../reducers').default;
        store.replaceReducer(nextReducer);
      });
    }

    return store;
  }()) : (function () {
    const finalCreateStore = compose(
      applyMiddleware(thunk)
    )(createStore);

    const store = finalCreateStore(rootReducer, initialState);

    return store;
  }());
}

