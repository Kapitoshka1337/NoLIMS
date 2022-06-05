import React from 'react';
import { connect } from 'react-redux';
import { Table, Toast } from '@douyinfe/semi-ui'
import FileSaver from 'file-saver'

import agent from '../../agent';
import {
  EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
import Toolbar from './toolbar';
import PanelAppearance from './../common/panelAppearance';
import PanelFilter from './../common/panelFilter';
import AutoCompleteDepartment from "../Department/autoComplete";

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

class ChecksView extends React.PureComponent {
    
    constructor(props){
        super(props)

        this.state = {
            loading: true,
            currentPage: 1,
            pageSize: 20,
            sorter: {},
            dataSource: [],
            selectedRow: [],
            showVo: false,
            showColumns: false,
            showFilter: false,
            columns: [
                { type: 'date', inFilter: false, inAppearance: true, visible: true, title: 'Пройденная', dataIndex: 'currentCheck', width: 200, sorter: (a, b) => a.currentCheck - b.currentCheck > 0 ? 1 : -1},
                { type: 'date', inFilter: false, inAppearance: true, visible: true, title: 'Предстоящая', dataIndex: 'nextCheck', width: 200, sorter: (a, b) => a.nextCheck - b.nextCheck > 0 ? 1 : -1},
                { type: 'date', filterIndex: 'currentCheckStart', inFilter: true, inAppearance: false, visible: false, title: 'Пройденная поверка по', width: 200, sorter: (a, b) => a.currentCheck - b.currentCheck > 0 ? 1 : -1},
                { type: 'date', filterIndex: 'currentCheckEnd', inFilter: true, inAppearance: false, visible: false, title: 'Пройденная поверка от', width: 200, sorter: (a, b) => a.currentCheck - b.currentCheck > 0 ? 1 : -1},
                { type: 'date', filterIndex: 'nextCheckStart', inFilter: true, inAppearance: false, visible: false, title: 'Предстоящая поверка от', width: 200, sorter: (a, b) => a.currentCheck - b.currentCheck > 0 ? 1 : -1},
                { type: 'date', filterIndex: 'nextCheckEnd', inFilter: true, inAppearance: false, visible: false, title: 'Предстоящая поверка по', width: 200, sorter: (a, b) => a.currentCheck - b.currentCheck > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'equipment.number', inFilter: false, inAppearance: true, visible: true, title: 'Номер', dataIndex: 'equipment.number' , width: 200, sorter: (a, b) => a.equipment.number - b.equipment.number > 0 ? 1 : -1},
                { renderFilter: () => { return <AutoCompleteDepartment form={true} key={'1'} onOk={this.handleOkAutoComplete}/>}, type: 'text', filterIndex: 'departmentId', inFilter: true, inAppearance: true, visible: true, title: 'Подразделение', dataIndex: 'equipment.department' , width: 200, sorter: (a, b) => a.equipment.department - b.equipment.department > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'equipmentName', inFilter: true, inAppearance: true, visible: true, title: 'Наименование оборудования', dataIndex: 'equipment.name', width: 200, sorter: (a, b) => a.equipment.name - b.equipment.name > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'equipment.type', inFilter: false, inAppearance: true, visible: true, title: 'Вид', dataIndex: 'equipment.type', width: 200, sorter: (a, b) => a.equipment.type - b.equipment.type > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'equipmentModel', inFilter: true, inAppearance: true, visible: true, title: 'Модель', dataIndex: 'equipment.model', width: 200, sorter: (a, b) => a.quipment.model - b.quipment.model > 0 ? 1 : -1},
                { type: 'text', filterIndex: 'equipmentSerialNumber', inFilter: true, inAppearance: true, visible: true, title: 'С/Н', dataIndex: 'equipment.serialNumber', width: 200, sorter: (a, b) => a.equipment.serialNumber - b.equipment.serialNumber > 0 ? 1 : -1},
            ],
            cols: [],
            filters: {
                currentCheckStart: '',
                currentCheckEnd: '',
                nextCheckStart: '',
                nextCheckEnd: '',
                equipmentName: '',
                equipmentModel: '',
                equipmentSerialNumber: '',
                departmentId: ''
            }
        }
    }

    handleOkAutoComplete = (value) => {
        let filter = this.state.filters;
        filter['departmentId'] = value.id;
        this.onChangeInput(filter)
    }

    componentDidUpdate(){
        if (this.state.dataSource)
            this.setState({loading: false})
    }

    getData = async (page, size, sorter) => {
        this.setState({...this.state, loading: true})

        if (typeof(page) == 'undefined' && typeof(size) == 'undefined')
        {
            const data = await agent.ChecksService.view(this.state.currentPage, this.state.pageSize, this.state.sorter, this.state.filters)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.ChecksService.view(page, size, sorter, this.state.filters)
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

    sentToCheck = async() => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для отправки на поверку.");
            return;
        }

        let obj = {
            equipments: []
        }

        this.state.selectedRow.forEach(el => {
            obj.equipments.push({ equipmentId: el.equipment.id })
        })

        let result = await agent.VerificationService.add(obj);

        if (result)
            Toast.info('Оборудование добавлено на поверку')
    }

    showAdd = value => {
        this.setState({...this.state, showVo: value});
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

    handleDownload = async () => {

        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрана поверка для экспорта документа.");
            return;
        }

        if (this.state.selectedRow[0].fileId == null)
        {
            Toast.warning("Отсутствует документ для экспорта.")
            return;
        }

            // this.$toast.info("Начат экспорт файла.");
            const result = await agent.FileService.download(this.state.selectedRow[0].fileId)
            if (result)
            {
                console.log(result)
                const fl = new Blob([result.text], {type: result.type});
                FileSaver.saveAs(fl, "Документ");
            }
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
                title={<Toolbar header={'Журнал поверок'} onGet={this.getData} handleShowFilter={this.handleShowFilter} handleShowColumns={this.handleShowColumns} onSentToCheck={this.onSentToCheck} handleDownload ={this.handleDownload}
                    />}
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
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChecksView);
