import React from "react"
import { connect } from 'react-redux'
import { Modal, CheckboxGroup, List, Checkbox, ButtonGroup, Button } from '@douyinfe/semi-ui';
import agent from "../../agent";
// import AutoCompleteDepartment from "../Department/autoComplete";

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

class ModalChangeRoles extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            selectedItems: []
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    async componentDidMount(){
        this.getData()
    }

    async getData() {
        const data = await agent.UserRoleService.view(this.props.user.id);
        if (data.succeeded)
            this.setState({items: data.data})
    }


    handleOk() {
        this.props.onClose(false)
    }

    handleCancel() {
        this.props.onClose(false)
    }

    async handleSubmitGrant(item) {
        let obj = { roleId: item.id, userId: this.props.user.id}
        const result = await agent.UserRoleService.grant(obj);
        
        if (result.data)
            this.getData()
    }
  
    async handleSubmitInvoke(item) {
        let obj = { roleId: item.id, userId: this.props.user.id}
        const result = await agent.UserRoleService.invoke(obj);

        if (result.data)
            this.getData()
    }

    render(){
        if (!this.props.show) return null;

        return (
            <>
                <Modal visible={this.props.show} onOk={this.handleOk} size={"large"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <List
                        dataSource={this.state.items}
                        renderItem={item => (
                            <List.Item
                                main={
                                    <div>
                                        <span style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{item.name}</span>
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
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalChangeRoles)