import React from 'react';
import { connect } from 'react-redux';
import { Table, Button, SideSheet } from '@douyinfe/semi-ui'
import { IconIdCard } from '@douyinfe/semi-icons';

import agent from '../../agent';
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
import ModalCreateDepartment from './modalCreate'
import Toolbar from './toolbar'
import { history } from '../../store';
import ButtonOpenCard from './../common/buttonOpenCard';

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload })
  });


class DepartmentView extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            currentPage: 1,
            pageSize: 20,
            sorter: {},
            dataSource: [],
            selectedRow: [],
            showCreate: false,
            showFilter: false
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
            const data = await agent.DepartmentService.view(this.state.currentPage, this.state.pageSize, this.state.sorter)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.DepartmentService.view(page, size, sorter)
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
        history.push(`/base/department/view/${record.id}`)
    }

    handleShowFilter = (value) => {
        this.setState({...this.state, showFilter: value})
        setTimeout(() => {
            let doc = document.getElementsByClassName('semi-sidesheet-content')
            if (doc.length > 0) 
                doc[0].style.overflow = 'visible'
        }, 1000)
    }

    render() {
        const columns = [
            { title: 'Наименование', dataIndex: 'name', width: 200, sorter: (a, b) => a.name - b.name > 0 ? 1 : -1, 
                // filterDropdown: 
                // <Dropdown
                // trigger={'click'}
                // position={'bottomLeft'}
                // render={
                //     <Dropdown.Menu>
                //         <Dropdown.Item key={1}>
                //             <Input field='name' placeholder={'Наименование'} trigger='blur'/>
                //         </Dropdown.Item>
                //     </Dropdown.Menu>
                // }
                // >
                // <Button icon={<IconFilter/>} theme={'borderless'} type={'tertiary'} />
            // </Dropdown>,
            },
            { title: 'Номер', dataIndex: 'number', width: 200, sorter: (a, b) => a.number - b.number > 0 ? 1 : -1},
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
                title={<Toolbar header={'Подразделения'} getData={this.getData} showCreate={this.showCreate} handleShowFilter={this.handleShowFilter} roles={this.roles} />}
                rowSelection={this.rowSelection}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true
                }}/>
                <SideSheet getPopupContainer={null} disableScroll={false} title="Панель фильтрации" mask={false} visible={this.state.showFilter} onCancel={() => this.handleShowFilter(false)} size={"medium"}>
                <p>This is the content of a basic sidesheet.</p>
                <p>Here is more content...</p>
                </SideSheet>
                <ModalCreateDepartment onClose={this.showCreate} onOk={this.onCreate} show={this.state.showCreate}/>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentView);
