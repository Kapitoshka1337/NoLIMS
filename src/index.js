import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React, { Suspense } from 'react';
import { store, history} from './store';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import ru_RU from '@douyinfe/semi-ui/lib/es/locale/source/ru_RU';
import { LocaleProvider } from '@douyinfe/semi-ui';

import App from './components/App';

ReactDOM.render((
  <LocaleProvider locale={ru_RU}>
    <Provider store={store}>
        <Suspense fallback={<p>Application is loading</p>}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" component={App} />
            </Switch>
          </ConnectedRouter>
        </Suspense>
    </Provider>
  </LocaleProvider>

), document.getElementById('root'));
