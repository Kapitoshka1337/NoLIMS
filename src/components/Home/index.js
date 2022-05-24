import React, {lazy} from 'react';
import { Switch } from 'react-router-dom'
import { connect } from 'react-redux';

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Equipment = lazy(() => import('../Equipment'/* webpackChunkName: "Home", webpackPreload: true  */))
const Base = lazy(() => import('../Base'/* webpackChunkName: "Home", webpackPreload: true  */))
const BaseDepartment = lazy(() => import('../Department/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const BaseDepartmentCard = lazy(() => import('../Department/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const BaseLocation = lazy(() => import('../Location/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const BaseLocationCard = lazy(() => import('../Location/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const DocumentKind = lazy(() => import('../DocumentKind/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const DocumentKindCard = lazy(() => import('../DocumentKind/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const EquipmentType = lazy(() => import('../EquipmentTypes/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const EquipmentTypeCard = lazy(() => import('../EquipmentTypes/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const Administrator = lazy(() => import('../Administrator'/* webpackChunkName: "Home", webpackPreload: true  */))
const AdministratorUser = lazy(() => import('../User/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const AdministratorUserCard = lazy(() => import('../User/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const AdministratorRole = lazy(() => import('../Roles/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const AdministratorRoleCard = lazy(() => import('../Roles/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const EquipmentView = lazy(() => import('../Equipment/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const EquipmentCard = lazy(() => import('../Equipment/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const ManufacturerView = lazy(() => import('../Manufacturer/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const ManufacturerViewCard = lazy(() => import('../Manufacturer/card'/* webpackChunkName: "Home", webpackPreload: true  */))
const VerificationsView = lazy(() => import('../Verifications/view'/* webpackChunkName: "Home", webpackPreload: true  */))
const ChecksView = lazy(() => import('../Checks/view'/* webpackChunkName: "Home", webpackPreload: true  */))

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
                  <AppLayoutRoute exac path='/equipment/checks/view' component={ChecksView} />
                  <AppLayoutRoute exac path='/equipment/verification/view' component={VerificationsView} />
                  <AppLayoutRoute exac path='/equipment/documentkind/view/:id' component={DocumentKindCard} />
                  <AppLayoutRoute exac path='/equipment/documentkind/view' component={DocumentKind} />
                  <AppLayoutRoute exac path='/equipment/types/view/:id' component={EquipmentTypeCard} />
                  <AppLayoutRoute exac path='/equipment/types/view' component={EquipmentType} />
                  <AppLayoutRoute exac path='/equipment/manufacturer/view/:id' component={ManufacturerViewCard} />
                  <AppLayoutRoute exac path='/equipment/manufacturer/view' component={ManufacturerView} />
                  <AppLayoutRoute exac path='/equipment/view/:id' component={EquipmentCard} />
                  <AppLayoutRoute exac path='/equipment/view' component={EquipmentView} />
                  <AppLayoutRoute exac path='/equipment' component={Equipment} />

                  {/* <AppLayoutRoute exac path='/administrator/roles/view' component={AdministratorRoles} /> */}
                  {/* <AppLayoutRoute exac path='/administrator/roles/view/:id/access' component={AdministratorRoleCardAccess} /> */}
                  <AppLayoutRoute exac path='/administrator/roles/view/:id' component={AdministratorRoleCard} />
                  <AppLayoutRoute exac path='/administrator/roles/view' component={AdministratorRole} />
                  <AppLayoutRoute exac path='/administrator/user/view/:id' component={AdministratorUserCard} />
                  <AppLayoutRoute exac path='/administrator/user/view' component={AdministratorUser} />
                  <AppLayoutRoute exac path='/administrator' component={Administrator} />

                  <AppLayoutRoute exac path='/base/department/view/:id' component={BaseDepartmentCard} />
                  <AppLayoutRoute exac path='/base/department/view' component={BaseDepartment} />
                  <AppLayoutRoute exac path='/base/location/view/:id' component={BaseLocationCard} />
                  <AppLayoutRoute exac path='/base/location/view' component={BaseLocation} />
                  <AppLayoutRoute exac path='/base' component={Base} />
                </Switch>
              </Content>
          </Layout>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
