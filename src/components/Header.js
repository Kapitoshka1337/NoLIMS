import React from 'react';

import agent from '../agent'
import { connect } from 'react-redux'
import { SETTINGS_SAVED, SETTINGS_PAGE_UNLOADED, LOGOUT } from '../constants/actionTypes'

import { Layout, Nav, Avatar, Dropdown, Toast, Modal, Button} from '@douyinfe/semi-ui';

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

  constructor(props){
    super(props)

    this.state = {
      userInfo: false
    }
  }

  click () {
    Toast.info("You clicked me!");
  }

  handleOk = () => {
    this.setState({userInfo: false})
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
                          <Dropdown.Item onClick={() => this.setState({userInfo: true})}>Профиль</Dropdown.Item>
                          <Dropdown.Item onClick={this.props.onClickLogout}>Выход</Dropdown.Item>
                      </Dropdown.Menu>
                    }>
                        <Avatar color='orange' size='small'>{ this.props.currentUser?.userName[0].toUpperCase() }</Avatar>
                    </Dropdown>
                </>
            }
        >
        </Nav>

        <Modal title={"Профиль пользователя"} visible={this.state.userInfo} onOk={this.handleOk} onCancel={this.handleOk} closeOnEsc={true}
          footer={
              <Button type="primary" onClick={this.handleOk}>ОК</Button>
          }
        >
          ФИО: {this.props.currentUser?.userName}
          <br />
          Роли: {this.props.currentUser?.roles.map((role) => {return `${role.role || role} `})}
        </Modal>
      </Header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
