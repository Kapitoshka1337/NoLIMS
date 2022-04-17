import React from "react"
import { connect } from 'react-redux'
import { Form, Modal, Row, Col} from '@douyinfe/semi-ui';
import ModalAutoCompelteManufacturer from '../../Manufacturer/autoComplete'
import ModalAutoCompelteDepartment from '../../Department/autoComplete'

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

class ModalCreateVO extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            manufacturer: {},
            department: {}
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getFormApi = this.getFormApi.bind(this);
    }

    handleOk() {
        // this.formApi.validate()
        //     .then((values) => {
        //         console.log(values);
        //     })
        //     .catch((errors) => {
        //         console.log(errors);
        //     });
        this.props.onClose(false)
    }

    handleCancel(value) {
        this.props.onClose(false)
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    selectManufacturer = value => {
        this.setState({manufacturer: value})
    }

    selectDepartment = value => {
        this.setState({...this.state, department: value})
    }

    render(){
        let message = 'Поле обязательное для заполнения';
        
        if (!this.props.show) return null;

        return (
            <>
                <Modal title="Вспомогательное оборудование" visible={this.props.show} onOk={this.handleOk} size={"full-width"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <Form getFormApi={this.getFormApi}>
                        <Row>
                            <Col >
                                <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                            </Col>
                            <Col>
                                <Form.Input field='model' label="Модель" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='serialNumber' label="Серийный номер" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='dateCreate' label="Дата изготовления" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='dateCommissioning' label="Дата ввода в эксплуатацию" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='inventoryNumber' label="Инвентарный номер" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='number' label="Регистрационный номер" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='characteristics' label="Характеристики" trigger='blur'/>
                            </Col>

                            <Col>
                                {/* <Form.Select field='departmentId' label="Подразделение" style={{width:'100%'}} rules={[{ required: true, message },]}>
                                    <Form.Select.Option value="China">China</Form.Select.Option>
                                    <Form.Select.Option value="US">USA</Form.Select.Option>
                                    <Form.Select.Option value="Europe">Europe</Form.Select.Option>
                                    <Form.Select.Option value="Japan">Japan</Form.Select.Option>
                                </Form.Select> */}
                            </Col>
                            <Col>
                                <Form.Select field='locationId' label="Местоположение" style={{width:'100%'}}>
                                    <Form.Select.Option value="China">China</Form.Select.Option>
                                    <Form.Select.Option value="US">USA</Form.Select.Option>
                                    <Form.Select.Option value="Europe">Europe</Form.Select.Option>
                                    <Form.Select.Option value="Japan">Japan</Form.Select.Option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <ModalAutoCompelteManufacturer onOk={this.selectManufacturer}/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteDepartment onOk={this.selectDepartment}/>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateVO)