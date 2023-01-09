import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col } from '@douyinfe/semi-ui'

import agent from '../../agent';
import CardToolbar from './cardToolbar';
import {
    DOCUMENT_KIND_CARD_LOADED,
    DOCUMENT_KIND_CARD_UNLOADED,
    DOCUMENT_KIND_CARD_CHANGED,
    DOCUMENT_KIND_CARD_INITFORM,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
  isLoad: state.DocumentKind.isLoad,
  isChanged: state.DocumentKind.isChanged,
  isInitForm: state.DocumentKind.isInitForm
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: DOCUMENT_KIND_CARD_LOADED, payload }),
    onChange: payload =>
      dispatch({ type: DOCUMENT_KIND_CARD_CHANGED, payload }),
    onUnload: payload =>  
      dispatch({ type: DOCUMENT_KIND_CARD_UNLOADED, payload }),
    onInitForm: payload =>  
      dispatch({ type: DOCUMENT_KIND_CARD_INITFORM, payload }),
});

class DocumentKindCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null
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
        const data = await agent.DocumentKindService.get(this.props.match.params.id)
        this.setState({...this.state, dataSource: data, loading: false})
        this.formApi.setValues(data.data)

        if (data)
            if (!this.props.isInitForm)
                this.props.onInitForm({isInitForm: true})
    }

    async componentDidMount() {
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
                const data = await agent.DocumentKindService.update(values);
                if (data.succeeded) this.props.onChange({isChanged: false})
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
                <CardToolbar header={this.state.dataSource.data.name} onSave={this.handleSave} formChanged={this.props.isChanged}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Row>
                        <Col>
                            <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentKindCard);
