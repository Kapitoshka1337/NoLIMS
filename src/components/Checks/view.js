import React from 'react';
import { connect } from 'react-redux';
import { Table, Nav, Toast } from '@douyinfe/semi-ui'
import { IconRefresh, IconPlus, IconVerify } from '@douyinfe/semi-icons';

import agent from '../../agent';
import {
  EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
// import ModalCreateVO from './modal/modalCreateVO';

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
    
    constructor(){
        super()

        this.state = {
            loading: true,
            currentPage: 1,
            pageSize: 20,
            sorter: {},
            dataSource: [],
            selectedRow: [],
            showVo: false
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
            const data = await agent.ChecksService.view(this.state.currentPage, this.state.pageSize, this.state.sorter)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.ChecksService.view(page, size, sorter)
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
            obj.equipments.push({ equipmentId: el.equipment.id })
        })

        let result = await agent.VerificationService.add(obj);

        if (result)
            Toast.info('Оборудование добавлено на поверку')
    }

    showAdd = value => {
        this.setState({...this.state, showVo: value});
    }

    render() {
        const columns = [
            { title : 'Пройденная', dataIndex: 'currentCheck', width: 200, sorter: (a, b) => a.currentCheck - b.currentCheck > 0 ? 1 : -1},
            { title : 'Предстоящая', dataIndex: 'nextCheck', width: 200, sorter: (a, b) => a.nextCheck - b.nextCheck > 0 ? 1 : -1},
            { title : 'Подразделение', dataIndex: 'equipment.department' , width: 200, sorter: (a, b) => a.equipment.department - b.equipment.department > 0 ? 1 : -1},
            { title : 'Номер', dataIndex: 'equipment.number' , width: 200, sorter: (a, b) => a.equipment.number - b.equipment.number > 0 ? 1 : -1},
            { title : 'Наименование оборудования', dataIndex: 'equipment.name', width: 200, sorter: (a, b) => a.equipment.name - b.equipment.name > 0 ? 1 : -1},
            { title : 'Вид', dataIndex: 'equipment.type', width: 200, sorter: (a, b) => a.equipment.type - b.equipment.type > 0 ? 1 : -1},
            { title : 'Модель', dataIndex: 'equipment.model', width: 200, sorter: (a, b) => a.quipment.model - b.quipment.model > 0 ? 1 : -1},
            { title : 'С/Н', dataIndex: 'equipment.serialNumber', width: 200, sorter: (a, b) => a.equipment.serialNumber - b.equipment.serialNumber > 0 ? 1 : -1},
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
                    header={{text: 'Журнал поверок'}}
                    style={{padding: 0}}
                    mode={'horizontal'}
                    items={
                        [
                            { itemKey: 'update', text: 'Обновить', icon: <IconRefresh />, onClick: (e) => this.getData() },
                            { itemKey: 'create', text: 'Создать', icon: <IconPlus /> },
                            { itemKey: 'toVerification', text: 'Отправить на поверку', icon: <IconVerify />, onClick: (e) => this.sentToCheck() },
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
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChecksView);
