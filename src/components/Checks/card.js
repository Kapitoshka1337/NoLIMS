import React from 'react';
import { connect } from 'react-redux';
import { Form, Upload, Button, Tooltip } from '@douyinfe/semi-ui'
import { IconDownload, IconRefresh, IconUpload, IconDelete } from '@douyinfe/semi-icons'
import FileSaver from 'file-saver'

import agent from '../../agent';
import CardToolbar from './cardToolbar';
import {
    CHECKS_CARD_LOADED,
    CHECKS_CARD_UNLOADED,
    CHECKS_CARD_CHANGED,
    CHECKS_CARD_INITFORM,
} from '../../constants/actionTypes';
import AutoCompleteEquipment from "../Equipment/autoComplete";
import AutoCompleteDocumentKind from "../DocumentKind/autoComplete";
const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
  isLoad: state.Checks.isLoad,
  isChanged: state.Checks.isChanged,
  isInitForm: state.Checks.isInitForm
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: CHECKS_CARD_LOADED, payload }),
    onChange: payload =>
      dispatch({ type: CHECKS_CARD_CHANGED, payload }),
    onUnload: payload =>  
      dispatch({ type: CHECKS_CARD_UNLOADED, payload }),
    onInitForm: payload =>  
      dispatch({ type: CHECKS_CARD_INITFORM, payload }),
});

class CheckCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            fileList: [],
            equipmentItem: {},
            documentKindItem: {}
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
        const data = await agent.ChecksService.get(this.props.match.params.id)
        this.setState({...this.state, dataSource: data, loading: false})
        this.formApi.setValues(data.data)
    }

    async getDataFile(fileId = null){
        if (fileId)
        {
            const data = await agent.FileService.info(fileId)
            this.setState({...this.state, fileList: [data]})
        }
    }

    async componentDidMount(){
        await this.getData()
        this.getDataFile(this.state.dataSource.data.fileId)
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
        let fState = this.formApi.getFormState()

        if (fState.values.currentCheck != null)
        {
            let currentDate = new Date(fState.values.currentCheck);
            currentDate.setDate(currentDate.getDate() + 1);
            this.formApi.setValue('currentCheck', currentDate.toJSON().split('T')[0])
        }

        if (fState.values.nextCheck != null)
        {
            let nextDate = new Date(fState.values.nextCheck);
            nextDate.setDate(nextDate.getDate() + 1);
            this.formApi.setValue('nextCheck', nextDate.toJSON().split('T')[0])
        }

        this.formApi.setValue('id', this.props.match.params.id)
        this.formApi.setValue('documentKindId', this.state.documentKindItem.id)
        this.formApi.setValue('equipmentId', this.state.equipmentItem.id)
   
        this.formApi.validate()
        .then(async (values) =>  {
            const data = await agent.ChecksService.update(values);
            if (data.succeeded)
            {
                this.props.onChange({isChanged: false})
                this.setState({...this.state, dataSource: data})
            }
        })
        .catch((errors) => {
            console.log(errors);
        });
    }

    handleOkEquipment = (value) => {
        this.formApi.setValue('equipmentName', value.name)
        this.setState({...this.state, equipmentItem: value})
    }

    handleOkDocumentKind = (value) => {
        this.formApi.setValue('documentKindName', value.name)
        this.setState({...this.state, documentKindItem: value})

        if (!this.props.isInitForm)
            this.props.onInitForm({isInitForm: true})
    }

    handleDownload = async () => {
        const result = await agent.FileService.download(this.state.dataSource.data.fileId)

        if (result)
        {
            const fl = new Blob([result.body], {type: result.type});
            FileSaver.saveAs(fl, "Документ");
        }
    }

    handleAfterUpload = (value) => {
        this.formApi.setValue('fileId', value)
        this.handleSave()
        this.getDataFile(value)
    }

    render() {
        let message = 'Поле обязательное для заполнения';
    
        if (this.state.dataSource == null)
            return null
        
        const renderFileOperation = (fileItem) => (
            <div style={{display: 'flex',columnGap: 8, padding: '0 8px'}}>
                <Upload showUploadList={false} afterUpload={(e) => this.handleAfterUpload(e.response.data)} action={`${agent.API_ROOT}/file/upload`} headers={{'authorization': `Bearer ${this.props.common.token}`}}>
                    <Tooltip content={"Обновить файл"}>
                        <Button icon={<IconUpload />} type="tertiary" theme="borderless" size="small" />
                    </Tooltip>
                </Upload>
                <Tooltip content={"Экспортировать"}>
                    <Button onClick={() => this.handleDownload()} icon={<IconDownload />} type="tertiary" theme="borderless" size="small"></Button>
                </Tooltip>
                <Tooltip content={"Удалить файл"}>
                    <Button disabled={true} onClick={e=>fileItem.onRemove()} icon={<IconDelete />} type="tertiary" theme="borderless" size="small"></Button>
                </Tooltip>
            </div>
        )

        return (
            <>
                <CardToolbar header={this.state.dataSource.data.equipment.name} onSave={this.handleSave} formChanged={this.props.isChanged}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Form.Input field='numberDocument' label="Рег. номер документа" trigger='blur'/>
                    <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='currentCheck' label="Пройденная поверка" trigger='blur'/>
                    <Form.DatePicker style={{width: '100%'}} type="date" format="dd.MM.yyyy" field='nextCheck' label="Предстоящая поверка" trigger='blur'/>
                    <AutoCompleteEquipment id={this.state.dataSource.data.equipmentId} onOk={this.handleOkEquipment} rules={[{ required: true, message }]}/>
                    <AutoCompleteDocumentKind  id={this.state.dataSource.data.documentKindId} onOk={this.handleOkDocumentKind} rules={[{ required: true, message }]}/>
                    <Upload
                        action={`${agent.API_ROOT}/file/upload`}
                        afterUpload={(e) => this.handleAfterUpload(e.response.data)}
                        headers={{'authorization': `Bearer ${this.props.common.token}`}}
                        showUploadList={false}
                    >
                        <Button disabled={this.state.dataSource.data.fileId ? true : false} icon={<IconUpload />} theme="light">
                            Загрузите файл пройденной поверки
                        </Button>
                    </Upload>
                    <Upload action={`${agent.API_ROOT}/file/upload`} fileList={this.state.fileList} renderFileOperation={renderFileOperation} />
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckCard);
