import React from "react"
import { connect } from 'react-redux'
import { Modal, Form, Row, Col } from '@douyinfe/semi-ui';
import agent from "../../agent";
import AutoCompleteDepartment from "../Department/autoComplete";

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

class ModalCreateUser extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            department: {}
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getFormApi = this.getFormApi.bind(this)
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    handleOk() {
        this.formApi.setValue('departmentId', this.state.department.id)
        this.formApi.validate()
        .then((values) => {
            let result = agent.UsersService.add(values);
            if (result)
            {
                this.props.onOk();
                this.props.onClose(false)
            }
        })
        .catch((errors) => {
            console.log(errors);
        });
    }

    handleCancel(value) {
        this.props.onClose(false)
    }

    selectDepartment = value => {
        this.formApi.setValue('departmentName', value.name)
        this.setState({department: value})
    }

    render(){
        let message = 'Поле обязательное для заполнения';
        if (!this.props.show) return null;

        return (
            <>
                <Modal visible={this.props.show} onOk={this.handleOk} size={"small"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <Form getFormApi={this.getFormApi}>
                        <Row>
                            <Col>
                                <Form.Input label="Фамилия" trigger='blur' field={"middleName"} rules={[{ required: true, message },]}></Form.Input>
                                <Form.Input label="Имя" trigger='blur' field={"firstName"} rules={[{ required: true, message },]}></Form.Input>
                                <Form.Input label="Отчество" trigger='blur' field={"lastName"} rules={[{ required: true, message },]}></Form.Input>
                                <AutoCompleteDepartment onOk={this.selectDepartment}/>
                                <Form.Input label="Учетная запись (логин)" trigger='blur' field={"userName"} rules={[{ required: true, message },]}></Form.Input>
                                <Form.Input type="password" label="Пароль" trigger='blur' field={"password"} rules={[{ required: true, message },]}></Form.Input>
                                <Form.Input type="password" label="Подтверждение пароля" trigger='blur' field={"confirmPassword"} rules={[{ required: true, message },]}></Form.Input>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateUser)