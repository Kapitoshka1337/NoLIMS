import React from 'react';
import { connect } from 'react-redux';
import { Table, Nav, Toast, Button } from '@douyinfe/semi-ui'
import { IconRefresh, IconFilledArrowUp, IconPlay, IconDelete, IconStop, IconPrint, IconTickCircle } from '@douyinfe/semi-icons';

import agent from '../../agent';
import {
  EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
import ModalPassedVerification from './modal/passed';
import reactRouterDom from 'react-router-dom';

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
            passedEquipment: {}
        }
    }

    componentDidUpdate(){
        if (this.state.dataSource)
            this.setState({loading: false})
    }

    async getData(page, size, sorter){
        this.setState({...this.state, loading: true})

        if (typeof(page) == 'undefined' && typeof(size) == 'undefined')
        {
            const data = await agent.VerificationService.view(this.state.currentPage, this.state.pageSize, this.state.sorter)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.VerificationService.view(page, size, sorter)
            this.setState({dataSource: data, currentPage: page, pageSize: size, loading: false, sorter: sorter})
        }
        
    }

    async componentDidMount(){
        this.getData()
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

    async sentToCheck(){
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

    showAdd = value => {
        this.setState({...this.state, showVo: value});
    }

    // Запустить поверку.
    async onStartVerification() {
        if (this.state.selectedRow == null || this.state.selectedRow.length <= 0)
        {
            Toast.warning("Не выбрано оборудование для отправки на поверку.");
            return;
        }

        let obj = { equipments: [] }

        this.state.selectedRow.forEach(el => {
            obj.equipments.push({ equipmentId: el.id })
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
    async onCancelVerification(){
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
    async ontDeleteVerification() {
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
  
        let obj = { equipments: [] }
  
        this.state.selectedRow.forEach(el => {
          obj.equipments.push({ equipmentId: el.id })
        })

        let result = await agent.VerificationService.delete(obj);

        if (result.succeeded)
            this.getData()
        else
            Toast.warning(result.message)
    }

    // Отдать в отделю
    async onReturnToDepartment() {
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
        this.getData()
    }

    render() {
        const columns = [
            { title: 'Подразделение', dataIndex: 'equipment.department.name', width: 200, sorter: (a, b) => a.equipment.department.name - b.equipment.department.name > 0 ? 1 : -1 },
            { title: 'Номер оборудования', dataIndex: 'equipment.number', width: 200, sorter: (a, b) => a.equipment.number - b.equipment.number > 0 ? 1 : -1 },
            { title: 'Наименование оборудования', dataIndex: 'equipment.name', width: 200, sorter: (a, b) => a.equipment.name - b.equipment.name > 0 ? 1 : -1 },
            { title: 'Модель', dataIndex: 'equipment.model', width: 200, sorter: (a, b) => a.equipment.model - b.equipment.model > 0 ? 1 : -1 },
            { title: 'Серийный номер', dataIndex: 'equipment.serialNumber', width: 200, sorter: (a, b) => a.equipment.serialNumber - b.equipment.serialNumber > 0 ? 1 : -1 },
            { title: 'Состояние', dataIndex: 'status.name', width: 200, sorter: (a, b) => a.status.name - b.status.name > 0 ? 1 : -1 },
            { title: '', dataIndex: 'actions', width: 100, render: (text, record, index) => {
                return (
                    <>
                        <Button 
                            icon={<IconTickCircle />} 
                            aria-label={'Получить с поверки'} 
                            theme={'borderless'} 
                            type={'tertiary'} 
                            onClick={(e) => this.onPassedVerification(record, true)} 
                            disabled={record.statusId == 1 || record.statusId == 3}
                        />
                    </>
                );
            }}
        ];

        return (
            <>
                <Table
                columns={columns}
                dataSource={this.state.dataSource.data}
                loading={this.state.loading}
                resizable
                bordered
                showHeader={true}
                rowKey={'id'}
                title={<Nav
                    header={{text: 'Поверки'}}
                    style={{padding: 0}}
                    mode={'horizontal'}
                    items={
                        [
                            { itemKey: 'update', text: 'Обновить', icon: <IconRefresh />, onClick: (e) => this.getData() },
                            { itemKey: 'startVerification', text: 'Запустить поверку', icon: <IconPlay />, onClick: (e) => this.onStartVerification() },
                            { itemKey: 'cancelVerification', text: 'Отменить поверку', icon: <IconStop />, onClick: (e) => this.onCancelVerification() },
                            { itemKey: 'toDepartment', text: 'Отдать в отдел', icon: <IconFilledArrowUp />, onClick: (e) => this.onReturnToDepartment() },
                            { itemKey: 'printOrder', text: 'Печать заявки в ЦСМ', icon: <IconPrint /> },
                            { itemKey: 'delete', text: 'Удалить запись', icon: <IconDelete />, onClick: (e) => this.ontDeleteVerification(), disabled: true },
                        ]
                    } 
                    />}
                rowSelection={this.rowSelection}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true
                }}/>
                <ModalPassedVerification onClose={this.onPassedVerification} onOk={this.onOkPassed} show={this.state.showPassed} passedEquipment={this.state.passedEquipment}/>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerificationsView);
