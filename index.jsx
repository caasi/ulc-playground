import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './lib/containers/App';

import parse from './lib/parse';

render(
  <Provider>
    <App name={parse()[1]} />
  </Provider>,
  document.getElementById('app')
);
