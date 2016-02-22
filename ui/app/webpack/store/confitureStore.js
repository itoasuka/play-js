import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' && __DEV__ ? window.devToolsExtension() : (f) => f
)(createStore);

function devConfigureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (__DEV__ && module.hot) {
    // Webpack のホットモジュール入れ替えが有効ならそれを使う
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

function prodConfigureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  return store;
}

const configureStore = (__DEV__) ? devConfigureStore : prodConfigureStore;

export default configureStore;

