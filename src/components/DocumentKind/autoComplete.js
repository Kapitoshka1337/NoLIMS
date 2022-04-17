import React from "react"
import { connect } from 'react-redux'
import TableManufacturer from './view';
import { Form, AutoComplete, Button, Modal } from '@douyinfe/semi-ui';
import { IconMore } from "@douyinfe/semi-icons";

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

class AutoCompleteDocumentKind extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            item: {},
            show: false
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleOk() {
        this.props.onOk(this.state.item);
        this.setState({show: false});
    }

    handleCancel(value) {
        this.setState({show: value, item: {}});
    }

    selectedManufacturer = value => {
        this.setState({item: value})
    }

    show = value => {
        this.setState({show: value});
    }

    render(){
        return (
            <>
                <Form.AutoComplete 
                    style={{width: '100%'}}
                    value={this.state.item.name}
                    suffix={<Button onClick={(e) => this.show(true)} icon={<IconMore />}></Button>}
                    label="Вид документа"
                    field={"documentName"}
                />
                <Modal visible={this.state.show} onOk={this.handleOk} size={"full-width"} onCancel={(e) => this.handleCancel(false)} okText={"ОК"} cancelText={"Отмена"}>
                    <TableManufacturer onSelect={this.selectedManufacturer}/>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteDocumentKind)