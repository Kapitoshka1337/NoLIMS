import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from '@douyinfe/semi-ui'

import agent from '../../agent';
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';

import DepartmentAutocomplete from "../Department/autoComplete";
import ManufacturerAutocomplete from "../Manufacturer/autoComplete";
import LocationtAutocomplete from "../Location/autoComplete";
import EquipmentTypeAutocomplete from "../EquipmentTypes/autoComplete";
import EquipmentTagAutocomplete from "../EquipmentTags/autoComplete";
import CardToolbar from './cardToolbar';

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload })
  });

class EquipmentCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            formChanged: false,
            initForm: false,
            departmentItem: {},
            equipmentType: {},
            equipmentTag: {},
            manufacturer: {},
            location: {},
            showChangePassword: false,
            showRoles: false
        }

        this.handleOkDepartment = this.handleOkDepartment.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.getFormApi = this.getFormApi.bind(this)
    }

    componentDidUpdate(prevProps, prevState){

        if (this.state.dataSource)
            this.setState({loading: false})
    }

    async getData(){
        this.setState({...this.state, loading: true})
        const data = await agent.EquipmentService.get(this.props.match.params.id)
        this.setState({...this.state, dataSource: data, loading: false})
        this.formApi.setValues(data.data)
    }

    async componentDidMount(){
        this.getData()
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    handleChangeForm(value) {
        if (!this.state.initForm)
            return
        
        let form = value.values;

        Object.keys(form).forEach(key => {
            if (this.state.dataSource.data[key] == form[key])
                this.setState({...this.state, formChanged: true})

            return
        })
    }

    handleOkDepartment(value){
        this.formApi.setValue('departmentName', value.name)
        this.setState({...this.state, departmentItem: value})

        if (!this.state.initForm)
            this.setState({...this.state, initForm: true})
    }

    handleOkEquipmentType = value => {
        this.formApi.setValue('equipmentTypeName', value.name)
        this.setState({...this.state, equipmentType: value})
    }

    handleOkEquipmentTag = value => {
        this.formApi.setValue('equipmentTag', value.name)
        this.setState({...this.state, equipmentTag: value})
    }
    
    handleOkLocation = value => {
        this.formApi.setValue('locationName', value.numberRoom)
        this.setState({...this.state, location: value})
    }
    
    handleOkManufacturer = value => {
        this.formApi.setValue('manufacturerName', value.name)
        this.setState({...this.state, manufacturer: value})
    }

    handleSave = () => {
        let fState = this.formApi.getFormState()
        if (fState.values.dateCreate || fState.values.dateCommissioning)
        {
            let currentDate = new Date(fState.values.dateCreate);
            let nextDate = new Date(fState.values.dateCommissioning);
            currentDate.setDate(currentDate.getDate() + 1);
            nextDate.setDate(nextDate.getDate() + 1);
    
            this.formApi.setValue('dateCreate', currentDate.toJSON().split('T')[0])
            this.formApi.setValue('dateCommissioning', nextDate.toJSON().split('T')[0])
        }

        this.formApi.setValue('departmentId', this.state.departmentItem.id)
        this.formApi.setValue('manufacturerId', this.state.manufacturer.id)
        this.formApi.setValue('typeId', this.state.equipmentType.id)
        this.formApi.setValue('tagId', this.state.equipmentTag.id)
        this.formApi.setValue('locationId', this.state.location.id)
        this.formApi.setValue('id', this.props.match.params.id)

        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.EquipmentService.update(values);
                if (data.succeeded)
                    this.setState({...this.state, formChanged: false})
            })
            .catch((errors) => {
                console.log(errors);
            });
    }

    handleChangePassword = (value) => {
        this.setState({...this.state, showChangePassword: value})
    }

    handleRoles = (value) => {
        this.setState({...this.state, showRoles: value})
    }

    render() {
        let message = 'Поле обязательное для заполнения';
    
        if (this.state.dataSource == null)
            return null
        
        return (
            <>
                <CardToolbar header={this.state.dataSource.data.name} onSave={this.handleSave} formChanged={this.state.formChanged}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <EquipmentTypeAutocomplete id={this.state.dataSource.data.typeId} onOk={this.handleOkEquipmentType} rules={[{ required: true, message }]}/>
                    <Form.Input field='number' label="Регистрационный номер" trigger='blur'/>
                    <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                    <Form.Input field='model' label="Модель" trigger='blur'/>
                    <Form.Input field='serialNumber' label="Серийный номер" trigger='blur'/>
                    <Form.Input field='inventoryNumber' label="Инвентарный номер" trigger='blur'/>
                    <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='dateCreate' label="Дата изготовления" trigger='blur'/>
                    <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='dateCommissioning' label="Дата ввода в эксплуатацию" trigger='blur'/>
                    <DepartmentAutocomplete id={this.state.dataSource.data.departmentId} onOk={this.handleOkDepartment} rules={[{ required: true, message }]}/>
                    <LocationtAutocomplete id={this.state.dataSource.data.locationId} onOk={this.handleOkLocation}/>
                    <EquipmentTagAutocomplete id={this.state.dataSource.data.tagId} onOk={this.handleOkEquipmentTag} rules={[{ required: true, message }]}/>
                    <Form.Input field='characteristics' label="Характеристики (ВО/ИО/СИ) (± °)" trigger='blur'/>
                    <Form.Input field='measuringWork' label="Диапазон работы (ИО)" disabled={this.state.dataSource.data.typeId != 2} trigger='blur'/>
                    <Form.Input field='accuracy' label="Точность (ИО/СИ)" disabled={this.state.dataSource.data.typeId != 2 && this.state.dataSource.data.typeId != 3} trigger='blur'/>
                    <Form.Input field='measuringRange' label="Диапазон измерений (СИ)" disabled={this.state.dataSource.data.typeId != 3} trigger='blur'/>
                    <Form.Input field='classAccuracy' label="Класс точности (СИ)" disabled={this.state.dataSource.data.typeId != 3} trigger='blur'/>
                    <Form.Input field='fifNumber' label="ФИФ (СИ)" disabled={this.state.dataSource.data.typeId != 3} trigger='blur'/>
                    <ManufacturerAutocomplete id={this.state.dataSource.data.manufacturerId} onOk={this.handleOkManufacturer}/>
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentCard);
