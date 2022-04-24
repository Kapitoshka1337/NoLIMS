import React from "react"
import { connect } from 'react-redux'
import { Form, AutoComplete, Button, Modal } from '@douyinfe/semi-ui';
import { IconMore } from "@douyinfe/semi-icons";
import TableLocation from './view';
import agent from "../../agent";

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

class AutoCompleteLocation extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            item: {},
            show: false
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentDidMount(){
        if (this.props.id != null)
            this.getData();
    }

    async getData(){
        if (this.props.id != null || typeof(this.props.id) != 'undefined')
        {
            const data = await agent.LocationService.get(this.props.id);
            if (data.succeeded)
                this.setState({...this.state, item: data.data})

            this.props.onOk(this.state.item)
        }
    }

    handleOk() {
        this.props.onOk(this.state.item);
        this.setState({show: false});
    }

    handleCancel(value) {
        this.setState({...this.state, show: value});
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
                    suffix={<Button onClick={(e) => this.show(true)} icon={<IconMore />}></Button>}
                    label="Местоположение"
                    field="locationName"
                    rules={this.props.rules}
                />
                <Modal visible={this.state.show} onOk={this.handleOk} size={"full-width"} onCancel={(e) => this.handleCancel(false)} okText={"ОК"} cancelText={"Отмена"}>
                    <TableLocation onSelect={this.selectedManufacturer}/>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteLocation)