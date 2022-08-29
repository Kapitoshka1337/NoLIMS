import React from "react"
import { connect } from 'react-redux'
import { Modal, Form, Row, Col, Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from "@douyinfe/semi-icons";
import agent from "../../agent";

const mapStateToProps = state => ({
    ...state
})

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

class ModalCreateInstruction extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fileId: null
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getFormApi = this.getFormApi.bind(this)
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    handleOk() {
        this.formApi.setValue('fileId', this.state.fileId)

        this.formApi.validate()
        .then((values) => {
            let result = agent.InstructionService.add(values);
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

    render(){
        let message = 'Поле обязательное для заполнения';
        if (!this.props.show) return null;

        return (
            <>
                <Modal visible={this.props.show} onOk={this.handleOk} size={"small"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <Form getFormApi={this.getFormApi}>
                        <Row>
                            <Col>
                                <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                                <Form.Input field='number' label="Номер" trigger='blur' rules={[{ required: true, message },]}/>
                            </Col>
                        </Row>
                        <Row>
                                <Col>
                                    <Upload afterUpload={(e) => this.setState({...this.state, fileId: e.response.data})} action={`${agent.API_ROOT}/file/upload`} headers={{'authorization': `Bearer ${this.props.common.token}`}}>
                                        <Button icon={<IconUpload />} theme="light">
                                            Загрузите файл инструкции
                                        </Button>
                                    </Upload>
                                </Col>
                            </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateInstruction)