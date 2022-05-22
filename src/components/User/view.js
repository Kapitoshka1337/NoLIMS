import React from 'react';
import { connect } from 'react-redux';
import { Table} from '@douyinfe/semi-ui'

import { history } from '../../store';
import agent from '../../agent';
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
import ModalCreateUser from './modalCreate'
import Toolbar from './toolbar'
import ButtonOpenCard from '../common/buttonOpenCard'

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload })
  });

class UsersView extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            currentPage: 1,
            pageSize: 20,
            sorter: {},
            dataSource: [],
            selectedRow: [],
            showCreate: false
        }
    }

    componentDidUpdate(){
        if (this.state.dataSource)
            this.setState({loading: false})
    }

    getData = async (page, size, sorter) => {
        this.setState({...this.state, loading: true})

        if (typeof(page) == 'undefined' && typeof(size) == 'undefined')
        {
            const data = await agent.UsersService.view(this.state.currentPage, this.state.pageSize, this.state.sorter)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.UsersService.view(page, size, sorter)
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
            {
                this.setState(prevState => ({
                        selectedRow: [...prevState.selectedRow, record]
                    })
                )

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

    showCreate = value => {
        this.setState({...this.state, showCreate: value});
    }

    onCreate = value => {
        this.getData()
    }

    openCard(record){
        history.push(`/administrator/user/view/${record.id}`)
    }

    render() {
        const columns = [
            { title: 'Имя', dataIndex: 'firstName', width: 200, sorter: (a, b) => a.firstName - b.firstName > 0 ? 1 : -1},
            { title: 'Фамилия', dataIndex: 'middleName', width: 200, sorter: (a, b) => a.middleName - b.middleName > 0 ? 1 : -1},
            { title: 'Отчество', dataIndex: 'lastName', width: 200, sorter: (a, b) => a.lastName - b.lastName > 0 ? 1 : -1},
            { title: 'Учетная запись', dataIndex: 'userName', width: 200, sorter: (a, b) => a.userName - b.userName > 0 ? 1 : -1},
            { title: '', dataIndex: 'actions', width: 100, render: (text, record, index) => <ButtonOpenCard onClick={this.openCard} record={record} />}
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
                title={<Toolbar header={'Сотрудники'} getData={this.getData} showCreate={this.showCreate} handleShowFilter={this.handleShowFilter} roles={this.roles} />}
                rowSelection={this.rowSelection}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true
                }}
                />
                <ModalCreateUser onClose={this.showCreate} onOk={this.onCreate} show={this.state.showCreate} />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
