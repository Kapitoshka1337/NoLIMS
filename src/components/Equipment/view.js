import React from 'react';
import { connect } from 'react-redux';
import { Table, Toast } from '@douyinfe/semi-ui'

import agent from '../../agent';
import {
  EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
import ModalCreate from './modalCreate';
import { history } from '../../store';
import ButtonOpenCard from './../common/buttonOpenCard';
import ButtonCopyAdd from './../common/buttonCopyAdd';
import Toolbar from './toolbar';
import PanelAppearance from './../common/panelAppearance';
import PanelFilter from './../common/panelFilter';
import AutoCompleteDepartment from "../Department/autoComplete"
import AutoCompleteManufacturer from "../Manufacturer/autoComplete"
import AutoCompleteType from "../EquipmentTypes/autoComplete"
import AutoCompleteTags from "../EquipmentTags/autoComplete"

const mapStateToProps = state => ({
  ...state.EquipmentView,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload }),
    // onUnload: () =>
    //   dispatch({ type: ARTICLE_PAGE_UNLOADED })
  });

class EquipmentView extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            currentPage: 1,
            pageSize: 20,
            sorter: {},
            dataSource: [],
            selectedRow: [],
            showModalCreate: false,
            showColumns: false,
            showFilter: false,
            columns: [
                { type: 'text', filterIndex: 'number', inFilter: true, inAppearance: true, visible: true, title: 'Номер', dataIndex: 'number', width: 100, sorter: (a, b) => a.number - b.number > 0 ? 1 : -1},
                { renderFilter: () => { return <AutoCompleteDepartment form={true} key={'1'} onOk={this.handleOkAutoCompleteDepartment}/>}, type: 'text', filterIndex: 'departmentId', inFilter: true, inAppearance: true, visible: true, title: 'Отдел', dataIndex: 'department.name', width: 200, sorter: (a, b) => a.department.name - b.department.name > 0 ? 1 : -1},
                { renderFilter: () => { return <AutoCompleteManufacturer form={true} key={'2'} onOk={this.handleOkAutoCompleteManufacturer}/>}, type: 'text', filterIndex: 'manufacturerId', inFilter: true, inAppearance: true, visible: true, title: 'Производитель', dataIndex: 'manufacturer.name', width: 200, sorter: (a, b) => a.manufacturer.name - b.manufacturer.name > 0 ? 1 : -1},
                { renderFilter: () => { return <AutoCompleteType form={true} key={'3'} onOk={this.handleOkAutoCompleteType}/>}, type: 'text', filterIndex: 'typeId', inFilter: true, inAppearance: true, visible: true, title: 'Тип', dataIndex: 'type.name', width: 100, sorter: (a, b) => a.type.name - b.type.name > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'name', inFilter: true, inAppearance: true, visible: true, title: 'Наименование', dataIndex: 'name' , width: 200, sorter: (a, b) => a.name - b.name > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'model', inFilter: true, inAppearance: true, visible: true, title: 'Модель', dataIndex: 'model', width: 200, sorter: (a, b) => a.model - b.model > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'inventoryNumber', inFilter: true, inAppearance: true, visible: true, title: 'Инвентарный номер', dataIndex: 'inventoryNumber', width: 200, sorter: (a, b) => a.inventoryNumber - b.inventoryNumber > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'serialNumber', inFilter: true, inAppearance: true, visible: true, title: 'С/Н', dataIndex: 'serialNumber', width: 200, sorter: (a, b) => a.serialNumber - b.serialNumber > 0 ? 1 : -1},
                { renderFilter: () => { return <AutoCompleteTags form={true} key={'4' } onOk={this.handleOkAutoCompleteTags}/>}, type: 'text', filterIndex: 'tagId', inFilter: true, inAppearance: true, visible: true, title: 'Статус', dataIndex: 'tag.name', width: 100, sorter: (a, b) => a.tag.name - b.tag.name > 0 ? 1 : -1},
                {
                    type: 'date',
                    inFilter: true,
                    inAppearance: true,
                    visible: true,
                    title: 'Дата изготовления',
                    filterIndex: 'dateCreate',
                    dataIndex: 'dateCreate',
                    width: 100,
                    sorter: (a, b) => a.dateCreate - b.dateCreate > 0 ? 1 : -1,
                    render: (text, record, index) => this.formatDate(record.dateCreate)
                },
                {
                    type: 'date',
                    inFilter: true,
                    inAppearance: true,
                    visible: true,
                    title: 'Дата ввода в эксплуатацию',
                    filterIndex: 'dateCommissioning',
                    dataIndex: 'dateCommissioning',
                    width: 100,
                    sorter: (a, b) => a.dateCommissioning - b.dateCommissioning > 0 ? 1 : -1,
                    render: (text, record, index) => this.formatDate(record.dateCommissioning)
                },
                { inFilter: false, inAppearance: false, visible: true, title: '', dataIndex: 'actions', width: 200, 
                    render: (text, record, index) => {
                        return (
                            <>
                                <ButtonOpenCard onClick={this.openCard} record={record} />
                                {/* <ButtonCopyAdd onClick={this.copyAdd} /> */}
                            </>
                            
                        )
                    }
                }
            ],
            cols: [],
            filters: {
                number: '',
                departmentId: '',
                manufacturerId: '',
                typeId: '',
                name: '',
                model: '',
                serialNumber: '',
                tagId: '',
                inventoryNumber: ''
            },
            copyEquipmentId: null
        }
    }

    formatDate(date){
        return date === null ? null : new Date(date).toLocaleString().split(',')[0];
    }

    handleOkAutoCompleteManufacturer = (value) => {
        let filter = this.state.filters;
        filter['manufacturerId'] = value.id;
        this.onChangeInput(filter)
    }

    handleOkAutoCompleteDepartment = (value) => {
        let filter = this.state.filters;
        filter['departmentId'] = value.id;
        this.onChangeInput(filter)
    }

    handleOkAutoCompleteType = (value) => {
        let filter = this.state.filters;
        filter['typeId'] = value.id;
        this.onChangeInput(filter)
    }

    handleOkAutoCompleteTags = (value) => {
        let filter = this.state.filters;
        filter['tagId'] = value.id;
        this.onChangeInput(filter)
    }

    componentDidUpdate(){
        if (this.state.dataSource)
            this.setState({loading: false})
    }

    getData = async(page, size, sorter) => {
        this.setState({...this.state, loading: true})

        if (typeof(page) == 'undefined' && typeof(size) == 'undefined')
        {
            const data = await agent.EquipmentService.view(this.state.currentPage, this.state.pageSize, this.state.sorter, this.state.filters)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.EquipmentService.view(page, size, sorter, this.state.filters)
            this.setState({dataSource: data, currentPage: page, pageSize: size, loading: false, sorter: sorter})
        }
        
    }

    async componentDidMount(){
        this.getData()
        this.setState({...this.state, cols: this.state.columns.filter(it => it.visible == true)})
    }

    handlePageChange(changes){
        this.getData(changes.pagination.currentPage, changes.pagination.pageSize, changes.sorter)
    }

    rowSelection = {
        onSelect: (record, selected) => {
            if (selected)
            {
                this.setState(prevState => ({
                        selectedRow: [...prevState.selectedRow, record]
                    })
                )

                if (this.props.onSelect)
                    this.props.onSelect(record);
            }
            else
                this.setState(prevState => ({
                        selectedRow: [...prevState.selectedRow.filter(el => el.id != record.id)]
                    })
                )
        },
        onSelectAll: (selected, records) => {
            this.setState({...this.state, selectedRow: records})
        }
    }

    sentToCheck = async () => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для отправки на поверку.");
            return;
        }

        let obj = {
            verifications: []
        }

        this.state.selectedRow.forEach(el => {
            obj.verifications.push({ equipmentId: el.id })
        })

        let result = await agent.VerificationService.add(obj);

        if (result)
            Toast.info('Оборудование добавлено на поверку')
    }

    handleModalCreate = (value) => {
        this.setState({...this.state, showModalCreate: value});
    }

    handleModalCreateCopy = (value) => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для создания копии.");
            return;
        }

        this.setState({...this.state, showModalCreate: value });
    }

    openCard(record){
        history.push(`/equipment/view/${record.id}`)
    }

    copyAdd(record){
        console.log('copyAdd')
    }

    handleShowColumns = (value) => {
        this.setState({...this.state, showColumns: value})
        setTimeout(() => {
            let doc = document.getElementsByClassName('semi-sidesheet-content')
            if (doc.length > 0) 
                doc[0].style.overflow = 'visible'
        }, 1000)
    }

    handleShowFilter = (value) => {
        this.setState({...this.state, showFilter: value})
        setTimeout(() => {
            let doc = document.getElementsByClassName('semi-sidesheet-content')
            if (doc.length > 0) 
                doc[0].style.overflow = 'visible'
        }, 1000)
    }

    changeVisibleColumn = (item) => {
        let columns = this.state.columns;
        columns.forEach(it => {
            if (it.dataIndex == item.target['aria-label'])
            {
                it.visible = !it.visible
            }
        })

        this.setState({...this.state, cols: columns.filter(it => it.visible == true)})
    }

    onChangeInput = (value) => {
        this.setState({...this.state, filters: value})
        setTimeout(() => {
            this.getData()
        }, 100)
    }

    handleDelete = async () => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрана запись для удаления.");
            return;
        }

        const result = await agent.EquipmentService.delete(this.state.selectedRow[0]['id'])

        if (result)
            Toast.info('Запись удалена')
    }

    render() {
        return (
            <>
                <Table
                columns={this.state.cols}
                dataSource={this.state.dataSource.data}
                loading={this.state.loading}
                resizable
                bordered
                showHeader={true}
                rowKey={'id'}
                title={<Toolbar
                    header={'Оборудование'}
                    onGet={this.getData}
                    handleShowFilter={this.handleShowFilter}
                    handleShowColumns={this.handleShowColumns}
                    showCreate={this.handleModalCreate}
                    onSentToCheck={this.sentToCheck}
                    onCreateCopy={this.handleModalCreateCopy}
                    onDelete={this.handleDelete}
                    />}
                rowSelection={this.rowSelection}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true
                }}
                size={'small'}
                />
                <PanelFilter show={this.state.showFilter} onCancel={this.handleShowFilter} onChange={this.onChangeInput} filters={this.state.filters} columns={this.state.columns}/>
                <PanelAppearance onChangeVisibleColumn={this.changeVisibleColumn} columns={this.state.columns} show={this.state.showColumns} onCancel={this.handleShowColumns}/>
                <ModalCreate onCopy={this.state.selectedRow[0]?.id} onClose={this.handleModalCreate} show={this.state.showModalCreate} />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentView);
