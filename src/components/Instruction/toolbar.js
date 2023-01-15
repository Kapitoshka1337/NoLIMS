import React from 'react';
import { connect } from 'react-redux';
import { Nav, ButtonGroup, Button } from '@douyinfe/semi-ui'
import { IconExport, IconRefresh, IconFilter, IconCheckList, IconDownload, IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useAbac } from 'react-abac'
import {
    
} from '../../constants/actionTypes';
const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = (dispatch) => ({

  });

function Toolbar(props) {
  const { userHasPermissions } = useAbac();

  const menu = [
    {
      node: "item",
      name: "Файл инструкции",
      onClick: (e) => props.handleDownload(),
      disabled: !userHasPermissions("file.view"),
    },
  ];

  return (
    <div className="action_panel style_Toolbar">
      <h3 style={{ marginLeft: 5 }}>Инструкции к оборудованию</h3>
      <div style={{ display: "flex", marginBottom: 10 }}>
        <ButtonGroup>
          <Button
            id="update"
            onClick={(e) => props.onGet()}
            icon={<IconRefresh />}
          >
            Обновить
          </Button>
          <Button
            id="create"
            disabled={!userHasPermissions("instruction.add")}
            onClick={(e) => props.showCreate(true)}
            icon={<IconPlus />}
          >
            Создать
          </Button>
          <Button
            id="delete"
            disabled={!userHasPermissions("instruction.delete")}
            onClick={(e) => props.onDelete()}
            icon={<IconDelete />}
          >
            Удалить запись
          </Button>
          <Button
            id="checkDocuement'"
            disabled={!userHasPermissions("file.view")}
            onClick={(e) => props.handleDownload()}
            icon={<IconExport />}
          >
            Экспорт файла
          </Button>
          <Button
            id="filter"
            onClick={(e) => props.handleShowFilter(true)}
            icon={<IconFilter />}
          >
            Фильтрация
          </Button>
          <Button
            id="appearance"
            onClick={(e) => props.handleShowColumns(true)}
            icon={<IconCheckList />}
          >
            Внешний вид
          </Button>
        </ButtonGroup>
      </div>
    </div>
    // <Nav
    // header={{text: props.header}}
    // style={{padding: 0}}
    // mode={'horizontal'}
    // items={
    //         [
    //             { itemKey: 'update', text: 'Обновить', icon: <IconRefresh />, onClick: (e) => props.onGet() },
    //             { itemKey: 'create', text: 'Создать', icon: <IconPlus />, onClick: (e) => props.showCreate(true), disabled: !userHasPermissions('instruction.add') },
    //             { itemKey: 'delete', text: 'Удалить запись', icon: <IconDelete />, onClick: (e) => props.onDelete(), disabled: !userHasPermissions('instruction.delete') },
    //             { itemKey: 'document', text: 'Экспорт', icon: <IconDownload />,
    //                 items: [
    //                     {
    //                         itemKey: 'checkDocuement',
    //                         text: 'Файл инструкции',
    //                         onClick: (e) => props.handleDownload(), disabled: !userHasPermissions('file.view')
    //                     }
    //                 ]
    //             },
    //             { itemKey: 'filter', text: 'Фильтрация', icon: <IconFilter />, onClick: (e) => props.handleShowFilter(true) },
    //             { itemKey: 'appearance', text: 'Внешний вид', icon: <IconCheckList />, onClick: (e) => props.handleShowColumns(true) },

    //         ]
    //     }
    // />
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
