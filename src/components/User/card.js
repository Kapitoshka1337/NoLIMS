import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Nav } from '@douyinfe/semi-ui'
import { IconSave, IconSetting, IconUserGroup } from '@douyinfe/semi-icons';

import agent from '../../agent';
import {
    USER_CARD_LOADED,
    USER_CARD_UNLOADED,
    USER_CARD_CHANGED,
    USER_CARD_INITFORM,
} from '../../constants/actionTypes';

import DepartmentAutocomplete from "../Department/autoComplete";
import ModalUserChangePassword from "./modalChangePassword";
import ModalUserRoles from "./modalRoles";
import CardToolbar from "./cardToolbar";

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
  isLoad: state.User.isLoad,
  isChanged: state.User.isChanged,
  isInitForm: state.User.isInitForm
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: USER_CARD_LOADED, payload }),
    onChange: payload =>
      dispatch({ type: USER_CARD_CHANGED, payload }),
    onUnload: payload =>  
      dispatch({ type: USER_CARD_UNLOADED, payload }),
    onInitForm: payload =>  
      dispatch({ type: USER_CARD_INITFORM, payload }),
});

class UserCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            departmentItem: {},
            showChangePassword: false,
            showRoles: false
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.getFormApi = this.getFormApi.bind(this)
    }

    componentWillUnmount () {
        this.props.onUnload({isLoad: false, isChanged: false, isInitForm: false})
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
        this.props.onLoad({isLoad: true, isChanged: false});
    }

    getFormApi(formApi) {
        this.formApi = formApi;
    }

    handleChangeForm(value) {
        if (!this.props.isInitForm)
            return
        
        this.props.onChange({isChanged: true})
    }

    handleOk(value){
        this.formApi.setValue('departmentName', value.name)
        this.setState({...this.state, departmentItem: value})

        if (!this.props.isInitForm)
            this.props.onInitForm({isInitForm: true})
    }

    handleSave= () => {
        this.formApi.setValue('departmentId', this.state.departmentItem.id)
        this.formApi.setValue('id', this.props.match.params.id)

        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.UsersService.update(values);
                if (data.succeeded) this.props.onChange({isChanged: false})
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
                <CardToolbar header={this.state.dataSource.data.firstName} formChanged={this.props.isChanged} onChangePassword={this.handleChangePassword} onSave={this.handleSave} onRoles={this.handleRoles}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Row>
                        <Col>
                            <Form.Input field='userName' label="Учетная запись (логин)" trigger='blur' disabled={true}/>
                            <Form.Input field='firstName' label="Имя" trigger='blur' rules={[{ required: true, message }]}/>
                            <Form.Input field='middleName' label="Фамилия" trigger='blur'rules={[{ required: true, message }]} />
                            <Form.Input field='lastName' label="Отчество" trigger='blur' rules={[{ required: true, message }]} />
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
