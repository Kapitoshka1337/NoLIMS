import agent from '../agent'
import React, { lazy } from 'react'
import { connect } from 'react-redux'
import { APP_LOAD, REDIRECT } from '../constants/actionTypes'
import { Switch, Redirect } from 'react-router-dom'
import { store } from '../store'
import { push } from 'connected-react-router'

const Home = lazy(() => import('../components/Home'/* webpackChunkName: "Home", webpackPreload: true  */))
const Login = lazy(() => import('../components/Login'/* webpackChunkName: "Login", webpackPrefetch: true  */))

import AppLayoutRoute from './Layouts/AppLayout'
import LoginLayoutRoute from './Layouts/LoginLayout'

const mapStateToProps = state => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
    token: state.common.token
  }
}

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: REDIRECT })
})

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

  componentDidMount () {
    const token = window.localStorage.getItem('jwt')
    
    if (token) {
      agent.setToken(token)
    }
    
    this.props.onLoad(agent.Auth.current(), token)
    this.setState({loading: false});
  }

  render ()
  {
    if (this.state.loading || typeof(this.props.appLoaded) == 'undefined') return <p>Application is loading</p>;

    if (this.props.appLoaded && (this.props.currentUser != null || this.props.token != null))
    {
      return (
          <Switch>
            <LoginLayoutRoute exact path='/login' component={Login} />
            <AppLayoutRoute path='/' component={Home} />
          </Switch>
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
