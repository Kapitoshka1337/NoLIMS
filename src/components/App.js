import React, { lazy } from 'react'
import { connect } from 'react-redux'
import { Switch, Redirect } from 'react-router-dom'
import { store } from '../store'
import { push } from 'connected-react-router'
import { Spin } from '@douyinfe/semi-ui'
import { AbacProvider } from 'react-abac'

import { APP_LOAD, REDIRECT } from '../constants/actionTypes'
import agent from '../agent'

const Home = lazy(() => import('../components/Home'/* webpackChunkName: "Home", webpackPreload: true  */))
const Login = lazy(() => import('../components/Login'/* webpackChunkName: "Login", webpackPrefetch: true  */))

import AppLayoutRoute from './Layouts/AppLayout'
import LoginLayoutRoute from './Layouts/LoginLayout'

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    roles: state.common.roles,
    redirectTo: state.common.redirectTo,
    token: state.common.token
  }
}

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, roles, token) =>
    dispatch({ type: APP_LOAD, payload, roles, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
})

// const rules = {
//   ['ADMIN']: {
//       ['EDIT_POST']: true,
//   },
//   ['USER']: {
//       // an abac rule
//       // user can only edit the post if it is the owner of it
//       ['EDIT_POST']: true,
//   },
// };

class App extends React.PureComponent {

  constructor (props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.redirectTo && this.props.redirectTo !== prevProps.redirectTo) {
      // this.context.router.replace(this.props.redirectTo);
      store.dispatch(push(this.props.redirectTo))
      this.props.onRedirect()
    }
  }

  async componentDidMount () {
    const token = window.localStorage.getItem('jwt')
    let info, roles;

    if (token) {
      agent.setToken(token)
      roles = await agent.Auth.roles();
      info = await agent.Auth.current();
    }
    
    this.props.onLoad(info, roles, token)
    this.setState({loading: false});
  }

  render ()
  {
    if (this.state.loading || typeof(this.props.appLoaded) == 'undefined') return (
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
    );

    if (this.props.appLoaded && (this.props.currentUser != null || this.props.token != null))
    {
      return (
        <AbacProvider rules={this.props.roles} user={this.props.currentUser} roles={this.props.currentUser.roles} permissions={this.props.currentUser.permissions}>
          <Switch>
            <LoginLayoutRoute exact path='/login' component={Login} />
            <AppLayoutRoute path='/' component={Home} />
          </Switch>
        </AbacProvider>
      );
    }

    return (
      <>
        <Redirect to="/login"/>
        <Switch>
          <LoginLayoutRoute path='/login' component={Login} />
        </Switch>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
