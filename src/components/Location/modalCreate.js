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

class ModalCreateLocation extends React.PureComponent {
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
            let result = agent.LocationService.add(values);
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

    handleOkAutoComplete = (value) => {
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
                                <Form.Input field='numberRoom' label="Номер кабинета" trigger='blur'/>
                                <AutoCompleteDepartment onOk={this.handleOkAutoComplete}/>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateLocation)