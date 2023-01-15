import React from "react";
import { connect } from "react-redux";
import { Table, Toast } from "@douyinfe/semi-ui";

import Toolbar from "./toolbar";
import PanelAppearance from "./../common/panelAppearance";
import PanelFilter from "./../common/panelFilter";
import AutoCompleteDepartment from "../Department/autoComplete";

import agent from '../../agent';
import {
    
} from '../../constants/actionTypes';
import ModalCreateLocation from './modalCreate'
import { history } from '../../store';
import ButtonOpenCard from './../common/buttonOpenCard';
import { IconTopRightStroked } from '@douyinfe/semi-icons';

const mapStateToProps = (state) => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = (dispatch) => ({
  });

class LocationView extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      loading: true,
      currentPage: 1,
      pageSize: 20,
      sorter: {},
      dataSource: [],
      selectedRow: [],
      showCreate: false,
      showColumns: false,
      showFilter: false,
      columns: [
        {
          type: "text",
          filterIndex: "numberRoom",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Номер кабинета",
          dataIndex: "numberRoom",
          width: 50,
          sorter: (a, b) => (a.numberRoom - b.numberRoom > 0 ? 1 : -1),
        },
        {
          type: "text",
          filterIndex: "departmentId",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Подразделение",
          dataIndex: "department.name",
          width: 200,
          sorter: (a, b) =>
            a.department.name - b.department.name > 0 ? 1 : -1,
          renderFilter: () => {
            return (
              <AutoCompleteDepartment
                form={true}
                key={"1"}
                onOk={this.handleOkAutoComplete}
              />
            );
          },
        },
        {
          inFilter: false,
          inAppearance: false,
          visible: true,
          title: "",
          dataIndex: "actions",
          width: 100,
          render: (text, record, index) => (
            <ButtonOpenCard onClick={this.openCard} record={record} />
          ),
        },
      ],
      cols: [],
      filters: {
        numberRoom: "",
        departmentId: "",
      },
    };
  }

  handleOkAutoComplete = (value) => {
    let filter = this.state.filters;
    filter["departmentId"] = value.id;
    this.onChangeInput(filter);
  };

  componentDidUpdate() {
    if (this.state.dataSource) this.setState({ loading: false });
  }

  getData = async (page, size, sorter) => {
    this.setState({ ...this.state, loading: true });

    if (typeof page == "undefined" && typeof size == "undefined") {
      const data = await agent.LocationService.view(
        this.state.currentPage,
        this.state.pageSize,
        this.state.sorter,
        this.state.filters
      );
      this.setState({
        ...this.state,
        dataSource: data,
        loading: false,
        sorter: sorter,
      });
    } else {
      const data = await agent.LocationService.view(
        page,
        size,
        sorter,
        this.state.filters
      );
      this.setState({
        dataSource: data,
        currentPage: page,
        pageSize: size,
        loading: false,
        sorter: sorter,
      });
    }
  };

  async componentDidMount() {
    this.getData();
    this.setState({
      ...this.state,
      cols: this.state.columns.filter((it) => it.visible == true),
    });
  }

  handlePageChange(changes) {
    this.getData(
      changes.pagination.currentPage,
      changes.pagination.pageSize,
      changes.sorter
    );
  }

  rowSelection = {
    onSelect: (record, selected) => {
      if (selected) {
        this.setState((prevState) => ({
          selectedRow: [...prevState.selectedRow, record],
        }));

        this.props.onSelect ? this.props.onSelect(record) : null;
      } else
        this.setState((prevState) => ({
          selectedRow: [
            ...prevState.selectedRow.filter((el) => el.id != record.id),
          ],
        }));
    },
    onSelectAll: (selected, records) => {
      this.setState({ ...this.state, selectedRow: records });
    },
  };

  showCreate = (value) => {
    this.setState({ ...this.state, showCreate: value });
  };

  onCreate = (value) => {
    this.getData();
  };

  openCard(record) {
    history.push(`/base/location/view/${record.id}`);
  }

  handleShowColumns = (value) => {
    this.setState({ ...this.state, showColumns: value });
    setTimeout(() => {
      let doc = document.getElementsByClassName("semi-sidesheet-content");
      if (doc.length > 0) doc[0].style.overflow = "visible";
    }, 1000);
  };

  handleShowFilter = (value) => {
    this.setState({ ...this.state, showFilter: value });
    setTimeout(() => {
      let doc = document.getElementsByClassName("semi-sidesheet-content");
      if (doc.length > 0) doc[0].style.overflow = "visible";
    }, 1000);
  };

  changeVisibleColumn = (item) => {
    let columns = this.state.columns;
    columns.forEach((it) => {
      if (it.dataIndex == item.target["aria-label"]) {
        it.visible = !it.visible;
      }
    });

    this.setState({
      ...this.state,
      cols: columns.filter((it) => it.visible == true),
    });
  };

  onChangeInput = (value) => {
    this.setState({ ...this.state, filters: value });
    setTimeout(() => {
      this.getData();
    }, 100);
  };

  handleDelete = async () => {
    if (this.state.selectedRow == null || this.state.selectedRow.length <= 0) {
      Toast.warning("Не выбрана запись для удаления.");
      return;
    }

    const result = await agent.LocationService.delete(
      this.state.selectedRow[0]["id"]
    );

    if (result) Toast.info("Запись удалена");
  };

  render() {
    return (
      <>
        <div className="style_Toolbar">
          <Toolbar
            header={"Местоположения"}
            onGet={this.getData}
            handleShowFilter={this.handleShowFilter}
            handleShowColumns={this.handleShowColumns}
            showCreate={this.showCreate}
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
            rowKey={"id"}
            rowSelection={this.rowSelection}
            scroll={{ y: 600, x: 0 }}
            onChange={(changes) => this.handlePageChange(changes)}
            pagination={{
              currentPage: this.state.currentPage,
              pageSize: this.state.pageSize,
              total: this.state.dataSource.totalRecords,
              showSizeChanger: true,
              position: "top",
            }}
          />
          <PanelFilter
            show={this.state.showFilter}
            onCancel={this.handleShowFilter}
            onChange={this.onChangeInput}
            filters={this.state.filters}
            columns={this.state.columns}
          />
          <PanelAppearance
            onChangeVisibleColumn={this.changeVisibleColumn}
            columns={this.state.columns}
            show={this.state.showColumns}
            onCancel={this.handleShowColumns}
          />
          <ModalCreateLocation
            onClose={this.showCreate}
            onOk={this.onCreate}
            show={this.state.showCreate}
          />
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationView);
