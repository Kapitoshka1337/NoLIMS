// import { Link } from 'react-router-dom'
// import ListErrors from './ListErrors'
import React from 'react'
import agent from '../agent'
import { connect } from 'react-redux'
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes'

import { Layout, Button, Form, Toast, Card, Col, Row } from '@douyinfe/semi-ui';

const mapStateToProps = state => state.auth

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (login, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(login, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
})

class Login extends React.PureComponent {
  constructor () {
    super()
    // this.changeEmail = ev => this.props.onChangeEmail(ev.target.value)
    // this.changePassword = ev => this.props.onChangePassword(ev.target.value)
    this.submitForm = (login, password) => {
      this.props.onSubmit(login, password)
    }
  }

  componentWillUnmount () {
    this.props.onUnload()
  }

  handleSubmit(values){
    this.submitForm(values.login, values.password);
  }

  render () {
    const login = this.props.login
    const password = this.props.password
    const { Content } = Layout;

    return (

      <Layout style={{height: '100%'}}>
        <Content style={{ padding: '24px', backgroundColor: 'var(--semi-color-bg-0)'}}>
            <Row>
              <Col span={12} offset={6}>
                <Card  title='Авторизация'>
                  <Form onSubmit={values => this.handleSubmit(values)}>
                    <Form.Input field='login' label='Логин' style={{ width: '100%' }} required></Form.Input>
                    <Form.Input type='password' field='password' label='Пароль' style={{ width: '100%' }} required></Form.Input>
                    <Button htmlType='submit' type="primary" theme='solid' block>Вход</Button>
                  </Form>
                </Card>
              </Col>
            </Row>
        </Content>
      </Layout>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
