import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './lib/containers/App';
import configureStore from './lib/store/configureStore';
import './lib/utils/lens'
import './lib/utils/function'

import 'normalize.css/normalize.css';
import './index.css';

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
