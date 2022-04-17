import React from "react"
import { connect } from 'react-redux'
import { Modal} from '@douyinfe/semi-ui';
import TableManufacturer from './view';

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

class ModalTableDocumentKind extends React.PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            item: {}
        }

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleOk() {
        this.props.onOk(this.state.item);
        this.props.onClose(false)
    }

    handleCancel(value) {
        this.props.onClose(false)
    }

    selectedManufacturer = value => {
        this.setState({item: value})
    }

    render(){
        if (!this.props.show) return null;

        return (
            <>
                <Modal visible={this.props.show} onOk={this.handleOk} size={"full-width"} onCancel={(e) => this.handleCancel(e)} okText={"ОК"} cancelText={"Отмена"}>
                    <TableManufacturer onSelect={this.selectedManufacturer}/>
                </Modal>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalTableDocumentKind)