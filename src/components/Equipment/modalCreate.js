import React from "react"
import { connect } from 'react-redux'
import { Form, Modal, Row, Col} from '@douyinfe/semi-ui';
import agent from '../../agent'
import ModalAutoCompelteManufacturer from '../Manufacturer/autoComplete'
import ModalAutoCompelteDepartment from '../Department/autoComplete'
import ModalAutoCompelteLocation from '../Location/autoComplete'
import ModalAutoCompelteEquipmentType from '../EquipmentTypes/autoComplete'

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

class ModalCreateEquipment extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            manufacturer: {},
            department: {},
            location: {},
            equipmentType: {}
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getFormApi = this.getFormApi.bind(this);
    }

    handleOk() {
        this.formApi.setValue('departmentId', this.state.department.id)
        this.formApi.setValue('manufacturerId', this.state.manufacturer.id)
        this.formApi.setValue('typeId', this.state.equipmentType.id)
        this.formApi.setValue('locationId', this.state.location.id)

        this.formApi.validate()
            .then(async (values) => {
                let result;
                if (values.typeId == 1)
                    result = await agent.EquipmentService.addVO(values);

                if (values.typeId == 2)
                    result = await agent.EquipmentService.addIO(values);

                if (values.typeId == 3)
                    result = await agent.EquipmentService.addSI(values);

                if (result.data)
                    this.props.onClose(false)
            })
            .catch((errors) => {
                console.log(errors);
            });
    }

    handleCancel(value) {
        this.props.onClose(false)
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    selectManufacturer = value => {
        this.formApi.setValue('manufacturerName', value.name)
        this.setState({...this.state, manufacturer: value})
    }

    selectDepartment = value => {
        this.formApi.setValue('departmentName', value.name)
        this.setState({...this.state, department: value})
    }

    selectLocation = value => {
        this.formApi.setValue('locationName', value.numberRoom)
        this.setState({...this.state, location: value})
    }

    selectEquipmentType = value => {
        this.formApi.setValue('equipmentTypeName', value.name)
        this.setState({...this.state, equipmentType: value})
    }

    render(){
        let message = 'Поле обязательное для заполнения';
        
        if (!this.props.show) return null;

        return (
            <>
                <Modal visible={this.props.show} onOk={this.handleOk} size={"large"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <Form getFormApi={this.getFormApi}>
                        <Row gutter={12}>
                            <Col >
                                <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                            </Col>
                            <Col>
                                <Form.Input field='model' label="Модель" trigger='blur'/>
                            </Col>
                            <Col>
                                <Form.Input field='serialNumber' label="Серийный номер" trigger='blur'/>
                            </Col>
                            <Col>
                                <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='dateCreate' label="Дата изготовления" trigger='blur'/>
                            </Col>
                            <Col>
                                <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='dateCommissioning' label="Дата ввода в эксплуатацию" trigger='blur'/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteEquipmentType onOk={this.selectEquipmentType} rules={[{ required: true, message }]}/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteLocation onOk={this.selectLocation}/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteManufacturer onOk={this.selectManufacturer}/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteDepartment onOk={this.selectDepartment} rules={[{ required: true, message }]}/>
                            </Col>
                            <Col >
                                <Form.Input field='inventoryNumber' label="Инвентарный номер" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='number' label="Регистрационный номер" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='characteristics' label="Характеристики ВО" disabled={this.state.equipmentType.id != 1} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='accuracy' label="Точность ИО СИ" disabled={this.state.equipmentType.id != 2 && this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='measuringWork' label="Диапазон работы ИО" disabled={this.state.equipmentType.id != 2} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='fifNumber' label="ФИФ СИ" disabled={this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='classAccuracy' label="Класс точности СИ" disabled={this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='measuringRange' label="Диапазон измерений СИ" disabled={this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateEquipment)