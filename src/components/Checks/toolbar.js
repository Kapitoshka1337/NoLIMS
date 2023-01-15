import React from 'react';
import { connect } from 'react-redux';
import { Nav, ButtonGroup, Button  } from '@douyinfe/semi-ui'
import { IconPrint, IconExport, IconRefresh, IconVerify, IconFilter, IconCheckList, IconDownload, IconDelete } from '@douyinfe/semi-icons';
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

  return (
    <section className="action_panel style_Toolbar">
      <h3 style={{ marginLeft: 5 }}>
        Журнал поверок СИ / проверок ВО / аттестаций ИО
      </h3>
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
            id="toVerification"
            disabled={!userHasPermissions("verification.add")}
            onClick={(e) => props.onSentToCheck()}
            icon={<IconVerify />}
          >
            Отправить на поверку
          </Button>
          <Button
            id="delete"
            disabled={!userHasPermissions("verification.delete")}
            onClick={(e) => props.onDelete()}
            icon={<IconDelete />}
          >
            Удалить запись
          </Button>
          <Button
            id="checkDocuement"
            disabled={!userHasPermissions("file.view")}
            onClick={(e) => props.handleDownload()}
            icon={<IconExport />}
          >
            Экспорт документов
          </Button>
          <Button
            id="stickerDocuement"
            disabled={!userHasPermissions("file.view")}
            onClick={(e) => props.handlepPrintSticker()}
            icon={<IconPrint />}
          >
            Печать этикетки
          </Button>
          <Button
            id="checkTableDocuement"
            disabled={!userHasPermissions("file.view")}
            onClick={(e) => props.handlepPrintCheckTable()}
            icon={<IconPrint />}
          >
            Печать таблицы поверок
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
    </section>

    // [
    //                        { itemKey: 'document', text: 'Экспорт', icon: <IconDownload />,
    //         items: [
    //             {
    //                 itemKey: 'checkDocuement',
    //                 text: 'Документы поверки',
    //                 onClick: (e) => props.handleDownload(), disabled: !userHasPermissions('file.view')
    //             },
    //             {
    //                 itemKey: 'stickerDocuement',
    //                 text: 'Этикетка',
    //                 onClick: (e) => props.handlepPrintSticker(), disabled: !userHasPermissions('file.view')
    //             },
    //             {
    //                 itemKey: 'checkTableDocuement',
    //                 text: 'Таблица поверок',
    //                 onClick: (e) => props.handlepPrintCheckTable(), disabled: !userHasPermissions('file.view')
    //             }
    //         ]
    //     },
    // ]
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
