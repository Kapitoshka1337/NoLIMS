import React, {lazy} from 'react';
import { Switch } from 'react-router-dom'
import { connect } from 'react-redux';

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Equipment = lazy(() => import('../Equipment'/* webpackChunkName: "Home", webpackPreload: true  */))
const EquipmentView = lazy(() => import('../Equipment/view'/* webpackChunkName: "Home", webpackPreload: true  */))

import AppLayoutRoute from '../Layouts/AppLayout'
import Header from '../Header';
import Sider from '../Sider';
import { Layout } from '@douyinfe/semi-ui';

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Home extends React.PureComponent {

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { Content } = Layout;

    return (
      <Layout style={{height: '100%'}}>
          <Sider></Sider>
          <Layout>
              <Header></Header>
              <Content style={{ padding: '12px', backgroundColor: 'var(--semi-color-bg-0)'}}>
                <Switch>
                  {/* Оборудование */}
                  <AppLayoutRoute path='/equipment/view' component={EquipmentView} />
                  <AppLayoutRoute exac path='/equipment' component={Equipment} />
                </Switch>
              </Content>
          </Layout>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
