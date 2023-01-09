import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, SideSheet, List, Button, ButtonGroup } from '@douyinfe/semi-ui'

import CardToolbar from './cardToolbar';
import agent from '../../agent';
import {
    ROLE_CARD_LOADED,
    ROLE_CARD_UNLOADED,
    ROLE_CARD_CHANGED,
    ROLE_CARD_INITFORM,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
  isLoad: state.Role.isLoad,
  isChanged: state.Role.isChanged,
  isInitForm: state.Role.isInitForm
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: ROLE_CARD_LOADED, payload }),
    onChange: payload =>
      dispatch({ type: ROLE_CARD_CHANGED, payload }),
    onUnload: payload =>  
      dispatch({ type: ROLE_CARD_UNLOADED, payload }),
    onInitForm: payload =>  
      dispatch({ type: ROLE_CARD_INITFORM, payload }),
});

class RoleCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            showAccessList: false,
            accessData: []
        }

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
        const data = await agent.RoleService.get(this.props.match.params.id)
        this.setState({...this.state, dataSource: data, loading: false})
        this.formApi.setValues(data.data)

        if (data)
            if (!this.props.isInitForm)
                this.props.onInitForm({isInitForm: true})
    }

    async getAccessData(){
        const data = await agent.RoleService.getClaim(this.props.match.params.id)
        this.setState({...this.state, accessData: data.claims})
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

        this.props.onChange({isChanged: true, chagnedObject: value})
    }

    handleSave = () => {
        this.formApi.setValue('id', this.props.match.params.id)

        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.RoleService.update(values);
                if (data.succeeded) this.props.onChange({isChanged: false})
            })
            .catch((errors) => {
                console.log(errors);
            });
    }

    handleAccessList = (value) => {
        if (value)
            this.getAccessData()

            this.setState({...this.state, showAccessList: value})
            setTimeout(() => {
                let doc = document.getElementsByClassName('semi-sidesheet-content')
                if (doc.length > 0)
                    doc[0].style.overflow = 'visible'
            }, 1000)
    }

    async handleSubmitGrant(item) {
        let obj = {
            roleId: this.props.match.params.id, 
            resource: item.resources,
            claimType: item.type,
            claimValue: item.value
        }

        const result = await agent.RoleService.grant(obj);
        
        if (result.data)
            this.getAccessData()
    }
  
    async handleSubmitInvoke(item) {
        let obj = {
            roleId: this.props.match.params.id, 
            resource: item.resources,
            claimType: item.type,
            claimValue: item.value
        }

        const result = await agent.RoleService.invoke(obj);

        if (result.data)
            this.getAccessData()
    }

    render() {
        if (this.state.dataSource == null)
            return null
        
        let message = 'Поле обязательное для заполнения';

        return (
            <>
                <CardToolbar header={this.state.dataSource.data.name} formChanged={this.props.isChanged} onChangeAccessList={this.handleAccessList} onSave={this.handleSave}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Row>
                        <Col>
                            <Form.Input field='name' label="Имя" trigger='blur' rules={[{ required: true, message },]}/>
                        </Col>
                    </Row>
                </Form>
                <SideSheet getPopupContainer={null} disableScroll={false} title="Права доступа" mask={false} visible={this.state.showAccessList} onCancel={() => this.handleAccessList(false)} size={"medium"}>
                    <List
                        dataSource={this.state.accessData}
                        renderItem={item => (
                            <List.Item
                                main={
                                    <div>
                                        <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.resources}</span>
                                        <br></br>
                                        {item.value}
                                    </div>
                                }
                                extra={
                                    <ButtonGroup theme="borderless">
                                        <Button disabled={item.isGranted} onClick={() => this.handleSubmitGrant(item)}>Включить</Button>
                                        <Button disabled={!item.isGranted} onClick={() => this.handleSubmitInvoke(item)}>Выключить</Button>
                                    </ButtonGroup>
                                }
                            />
                        )}
                    />
                </SideSheet>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RoleCard);
