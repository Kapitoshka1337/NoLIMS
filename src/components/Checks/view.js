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
import AutoCompleteEquipment from "../Equipment/autoComplete";
import AutoCompleteDocumentKind from "../DocumentKind/autoComplete";
import ButtonOpenCard from "./../common/buttonOpenCard";
import AutoCompleteType from "../EquipmentTypes/autoComplete";
import AutoCompleteTags from "../EquipmentTags/autoComplete";
import AutoCompleteDepartment from "../Department/autoComplete";
import "../style.css";

const mapStateToProps = (state) => ({
  ...state.EquipmentView,
  currentUser: state.common.currentUser,
  token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({
    // onUnload: () =>
    //   dispatch({ type: ARTICLE_PAGE_UNLOADED })
  });

class ChecksView extends React.PureComponent {
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
      columns: [
        {
          inFilter: false,
          inAppearance: false,
          visible: true,
          title: "",
          dataIndex: "actions",
          width: 30,
          render: (text, record, index) => (
            <ButtonOpenCard onClick={this.openCard} record={record} />
          ),
        },
        {
            renderFilter: (filters) => {
              return (
                <AutoCompleteDepartment
                  filters={filters}
                  form={true}
                  key={"1"}
                  onOk={this.handleOkAutoCompleteDepartment}
                />
              );
            },
            type: "text",
            filterIndex: "departmentId",
            inFilter: true,
            inAppearance: true,
            visible: true,
            title: "Отдел",
            dataIndex: "equipment.department.name",
            width: 100,
            sorter: (a, b) =>
              a.department.name - b.department.name > 0 ? 1 : -1,
          },
        {
          type: "date",
          inFilter: false,
          inAppearance: true,
          visible: true,
          title: "Пройденная",
          dataIndex: "currentCheck",
          width: 55,
          sorter: (a, b) => (a.currentCheck - b.currentCheck > 0 ? 1 : -1),
          render: (text, record, index) => this.formatDate(record.currentCheck),
        },
        {
          type: "date",
          inFilter: false,
          inAppearance: true,
          visible: true,
          title: "Предстоящая",
          dataIndex: "nextCheck",
          width: 55,
          sorter: (a, b) => (a.nextCheck - b.nextCheck > 0 ? 1 : -1),
          render: (text, record, index) => this.formatDate(record.nextCheck),
        },
        {
          type: "date",
          filterIndex: "currentCheckStart",
          inFilter: true,
          inAppearance: false,
          visible: false,
          title: "Пройденная поверка от",
          width: 200,
          sorter: (a, b) => (a.currentCheck - b.currentCheck > 0 ? 1 : -1),
        },
        {
          type: "date",
          filterIndex: "currentCheckEnd",
          inFilter: true,
          inAppearance: false,
          visible: false,
          title: "Пройденная поверка по",
          width: 200,
          sorter: (a, b) => (a.currentCheck - b.currentCheck > 0 ? 1 : -1),
        },
        {
          type: "date",
          filterIndex: "nextCheckStart",
          inFilter: true,
          inAppearance: false,
          visible: false,
          title: "Предстоящая поверка от",
          width: 200,
          sorter: (a, b) => (a.currentCheck - b.currentCheck > 0 ? 1 : -1),
        },
        {
          type: "date",
          filterIndex: "nextCheckEnd",
          inFilter: true,
          inAppearance: false,
          visible: false,
          title: "Предстоящая поверка по",
          width: 200,
          sorter: (a, b) => (a.currentCheck - b.currentCheck > 0 ? 1 : -1),
        },
        // { type: 'text', filterIndex: 'equipment.number', inFilter: false, inAppearance: true, visible: true, title: 'Номер', dataIndex: 'equipment.number' , width: 200, sorter: (a, b) => a.equipment.number - b.equipment.number > 0 ? 1 : -1},
        // { renderFilter: () => { return <AutoCompleteDepartment form={true} key={'1'} onOk={this.handleOkAutoCompleteDepartment}/>}, type: 'text', filterIndex: 'departmentId', inFilter: true, inAppearance: true, visible: true, title: 'Подразделение', dataIndex: 'equipment.department.name' , width: 200, sorter: (a, b) => a.equipment.department - b.equipment.department > 0 ? 1 : -1},
        {
          renderFilter: () => {
            return (
              <AutoCompleteType
                form={true}
                key={"5"}
                onOk={this.handleOkAutoCompleteType}
              />
            );
          },
          type: "text",
          filterIndex: "typeId",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Тип",
          dataIndex: "equipment.type.name",
          width: 30,
          sorter: (a, b) => (a.type.name - b.type.name > 0 ? 1 : -1),
        },
        {
          type: "text",
          filterIndex: "number",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Номер",
          dataIndex: "equipment.number",
          width: 35,
          sorter: (a, b) => (a.number - b.number > 0 ? 1 : -1),
        },
        {
          renderFilter: () => {
            return (
              <AutoCompleteEquipment
                form={true}
                key={"2"}
                onOk={this.handleOkAutoCompleteEquipment}
              />
            );
          },
          type: "text",
          filterIndex: "equipmentName",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Оборудование",
          dataIndex: "equipment.name",
          width: 150,
          sorter: (a, b) => (a.equipment.name - b.equipment.name > 0 ? 1 : -1),
        },
        // { type: 'text', filterIndex: 'equipment.type', inFilter: false, inAppearance: true, visible: true, title: 'Вид', dataIndex: 'equipment.type', width: 200, sorter: (a, b) => a.equipment.type - b.equipment.type > 0 ? 1 : -1},
        // { type: 'text', filterIndex: 'equipmentModel', inFilter: true, inAppearance: true, visible: true, title: 'Модель', dataIndex: 'equipment.model', width: 200, sorter: (a, b) => a.quipment.model - b.quipment.model > 0 ? 1 : -1},
        // { type: 'text', filterIndex: 'equipmentSerialNumber', inFilter: true, inAppearance: true, visible: true, title: 'С/Н', dataIndex: 'equipment.serialNumber', width: 200, sorter: (a, b) => a.equipment.serialNumber - b.equipment.serialNumber > 0 ? 1 : -1},
        {
          type: "text",
          filterIndex: "Model",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Модель",
          dataIndex: "equipment.model",
          width: 150,
          sorter: (a, b) => (a.model - b.model > 0 ? 1 : -1),
        },
        {
          type: "text",
          filterIndex: "SerialNumber",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "С/Н",
          dataIndex: "equipment.serialNumber",
          width: 50,
          sorter: (a, b) => (a.serialNumber - b.serialNumber > 0 ? 1 : -1),
        },
        {
          renderFilter: () => {
            return (
              <AutoCompleteTags
                form={true}
                key={"4"}
                onOk={this.handleOkAutoCompleteTags}
              />
            );
          },
          type: "text",
          filterIndex: "TagId",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Статус",
          dataIndex: "equipment.tag.name",
          width: 50,
          sorter: (a, b) => (a.tag.name - b.tag.name > 0 ? 1 : -1),
        },
        {
          renderFilter: () => {
            return (
              <AutoCompleteDocumentKind
                form={true}
                key={"3"}
                onOk={this.handleOkAutoCompleteDocumentKind}
              />
            );
          },
          type: "text",
          filterIndex: "documentKindId",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Вид документа",
          dataIndex: "documentKind.name",
          width: 100,
          sorter: (a, b) =>
            a.documentKind.name - b.documentKind.name > 0 ? 1 : -1,
        },
        {
          type: "text",
          filterIndex: "numberDocument",
          inFilter: true,
          inAppearance: true,
          visible: true,
          title: "Рег. номер документа",
          dataIndex: "numberDocument",
          width: 100,
          sorter: (a, b) => (a.numberDocument - b.numberDocument > 0 ? 1 : -1),
        },
      ],
      cols: [],
      filters: {
        departmentId: "",
        currentCheckStart: "",
        currentCheckEnd: "",
        nextCheckStart: "",
        nextCheckEnd: "",
        typeId: "",
        number: "",
        departmentId: "",
        equipmentId: "",
        model: "",
        serialNumber: "",
        tagId: "",
        numberDocument: "",
        documentKindId: "",
      },
    };
  }

  formatDate(date) {
    return date === null ? null : new Date(date).toLocaleString().split(",")[0];
  }

  handleOkAutoCompleteDepartment = (value) => {
    let filter = this.state.filters;
    filter["departmentId"] = value.id;
    this.onChangeInput(filter);
  };

  handleOkAutoCompleteEquipment = (value) => {
    let filter = this.state.filters;
    filter["equipmentId"] = value.id;
    this.onChangeInput(filter);
  };

  handleOkAutoCompleteDocumentKind = (value) => {
    let filter = this.state.filters;
    filter["documentKindId"] = value.id;
    this.onChangeInput(filter);
  };

  handleOkAutoCompleteTags = (value) => {
    let filter = this.state.filters;
    filter["tagId"] = value.id;
    this.onChangeInput(filter);
  };

  handleOkAutoCompleteType = (value) => {
    let filter = this.state.filters;
    filter["typeId"] = value.id;
    this.onChangeInput(filter);
  };

  componentDidUpdate() {
    if (this.state.dataSource) this.setState({ loading: false });
  }

  getData = async (page, size, sorter) => {
    this.setState({ ...this.state, loading: true });

    if (typeof page == "undefined" && typeof size == "undefined") {
      const data = await agent.ChecksService.view(
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
      const data = await agent.ChecksService.view(
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

  handleSentToCheck = async () => {
    if (this.state.selectedRow == null || this.state.selectedRow.length <= 0) {
      Toast.warning("Не выбрано оборудование для отправки на поверку.");
      return;
    }

    let obj = {
      verifications: [],
    };

    this.state.selectedRow.forEach((el) => {
      obj.verifications.push({ equipmentId: el.equipment.id });
    });

    let result = await agent.VerificationService.add(obj);

    if (result) Toast.info("Оборудование добавлено на поверку");
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
    if (value != null)
        this.setState({...this.state, filters: value})
    else
    {
        let filter = this.state.filters;
        Object.keys(filter).forEach(key => filter[key] = '')
    }

    this.getData()
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
      FileSaver.saveAs(fl, "Документ");
    }
  };

  handlepPrintSticker = async () => {
    if (this.state.selectedRow == null || this.state.selectedRow.length <= 0) {
      Toast.warning("Не выбрано оборудование для печати этикеток.");
      return;
    }

    let obj = {
      equipmentId: [],
    };

    this.state.selectedRow.forEach((el) => {
      obj.equipmentId.push(el.equipmentId);
    });

    const result = await agent.ReportService.sticker(obj);
    if (result) {
      const fl = new Blob([result], { type: result.type });
      FileSaver.saveAs(fl, "Этикетки");
    }
  };

  handlepPrintCheckTable = async () => {
    if (this.state.selectedRow == null || this.state.selectedRow.length <= 0) {
      Toast.warning("Не выбрано оборудование для печати таблицы поверок.");
      return;
    }

    let obj = {
      equipmentId: [],
    };

    this.state.selectedRow.forEach((el) => {
      obj.equipmentId.push(el.equipmentId);
    });

    const result = await agent.ReportService.checkTable(obj);
    if (result) {
      const fl = new Blob([result.body], { type: result.type });
      FileSaver.saveAs(fl, "Таблица поверок");
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
    history.push(`/equipment/checks/view/${record.id}`);
  };

  render() {
    return (
      <>
        <div className="style_Toolbar">
          <Toolbar
            header={"Журнал поверок"}
            onGet={this.getData}
            handleShowFilter={this.handleShowFilter}
            handleShowColumns={this.handleShowColumns}
            onSentToCheck={this.handleSentToCheck}
            handleDownload={this.handleDownload}
            handlepPrintSticker={this.handlepPrintSticker}
            handlepPrintCheckTable={this.handlepPrintCheckTable}
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
        </div>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChecksView);
