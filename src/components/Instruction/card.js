import React from 'react';
import { connect } from 'react-redux';
import { Form, Upload, Button, Tooltip } from '@douyinfe/semi-ui'
import { IconDownload, IconRefresh, IconUpload, IconDelete } from '@douyinfe/semi-icons'
import FileSaver from 'file-saver'

import agent from '../../agent';
import CardToolbar from './cardToolbar';
import {
    
} from '../../constants/actionTypes';
import AutoCompleteEquipment from "../Equipment/autoComplete";
import AutoCompleteDocumentKind from "../DocumentKind/autoComplete";
const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({

  });

class InstructionCard extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            dataSource: null,
            fileList: [],
            formChanged: false,
            initForm: false,
            equipmentItem: {},
            documentKindItem: {}
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
        const data = await agent.InstructionService.get(this.props.match.params.id)
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

    handleSave = () => {
        let fileId = this.formApi.getValue('fileId')
        if (typeof(fileId) == 'undefined')
        {
            this.formApi.setValue('fileId', this.state.dataSource.data.fileId)
        }
        this.formApi.setValue('id', this.props.match.params.id)
        this.formApi.validate()
        .then(async (values) =>  {
            const data = await agent.InstructionService.update(values);
            if (data.succeeded)
                this.setState({...this.state, formChanged: false, dataSource: data})
        })
        .catch((errors) => {
            console.log(errors);
        });
    }

    handleDownload = async () => {
        const result = await agent.FileService.download(this.state.dataSource.data.fileId)

        if (result)
        {
            const fl = new Blob([result], {type: result['type']});
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
                <CardToolbar header={this.state.dataSource.data.name} onSave={this.handleSave} formChanged={this.state.formChanged}/>
                <Form getFormApi={this.getFormApi} onChange={(e) => this.handleChangeForm(e)}>
                    <Form.Input field='name' label="Наименование" trigger='blur'/>
                    <Form.Input field='number' label="Номер" trigger='blur'/>
                    <Upload
                        action={`${agent.API_ROOT}/file/upload`}
                        afterUpload={(e) => this.handleAfterUpload(e.response.data)}
                        headers={{'authorization': `Bearer ${this.props.common.token}`}}
                        showUploadList={false}
                    >
                        <Button disabled={this.state.dataSource.data.fileId ? true : false} icon={<IconUpload />} theme="light">
                            Загрузите файл инструкции
                        </Button>
                    </Upload>
                    <Upload action={`${agent.API_ROOT}/file/upload`} fileList={this.state.fileList} renderFileOperation={renderFileOperation} />
                </Form>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstructionCard);
