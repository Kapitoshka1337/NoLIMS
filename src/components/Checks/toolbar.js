import React from 'react';
import { connect } from 'react-redux';
import { Nav } from '@douyinfe/semi-ui'
import { IconRefresh, IconVerify, IconFilter, IconCheckList, IconDownload, IconDelete } from '@douyinfe/semi-icons';
import { useAbac } from 'react-abac'
import {
    EQUIPMENT_VIEW_PAGE_LOADED
} from '../../constants/actionTypes';
const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
      dispatch({ type: EQUIPMENT_VIEW_PAGE_LOADED, payload })
  });

  function Toolbar(props) {
    const { userHasPermissions } = useAbac();

    return (
        <Nav
        header={{text: props.header}}
        style={{padding: 0}}
        mode={'horizontal'}
        items={
                [
                    { itemKey: 'update', text: 'Обновить', icon: <IconRefresh />, onClick: (e) => props.onGet() },
                    { itemKey: 'toVerification', text: 'Отправить на поверку', icon: <IconVerify />, onClick: (e) => props.onSentToCheck(), disabled: !userHasPermissions('verification.add') },
                    { itemKey: 'delete', text: 'Удалить запись', icon: <IconDelete />, onClick: (e) => props.onDelete(), disabled: !userHasPermissions('verification.delete') },
                    { itemKey: 'document', text: 'Экспорт', icon: <IconDownload />,
                        items: [
                            {
                                itemKey: 'checkDocuement',
                                text: 'Документы поверки',
                                onClick: (e) => props.handleDownload(), disabled: !userHasPermissions('file.view')
                            },
                            {
                                itemKey: 'stickerDocuement',
                                text: 'Этикетка',
                                onClick: (e) => props.handlepPrintSticker(), disabled: !userHasPermissions('file.view')
                            },
                            {
                                itemKey: 'checkTableDocuement',
                                text: 'Таблица поверок',
                                onClick: (e) => props.handlepPrintCheckTable(), disabled: !userHasPermissions('file.view')
                            }
                        ]
                    },
                    { itemKey: 'filter', text: 'Фильтрация', icon: <IconFilter />, onClick: (e) => props.handleShowFilter(true) },
                    { itemKey: 'appearance', text: 'Внешний вид', icon: <IconCheckList />, onClick: (e) => props.handleShowColumns(true) },

                ]
            }
        />
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
