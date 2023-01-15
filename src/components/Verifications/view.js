import React from 'react';
import { connect } from 'react-redux';
import { Table, Toast  } from '@douyinfe/semi-ui'
import { IconTickCircle } from '@douyinfe/semi-icons';

import agent from '../../agent';
import {
  
} from '../../constants/actionTypes';
import ModalPassedVerification from './modal/passed';
import ButtonOpenCard from './../common/buttonOpenCard';
import Toolbar from './toolbar';
import PanelAppearance from './../common/panelAppearance';
import PanelFilter from './../common/panelFilter';
import AutoCompleteDepartment from "../Department/autoComplete";
import "../style.css";

const mapStateToProps = state => ({
  ...state.EquipmentView,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({

    // onUnload: () =>
    //   dispatch({ type: ARTICLE_PAGE_UNLOADED })
  });

class VerificationsView extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            currentPage: 1,
            pageSize: 20,
            sorter: {},
            dataSource: [],
            selectedRow: [],
            showPassed: false,
            passedEquipment: {},
            showColumns: false,
            showFilter: false,
            columns: [
                { renderFilter: () => { return <AutoCompleteDepartment form={true} key={'1'} onOk={this.handleOkAutoComplete}/>}, type: 'text', filterIndex: '', inFilter: true, inAppearance: true, visible: true, title: 'Подразделение', dataIndex: 'equipment.department.name', width: 200, sorter: (a, b) => a.equipment.department.name - b.equipment.department.name > 0 ? 1 : -1 },
                { type: 'text', filterIndex: '', inFilter: true, inAppearance: true, visible: true, title: 'Номер оборудования', dataIndex: 'equipment.number', width: 95, sorter: (a, b) => a.equipment.number - b.equipment.number > 0 ? 1 : -1 },
                { type: 'text', filterIndex: 'equipmentName', inFilter: true, inAppearance: true, visible: true, title: 'Наименование оборудования', dataIndex: 'equipment.name', width: 200, sorter: (a, b) => a.equipment.name - b.equipment.name > 0 ? 1 : -1 },
                { type: 'text', filterIndex: 'equipmentModel', inFilter: true, inAppearance: true, visible: true, title: 'Модель', dataIndex: 'equipment.model', width: 200, sorter: (a, b) => a.equipment.model - b.equipment.model > 0 ? 1 : -1 },
                { type: 'text', filterIndex: 'equipmentSerialNumber', inFilter: true, inAppearance: true, visible: true, title: 'Серийный номер', dataIndex: 'equipment.serialNumber', width: 200, sorter: (a, b) => a.equipment.serialNumber - b.equipment.serialNumber > 0 ? 1 : -1 },
                { type: 'text', filterIndex: '', inFilter: false, inAppearance: true, visible: true, title: 'Состояние', dataIndex: 'status.name', width: 120, sorter: (a, b) => a.status.name - b.status.name > 0 ? 1 : -1 },
                { inFilter: false, inAppearance: false, visible: true,title: '', dataIndex: 'actions', width: 50, render: (text, record, index) =>  <ButtonOpenCard content={"Заполнить поверку"} icon={<IconTickCircle />} onClick={(e) => this.onPassedVerification(record, true)} record={record} disabled={record.statusId == 1 || record.statusId == 3} />}
            ],
            cols: [],
            filters: {
                equipmentName: '',
                equipmentModel: '',
                equipmentSerialNumber: '',
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
            const data = await agent.VerificationService.view(this.state.currentPage, this.state.pageSize, this.state.sorter, this.state.filters)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.VerificationService.view(page, size, sorter, this.state.filters)
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
    
    showAdd = value => {
        this.setState({...this.state, showVo: value});
    }

    // Запустить поверку.
    onStartVerification = async () => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для отправки на поверку.");
            return;
        }

        let obj = { verifications: [] }

        this.state.selectedRow.forEach(el => {
            obj.verifications.push({ equipmentId: el.id })
        })
  
        let badEq = this.state.selectedRow.filter(el => el.statusId >= 2) 
  
        if (badEq.length > 0)
        {
            Toast.warning("Оборудование не отправлено на поверку. Проверьте состояние!");
            return;
        }

        let result = await agent.VerificationService.play(obj);

        if (result.succeeded)
            this.getData()
        else
            Toast.warning(result.message)
    }

    // Отменить поверку.
    onCancelVerification = async () => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для отмены поверки.");
            return;
        }
  
        let badEq = this.state.selectedRow.filter(el => el.statusId > 2) 
  
        if (badEq.length > 0)
        {
            Toast.warning("Отменить поверку не возможно. Проверьте состояние!");
            return
        }
  
        let obj = { verifications: [] }
  
        this.state.selectedRow.forEach(el => {
          obj.verifications.push({ verificationId: el.id })
        })
  
        let result = await agent.VerificationService.reset(obj);

        if (result.succeeded)
            this.getData()
        else
            Toast.warning(result.message)
    }

    // Удаление записи
    onDeleteVerification = async () => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для отмены удаления.");
            return;
        }
  
        let badEq = this.state.selectedRow.filter(el => el.statusId > 1) 
  
        if (badEq.length > 0)
        {
            Toast.warning("Удаление оборудования не возможно. Проверьте состояние!");
            return
        }
  
        let obj = { verifications: [] }
  
        this.state.selectedRow.forEach(el => {
          obj.verifications.push({ equipmentId: el.id })
        })

        let result = await agent.VerificationService.delete(obj);

        if (result.succeeded)
            this.getData()
        else
            Toast.warning(result.message)
    }

    // Отдать в отделю
    onReturnToDepartment = async () => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для возврата в отдел.");
            return;
        }
  
        let badEq = this.state.selectedRow.filter(el => el.statusId < 3)
  
        if (badEq.length > 0) {
          Toast.warning("Невозможно вернуть в отдел. Проверьте состояние!");
          return
        }
  
        let obj = { verifications: [] }
  
        this.state.selectedRow.forEach(el => {
          obj.verifications.push({ verificationId: el.id })
        })
  
        let result = await agent.VerificationService.return(obj);

        if (result.succeeded)
            this.getData()
        else
            Toast.warning(result.message)
    }

    onPassedVerification = (record, value) => {
        this.setState({...this.state, showPassed: value, passedEquipment: record})
    }

    onOkPassed = () => {
        setTimeout(() => {
            this.getData()
        }, 1000)
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
        if (value != null)
            this.setState({...this.state, filters: value})
        else
        {
            let filter = this.state.filters;
            Object.keys(filter).forEach(key => filter[key] = '')
        }
        
        this.getData()
    }

    handleDelete = async () => {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрана запись для удаления.");
            return;
        }

        const result = await agent.VerificationService.delete(this.state.selectedRow[0]['id'])

        if (result)
            Toast.info('Запись удалена')
    }
    
    render() {        
        return (
            <>
            <div className="style_Toolbar">
            <Toolbar 
                    header={'Поверки'}
                    onGet={this.getData}
                    onStartVerification={this.onStartVerification}
                    onCancelVerification={this.onCancelVerification}
                    onReturnToDepartment={this.onReturnToDepartment}
                    // onDeleteVerification={this.onDeleteVerification}
                    handleShowFilter={this.handleShowFilter}
                    handleShowColumns ={this.handleShowColumns}
                    onDelete={this.handleDelete} 
                    />
            </div>
            <div className="style_Tab">
                <Table
                columns={this.state.cols}
                dataSource={this.state.dataSource.data}
                loading={this.state.loading}
                resizable
                bordered
                showHeader={true}
                rowKey={'id'}
                rowSelection={this.rowSelection}
                scroll={{ y: 600, x: 0 }}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true,
                    position: "top",
                }}/>
                <PanelFilter show={this.state.showFilter} onCancel={this.handleShowFilter} onChange={this.onChangeInput} filters={this.state.filters} columns={this.state.columns}/>
                <PanelAppearance onChangeVisibleColumn={this.changeVisibleColumn} columns={this.state.columns} show={this.state.showColumns} onCancel={this.handleShowColumns}/>
                <ModalPassedVerification onClose={this.onPassedVerification} onOk={this.onOkPassed} show={this.state.showPassed} passedEquipment={this.state.passedEquipment}/>
                </div>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerificationsView);
