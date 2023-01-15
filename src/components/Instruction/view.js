import React from "react";
import { connect } from "react-redux";
import { Table, Toast } from "@douyinfe/semi-ui";
import FileSaver from "file-saver";
import { history } from "../../store";

import agent from '../../agent';
import {
  
} from '../../constants/actionTypes';
import Toolbar from './toolbar';
import PanelAppearance from './../common/panelAppearance';
import PanelFilter from './../common/panelFilter';
import ButtonOpenCard from './../common/buttonOpenCard';
import ModalCreate from './modalCreate'

const mapStateToProps = (state) => ({
  ...state.EquipmentView,
  currentUser: state.common.currentUser,
  token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({

    // onUnload: () =>
    //   dispatch({ type: ARTICLE_PAGE_UNLOADED })
  });

class InstructionView extends React.PureComponent {
  constructor(props) {
    super(props);

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
      showCreate: false,
      columns: [
        {
          type: "text",
          filterIndex: "number",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Номер",
          dataIndex: "number",
          width: 50,
          sorter: (a, b) => (a.number - b.number > 0 ? 1 : -1),
        },
        {
          type: "text",
          filterIndex: "name",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Наименование",
          dataIndex: "name",
          width: 100,
          sorter: (a, b) => (a.name - b.name > 0 ? 1 : -1),
        },
        {
          inFilter: false,
          inAppearance: false,
          visible: true,
          title: "",
          dataIndex: "actions",
          width: 50,
          render: (text, record, index) => (
            <ButtonOpenCard onClick={this.openCard} record={record} />
          ),
        },
      ],
      cols: [],
      filters: {
        name: "",
        number: "",
      },
    };
  }

  componentDidUpdate() {
    if (this.state.dataSource) this.setState({ loading: false });
  }

  getData = async (page, size, sorter) => {
    this.setState({ ...this.state, loading: true });

    if (typeof page == "undefined" && typeof size == "undefined") {
      const data = await agent.InstructionService.view(
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
      const data = await agent.InstructionService.view(
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

  showAdd = (value) => {
    this.setState({ ...this.state, showVo: value });
  };

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

  handleDownload = async () => {
    if (this.state.selectedRow == null || this.state.selectedRow.length <= 0) {
      Toast.warning("Не выбрана поверка для экспорта документа.");
      return;
    }

    if (this.state.selectedRow[0].fileId == null) {
      Toast.warning("Отсутствует документ для экспорта.");
      return;
    }

    const result = await agent.FileService.download(
      this.state.selectedRow[0].fileId
    );
    if (result) {
      const fl = new Blob([result], { type: result["type"] });
      FileSaver.saveAs(fl, "Инструкция ");
    }
  };

  handleDelete = async () => {
    if (this.state.selectedRow == null || this.state.selectedRow.length <= 0) {
      Toast.warning("Не выбрана запись для удаления.");
      return;
    }

    const result = await agent.ChecksService.delete(
      this.state.selectedRow[0]["id"]
    );

    if (result) Toast.info("Запись удалена");
  };

  openCard = (record) => {
    history.push(`/equipment/instruction/view/${record.id}`);
  };

  showCreate = (value) => {
    this.setState({ ...this.state, showCreate: value });
  };

  onCreate = (value) => {
    this.getData();
  };

  render() {
    return (
      <>
        <div className="style_Toolbar">
          <Toolbar
            header={"Инструкции"}
            onGet={this.getData}
            handleShowFilter={this.handleShowFilter}
            handleShowColumns={this.handleShowColumns}
            onSentToCheck={this.handleSentToCheck}
            handleDownload={this.handleDownload}
            handlepPrintSticker={this.handlepPrintSticker}
            handlepPrintCheckTable={this.handlepPrintCheckTable}
            onDelete={this.handleDelete}
            showCreate={this.showCreate}
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
        </div>
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
        <ModalCreate
          onClose={this.showCreate}
          onOk={this.onCreate}
          show={this.state.showCreate}
        />
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InstructionView);
