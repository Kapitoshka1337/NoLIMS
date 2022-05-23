import React from 'react';
import { connect } from 'react-redux';
import { Table, SideSheet, Checkbox, Input } from '@douyinfe/semi-ui'

import agent from '../../agent';
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
import ModalCreateDepartment from './modalCreate'
import Toolbar from './toolbar'
import { history } from '../../store';
import ButtonOpenCard from './../common/buttonOpenCard';
import PanelAppearance from './../common/panelAppearance';

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
            showFilter: false,
            showColumns: false,
            columns: [
                { type: 'text', visible: true, title: 'Наименование', dataIndex: 'name', width: 200, sorter: (a, b) => a.name - b.name > 0 ? 1 : -1, 
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
                { type: 'text', visible: true, title: 'Номер', dataIndex: 'number', width: 200, sorter: (a, b) => a.number - b.number > 0 ? 1 : -1},
                { visible: true, title: '', dataIndex: 'actions', width: '12px', render: (text, record, index) => <ButtonOpenCard onClick={this.openCard} record={record} />}
            ],
            cols: [],
            filters: {
                name: '',
                number: ''
            }
        }
    }

    componentDidUpdate(){
        if (this.state.dataSource)
            this.setState({loading: false})
    }

    getData = async (page, size, sorter, filters) => {
        // debugger
        // this.setState({...this.state, loading: true})

        if (typeof(page) == 'undefined' && typeof(size) == 'undefined')
        {
            const data = await agent.DepartmentService.view(this.state.currentPage, this.state.pageSize, this.state.sorter, this.state.filters)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.DepartmentService.view(page, size, sorter, this.state.filters)
            this.setState({dataSource: data, currentPage: page, pageSize: size, loading: false, sorter: sorter})
        }
        
    }

    async componentDidMount(){
        this.getData()
        this.setState({...this.state, cols: this.state.columns})
    }

    handlePageChange(changes){
        this.getData(changes.pagination.currentPage, changes.pagination.pageSize, changes.sorter, this.state.filters)
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

    handleShowColumns = (value) => {
        this.setState({...this.state, showColumns: value})
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

    changeName = (value, e, column) => {
        let filter = this.state.filters;
        filter[column] = value;
        this.setState({...this.state, filters: filter})
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
                title={<Toolbar header={'Подразделения'} getData={this.getData} showCreate={this.showCreate} handleShowFilter={this.handleShowFilter} handleShowColumns ={this.handleShowColumns} roles={this.roles} />}
                rowSelection={this.rowSelection}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true
                }}/>
                <SideSheet getPopupContainer={null} disableScroll={false} title="Панель фильтрации" mask={true} visible={this.state.showFilter} onCancel={() => this.handleShowFilter(false)} size={"small"}>
                    {
                        this.state.columns.map((column) => {
                            if (column.dataIndex != 'actions')
                                return (
                                    <Input key={column.dataIndex} type={column.type} placeholder={column.title} value={this.state.filters[column.dataIndex]} onChange={(value, event) => this.changeName(value, event, column.dataIndex)}/>
                                    )
                        })
                    }
                </SideSheet>
                <PanelAppearance onChangeVisibleColumn={this.changeVisibleColumn} columns={this.state.columns} show={this.state.showColumns} onCancel={this.handleShowColumns}/>
                <ModalCreateDepartment onClose={this.showCreate} onOk={this.onCreate} show={this.state.showCreate}/>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentView);
