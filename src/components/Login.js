import React from 'react'
import agent from '../agent'
import { connect } from 'react-redux'
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes'

import { Layout, Button, Form, Toast, Card, Col, Row, Banner } from '@douyinfe/semi-ui';

const mapStateToProps = state => state.auth

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (payload) =>
    dispatch({ type: LOGIN, payload: payload }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
})

class Login extends React.PureComponent {
  constructor () {
    super()
    this.submitForm = (payload) => {
      this.props.onSubmit(payload)
    }

    this.state = {
      error: false,
      errorMessage: ''
    }
  }

  componentWillUnmount () {
    this.props.onUnload()
  }

  async handleSubmit(values){
    let response = await agent.Auth.login(values.login, values.password);
    if (response)
    {
      if (!response['succeeded'])
        this.setState({error: response['succeeded'], errorMessage: response['message']});
      else
        this.submitForm(response);
    }
  }

  render () {
    const banner = (<Banner closeIcon={null} type="danger" description={this.state.errorMessage}/>);
    const { Content } = Layout;
    return (

      <Layout style={{height: '100%'}}>
        <Content style={{ padding: '24px', backgroundColor: 'var(--semi-color-bg-0)'}}>
            <Row>
              <Col span={6} offset={9}>
                <Card  title='Авторизация'>
                  {this.state.error ? banner : null}
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
