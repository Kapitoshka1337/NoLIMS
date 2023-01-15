import React from "react"
import { connect } from 'react-redux'
import { Form, Modal, Row, Col} from '@douyinfe/semi-ui';
import agent from '../../agent'
import ModalAutoCompelteManufacturer from '../Manufacturer/autoComplete'
import ModalAutoCompelteDepartment from '../Department/autoComplete'
import ModalAutoCompelteLocation from '../Location/autoComplete'
import ModalAutoCompelteEquipmentType from '../EquipmentTypes/autoComplete'
import ModalAutoCompelteTag from '../EquipmentTags/autoComplete'

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
            equipmentType: {},
            dataSource: {}
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.getFormApi = this.getFormApi.bind(this);
    }

    async getData(){
        // this.setState({...this.state, loading: true})
        const data = await agent.EquipmentService.get(this.props.onCopy)
        this.setState({...this.state, dataSource: data})
        this.formApi.setValues(data.data)
    }

    async componentDidMount(){
    }

    handleOk() {
        this.formApi.setValue('departmentId', this.state.department.id)
        this.formApi.setValue('manufacturerId', this.state.manufacturer.id)
        this.formApi.setValue('typeId', this.state.equipmentType.id)
        this.formApi.setValue('locationId', this.state.location.id)
        this.formApi.setValue('tagId', this.state.equipmentTag.id)

        this.formApi.validate()
            .then(async (values) => {
                let result;
                result = await agent.EquipmentService.add(values);

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
    
    selectTag = value => {
        this.formApi.setValue('equipmentTag', value.name)
        this.setState({...this.state, equipmentTag: value})
    }

    render(){
        let message = 'Поле обязательное для заполнения';
        
        if (!this.props.show) return null;

        return (
            <>
                <Modal visible={this.props.show} onOk={this.handleOk} size={"large"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <Form getFormApi={this.getFormApi}>
                        <Row gutter={12}>
                            <Col>
                                <ModalAutoCompelteEquipmentType onOk={this.selectEquipmentType} rules={[{ required: true, message }]}/>
                            </Col>
                            <Col >
                                <Form.Input field='number' label="Регистрационный номер" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                            </Col>
                            <Col>
                                <Form.Input field='model' label="Модель" trigger='blur'/>
                            </Col>
                            <Col>
                                <Form.Input field='serialNumber' label="Серийный номер" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='inventoryNumber' label="Инвентарный номер" trigger='blur'/>
                            </Col>
                            <Col>
                                <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='dateCreate' label="Дата изготовления" trigger='blur'/>
                            </Col>
                            <Col>
                                <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='dateCommissioning' label="Дата ввода в эксплуатацию" trigger='blur'/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteDepartment onOk={this.selectDepartment} rules={[{ required: true, message }]}/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteLocation onOk={this.selectLocation} rules={[{ required: true, message },]}/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteTag onOk={this.selectTag} rules={[{ required: true, message },]}/>
                            </Col>
                            <Col >
                                <Form.Input field='characteristics' label="Характеристики (ВО/ИО/СИ) (± °C)" trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='measuringWork' label="Диапазон работы (ИО)" disabled={this.state.equipmentType.id != 2} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='accuracy' label="Точность (ИО/СИ)" disabled={this.state.equipmentType.id != 2 && this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='measuringRange' label="Диапазон измерений (СИ)" disabled={this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='classAccuracy' label="Класс точности (СИ)" disabled={this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                            <Col >
                                <Form.Input field='fifNumber' label="ФИФ (СИ)" disabled={this.state.equipmentType.id != 3} trigger='blur'/>
                            </Col>
                            <Col>
                                <ModalAutoCompelteManufacturer onOk={this.selectManufacturer} rules={[{ required: true, message },]}/>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreateEquipment)