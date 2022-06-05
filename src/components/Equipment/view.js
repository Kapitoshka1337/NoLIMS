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
import Toolbar from './toolbar';
import PanelAppearance from './../common/panelAppearance';
import PanelFilter from './../common/panelFilter';

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
                { type: 'text', filterIndex: 'number', inFilter: true, inAppearance: true, visible: true, title: 'Номер', dataIndex: 'number', width: 200, sorter: (a, b) => a.number - b.number > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'departmentId', inFilter: true, inAppearance: true, visible: true, title: 'Отдел', dataIndex: 'department.name', width: 200, sorter: (a, b) => a.department.name - b.department.name > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'typeId', inFilter: true, inAppearance: true, visible: true, title: 'Тип', dataIndex: 'type.name', width: 200, sorter: (a, b) => a.type.name - b.type.name > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'name', inFilter: true, inAppearance: true, visible: true, title: 'Наименование', dataIndex: 'name' , width: 200, sorter: (a, b) => a.name - b.name > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'model', inFilter: true, inAppearance: true, visible: true, title: 'Модель', dataIndex: 'model', width: 200, sorter: (a, b) => a.model - b.model > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'serialNumber', inFilter: true, inAppearance: true, visible: true, title: 'С/Н', dataIndex: 'serialNumber', width: 200, sorter: (a, b) => a.serialNumber - b.serialNumber > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'tagId', inFilter: true, inAppearance: true, visible: true, title: 'Статус', dataIndex: 'tag.name', width: 200, sorter: (a, b) => a.tag.name - b.tag.name > 0 ? 1 : -1},
                { inFilter: false, inAppearance: false, visible: true, title: '', dataIndex: 'actions', width: 100, render: (text, record, index) => <ButtonOpenCard onClick={this.openCard} record={record} />}
            ],
            cols: [],
            filters: {
                number: '',
                departmentId: '',
                typeId: '',
                name: '',
                model: '',
                serialNumber: '',
                tagId: ''
            }
        }
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
                this.setState(prevState => ({
                        selectedRow: [...prevState.selectedRow, record]
                    })
                )
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
            equipments: []
        }

        this.state.selectedRow.forEach(el => {
            obj.equipments.push({ equipmentId: el.id })
        })

        let result = await agent.VerificationService.add(obj);

        if (result)
            Toast.info('Оборудование добавлено на поверку')
    }

    handleModalCreate = value => {
        this.setState({...this.state, showModalCreate: value});
    }

    openCard(record){
        history.push(`/equipment/view/${record.id}`)
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
                title={<Toolbar header={'Оборудование'} onGet={this.getData} handleShowFilter={this.handleShowFilter} handleShowColumns ={this.handleShowColumns} showCreate={this.handleModalCreate} onSentToCheck={this.sentToCheck}/>}
                rowSelection={this.rowSelection}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true
                }}/>
                <PanelFilter show={this.state.showFilter} onCancel={this.handleShowFilter} onChange={this.onChangeInput} filters={this.state.filters} columns={this.state.columns}/>
                <PanelAppearance onChangeVisibleColumn={this.changeVisibleColumn} columns={this.state.columns} show={this.state.showColumns} onCancel={this.handleShowColumns}/>
                <ModalCreate onClose={this.handleModalCreate} show={this.state.showModalCreate} />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentView);
