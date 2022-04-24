import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Nav } from '@douyinfe/semi-ui'
import { IconSave, IconSetting, IconUserGroup } from '@douyinfe/semi-icons';

import agent from '../../agent';
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';

import DepartmentAutocomplete from "../Department/autoComplete";
import ModalUserChangePassword from "./modalChangePassword";
import ModalUserRoles from "./modalRoles";

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload })
  });

class UserCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            formChanged: false,
            initForm: false,
            departmentItem: {},
            showChangePassword: false,
            showRoles: false
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
        const data = await agent.UsersService.get(this.props.match.params.id)
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

    handleOk(value){
        this.formApi.setValue('departmentName', value.name)
        this.setState({...this.state, departmentItem: value})

        if (!this.state.initForm)
            this.setState({...this.state, initForm: true})
    }

    handleSave(){
        this.formApi.setValue('departmentId', this.state.departmentItem.id)
        this.formApi.setValue('id', this.props.match.params.id)

        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.UsersService.update(values);
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
                <Nav
                    header={{text: this.state.dataSource.data.firstName}}
                    style={{padding: 0}}
                    mode={'horizontal'}
                    items={
                        [
                            { itemKey: 'save', text: 'Сохранить', icon: <IconSave />, onClick: (e) => this.handleSave(true), disabled: !this.state.formChanged},
                            { itemKey: 'changePassword', text: 'Сменить пароль', icon: <IconSetting />, onClick: (e) => this.handleChangePassword(true)},
                            { itemKey: 'roles', text: 'Роли', icon: <IconUserGroup />, onClick: (e) => this.handleRoles(true)}
                        ]
                    }
                />
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Row>
                        <Col>
                            <Form.Input field='userName' label="Учетная запись (логин)" trigger='blur' disabled={true}/>
                            <Form.Input field='firstName' label="Имя" trigger='blur' rules={[{ required: true, message },]}/>
                            <Form.Input field='middleName' label="Фамилия" trigger='blur'/>
                            <Form.Input field='lastName' label="Отчество" trigger='blur'/>
                            <DepartmentAutocomplete id={this.state.dataSource.data.departmentId} onOk={this.handleOk}/>
                        </Col>
                    </Row>
                </Form>
                <ModalUserChangePassword user={this.state.dataSource.data} onClose={this.handleChangePassword} onOk={this.handleChangePassword} show={this.state.showChangePassword}/>
                <ModalUserRoles user={this.state.dataSource.data} onClose={this.handleRoles} onOk={this.handleRoles} show={this.state.showRoles}/>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCard);
