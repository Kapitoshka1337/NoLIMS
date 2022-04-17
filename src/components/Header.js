import React from 'react';

import agent from '../agent'
import { connect } from 'react-redux'
import { SETTINGS_SAVED, SETTINGS_PAGE_UNLOADED, LOGOUT } from '../constants/actionTypes'

import { Layout, Nav, Avatar, Dropdown, Toast } from '@douyinfe/semi-ui';

const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onSubmitForm: user =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
})

class Header extends React.PureComponent {

  click () {
    Toast.info("You clicked me!");
  }

  render() {
    const { Header } = Layout;

    return (
      <Header style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
        <Nav
            mode='horizontal'
            footer={
                <>
                    <Dropdown position="bottomLeft" trigger={'click'} render={
                      <Dropdown.Menu>
                          <Dropdown.Item>Профиль</Dropdown.Item>
                          <Dropdown.Item onClick={this.props.onClickLogout}>Выход</Dropdown.Item>
                      </Dropdown.Menu>
                    }>

                      <Avatar color='orange' size='small'>{ this.props.currentUser?.userName[0].toUpperCase() }</Avatar>
                    </Dropdown>
                </>
            }
        >
        </Nav>
      </Header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
