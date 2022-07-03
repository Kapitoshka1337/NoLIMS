import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from '@douyinfe/semi-ui'

import agent from '../../agent';
import CardToolbar from './cardToolbar';
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
import AutoCompleteEquipment from "../Equipment/autoComplete";
import AutoCompleteDocumentKind from "../DocumentKind/autoComplete";
const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload })
  });

class CheckCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            formChanged: false,
            initForm: false,
            equipmentItem: {},
            documentKindItem: {}
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.getFormApi = this.getFormApi.bind(this)
    }

    componentDidUpdate(prevProps, prevState){

        if (this.state.dataSource)
            this.setState({loading: false})
    }

    async getData(){
        this.setState({...this.state, loading: true})
        const data = await agent.ChecksService.get(this.props.match.params.id)
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
        {
            this.setState({...this.state, initForm: true})
            return
        }
        
        let form = value.values;

        Object.keys(form).forEach(key => {
            if (this.state.dataSource.data[key] == form[key])
                this.setState({...this.state, formChanged: true})

            return
        })
    }

    handleOk(value){
        
    }

    handleSave = () => {
        let fState = this.formApi.getFormState()

        if (fState.values.currentCheck != null)
        {
            let currentDate = new Date(fState.values.currentCheck);
            currentDate.setDate(currentDate.getDate() + 1);
            this.formApi.setValue('currentCheck', currentDate.toJSON().split('T')[0])
        }

        if (fState.values.nextCheck != null)
        {
            let nextDate = new Date(fState.values.nextCheck);
            nextDate.setDate(nextDate.getDate() + 1);
            this.formApi.setValue('nextCheck', nextDate.toJSON().split('T')[0])
        }

        this.formApi.setValue('id', this.props.match.params.id)
        this.formApi.setValue('documentKindId', this.state.documentKindItem.id)
        this.formApi.setValue('equipmentId', this.state.equipmentItem.id)

        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.ChecksService.update(values);
                if (data.succeeded)
                    this.setState({...this.state, formChanged: false})
            })
            .catch((errors) => {
                console.log(errors);
            });
    }

    handleOkEquipment = (value) => {
        this.formApi.setValue('equipmentName', value.name)
        this.setState({...this.state, equipmentItem: value})

        if (!this.state.initForm)
            this.setState({...this.state, initForm: true})
    }

    handleOkDocumentKind = (value) => {
        this.formApi.setValue('documentKindName', value.name)
        this.setState({...this.state, documentKindItem: value})

        if (!this.state.initForm)
            this.setState({...this.state, initForm: true})
    }

    render() {
        let message = 'Поле обязательное для заполнения';
    
        if (this.state.dataSource == null)
            return null
        
        return (
            <>
                <CardToolbar header={this.state.dataSource.data.equipment.name} onSave={this.handleSave} formChanged={this.state.formChanged}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Form.Input field='numberDocument' label="Рег. номер документа" trigger='blur'/>
                    <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='currentCheck' label="Пройденная поверка" trigger='blur'/>
                    <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='nextCheck' label="Предстоящая поверка" trigger='blur'/>
                    <AutoCompleteEquipment id={this.state.dataSource.data.equipmentId} onOk={this.handleOkEquipment} rules={[{ required: true, message }]}/>
                    <AutoCompleteDocumentKind  id={this.state.dataSource.data.documentKindId} onOk={this.handleOkDocumentKind} rules={[{ required: true, message }]}/>
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckCard);
