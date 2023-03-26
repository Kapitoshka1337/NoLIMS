import React from "react"
import { connect } from 'react-redux'
import { Modal, Form, Row, Col, Upload, Button } from '@douyinfe/semi-ui';
import { IconUpload } from "@douyinfe/semi-icons";
import agent from "../../../agent";
import DocumentKindAutoComplete from '../../DocumentKind/autoComplete'

const mapStateToProps = state => ({
    ...state
});

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

class ModalPassedVerification extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            documentKind: {},
            fileId: null,
            nextCheckData: null
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getFormApi = this.getFormApi.bind(this)
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    checkDate(value, values)
    {
        console.log(value)
        console.log(values['currentCheck'])

        let currentDate = new Date(values['currentCheck']);
        let nextDate = new Date(values['nextCheck']);
        
        if (currentDate && nextDate)
        {
            if (currentDate.getUTCFullYear() >= nextDate.getUTCFullYear())
            {
                return 'Год предстоящей поверки не может быть меньше или равняться пройденной'
            }
        }

        return
    }

    handleOk() {
        this.formApi.setValue('documentKindId', this.state.documentKind.id)
        this.formApi.setValue('equipmentId', this.props.passedEquipment.equipment.id)
        this.formApi.setValue('fileId', this.state.fileId)

        this.formApi.validate()
        .then((values) => {
            let result = agent.ChecksService.add(values);
            if (result)
            {
                this.props.onOk();
                this.props.onClose(null, false)
            }
        })
        .catch((errors) => {
            console.log(errors);
        });
    }

    handleCancel(value) {
        this.props.onClose(null, false)
    }

    onSelectDocumentKind = value => {
        this.formApi.setValue('documentKindName', value.name)
        this.setState({...this.state, documentKind: value})
    }

    onUnload = (e) => {
        console.log(e)
    }

    render(){
        let message = 'Поле обязательное для заполнения';
        if (!this.props.show) return null;
        return (
            <>
                <Modal visible={this.props.show} onOk={this.handleOk} size={"small"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <Form getFormApi={this.getFormApi}>
                        <Row gutter={10}>
                            <Col>
                                <DocumentKindAutoComplete onOk={this.onSelectDocumentKind} rules={[{ required: true, message }]} />
                                <Form.Input label="Регистрационный номер документа" trigger='blur' field={"numberDocument"} rules={[{ required: true, message }]} />
                            </Col>
                            <Col span={12}>
                                <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" label="Пройденная поверка" trigger='blur' field={"currentCheck"} validate={this.checkDate}/>
                            </Col>
                            <Col span={12}>
                                <Form.DatePicker
                                    style={{width: '100%'}}
                                    type="date" format="dd.MM.yyyy"
                                    label="Предстоящая поверка"
                                    trigger='blur'
                                    field={"nextCheck"}
                                    validate={this.checkDate}
                                />
                            </Col>
                        </Row>
                            <Row>
                                <Col>
                                    <Upload afterUpload={(e) => this.setState({...this.state, fileId: e.response.data})} action={`${agent.API_ROOT}/file/upload`} headers={{'authorization': `Bearer ${this.props.common.token}`}}>
                                        <Button icon={<IconUpload />} theme="light">
                                            Загрузите файл пройденной поверки
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalPassedVerification)