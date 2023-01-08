import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from '@douyinfe/semi-ui'

import agent from '../../agent';
import CardToolbar from './cardToolbar';
import AutoCompleteDepartment from "./autoComplete";
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload })
  });

class DepartmentCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            formChanged: false,
            initForm: false,
            headUnit: {}
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
        const data = await agent.DepartmentService.get(this.props.match.params.id)
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
        this.formApi.setValue('departmentName', value.name)
        this.setState({...this.state, headUnit: value})

        if (!this.state.initForm)
            this.setState({...this.state, initForm: true})
    }

    handleSave = () => {
        this.formApi.setValue('id', this.props.match.params.id)
        this.formApi.setValue('headDepartmentId', this.state.headUnit.id)
        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.DepartmentService.update(values);
                if (data.succeeded)
                    this.setState({...this.state, formChanged: false})
            })
            .catch((errors) => {
                console.log(errors);
            });
    }

    render() {
        let message = 'Поле обязательное для заполнения';
    
        if (this.state.dataSource == null)
            return null
        
        return (
            <>
                <CardToolbar header={this.state.dataSource.data.name} onSave={this.handleSave} formChanged={this.state.formChanged}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Row>
                        <Col>
                            <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                            <Form.Input field='number' label="Номер" trigger='blur'/>
                            <AutoCompleteDepartment id={this.state.dataSource.data.headDepartmentId} onOk={this.handleOk} title="Головное подразделение"/>
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentCard);
