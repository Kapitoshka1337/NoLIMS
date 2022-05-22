import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import { store, history} from './store';
import ru_RU from '@douyinfe/semi-ui/lib/es/locale/source/ru_RU';
import { LocaleProvider, Spin } from '@douyinfe/semi-ui';

import App from './components/App';

ReactDOM.render((
  <LocaleProvider locale={ru_RU}>
    <Provider store={store}>
        <Suspense fallback={
          <Spin tip="Загрузка">
          <div
              style={{
                  border: '1px solid var(--semi-color-primary)',
                  borderRadius: '4px',
                  paddingLeft: '8px',
              }}
          >
          </div>
      </Spin>
        }>
          <ConnectedRouter history={history}>
            <Switch>
              <Route path="/" component={App} />
            </Switch>
          </ConnectedRouter>
        </Suspense>
    </Provider>
  </LocaleProvider>

), document.getElementById('root'));
