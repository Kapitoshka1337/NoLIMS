import React from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Nav } from '@douyinfe/semi-ui'
import { IconSave } from '@douyinfe/semi-icons';

import agent from '../../agent';
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

class ManufacturerCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            formChanged: false,
            initForm: false
        }

        this.handleSave = this.handleSave.bind(this);
        this.getFormApi = this.getFormApi.bind(this)
    }

    componentDidUpdate(prevProps, prevState){

        if (this.state.dataSource)
            this.setState({loading: false})
    }

    async getData(){
        this.setState({...this.state, loading: true})
        const data = await agent.ManufacturerService.get(this.props.match.params.id)
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

    handleSave(){
        this.formApi.setValue('id', this.props.match.params.id)

        this.formApi.validate()
            .then(async (values) =>  {
                const data = await agent.ManufacturerService.update(values);
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
                <Nav
                    header={{text: this.state.dataSource.data.name}}
                    style={{padding: 0}}
                    mode={'horizontal'}
                    items={
                        [
                            { itemKey: 'save', text: 'Сохранить', icon: <IconSave />, onClick: (e) => this.handleSave(true), disabled: !this.state.formChanged}
                        ]
                    }
                />
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Row>
                        <Col>
                            <Form.Input field='name' label="Наименование" trigger='blur' rules={[{ required: true, message },]}/>
                            <Form.Input field='country' label="Страна" trigger='blur'/>
                            <Form.Input field='city' label="Город" trigger='blur'/>
                        </Col>
                    </Row>
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManufacturerCard);
