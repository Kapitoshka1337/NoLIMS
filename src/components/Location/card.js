import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col} from '@douyinfe/semi-ui'

import agent from '../../agent';
import {
    LOCATION_CARD_LOADED,
    LOCATION_CARD_UNLOADED,
    LOCATION_CARD_CHANGED,
    LOCATION_CARD_INITFORM,
} from '../../constants/actionTypes';
import AutoCompleteDepartment from '../Department/autoComplete';
import CardToolbar from './cardToolbar';

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
  isLoad: state.Location.isLoad,
  isChanged: state.Location.isChanged,
  isInitForm: state.Location.isInitForm
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: LOCATION_CARD_LOADED, payload }),
    onChange: payload =>
      dispatch({ type: LOCATION_CARD_CHANGED, payload }),
    onUnload: payload =>  
      dispatch({ type: LOCATION_CARD_UNLOADED, payload }),
    onInitForm: payload =>  
      dispatch({ type: LOCATION_CARD_INITFORM, payload }),
});

class LocationCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            departmentItem: {}
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
        const data = await agent.LocationService.get(this.props.match.params.id)
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

    handleSave = () => {
        this.formApi.setValue('id', this.props.match.params.id)
        this.formApi.setValue('departmentId', this.state.departmentItem.id)

        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.LocationService.update(values);
                if (data.succeeded)
                    this.props.onChange({isChanged: false})
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
                <CardToolbar header={this.state.dataSource.data.numberRoom} onSave={this.handleSave} formChanged={this.props.isChanged}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Form.Input field='numberRoom' label="Номер" trigger='blur'/>
                    <AutoCompleteDepartment id={this.state.dataSource.data.departmentId} onOk={this.handleOk}/>
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationCard);
