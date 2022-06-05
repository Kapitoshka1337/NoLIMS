import React from 'react';
import { connect } from 'react-redux';
import { Nav } from '@douyinfe/semi-ui'
import { IconRefresh, IconFilledArrowUp, IconPlay, IconDelete, IconStop, IconPrint, IconFilter, IconCheckList } from '@douyinfe/semi-icons';
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
                    { itemKey: 'startVerification', text: 'Запустить поверку', icon: <IconPlay />, onClick: (e) => props.onStartVerification(), disabled: !userHasPermissions('verification.play')},
                    { itemKey: 'cancelVerification', text: 'Отменить поверку', icon: <IconStop />, onClick: (e) => props.onCancelVerification(), disabled: !userHasPermissions('verification.reset') },
                    { itemKey: 'toDepartment', text: 'Отдать в отдел', icon: <IconFilledArrowUp />, onClick: (e) => props.onReturnToDepartment(), disabled: !userHasPermissions('verification.return') },
                    { itemKey: 'printOrder', text: 'Печать заявки в ЦСМ', icon: <IconPrint /> },
                    { itemKey: 'delete', text: 'Удалить запись', icon: <IconDelete />, onClick: (e) => props.onDeleteVerification(), disabled: !userHasPermissions('verification.delete')  },
                    { itemKey: 'filter', text: 'Фильтрация', icon: <IconFilter />, onClick: (e) => props.handleShowFilter(true) },
                    { itemKey: 'appearance', text: 'Внешний вид', icon: <IconCheckList />, onClick: (e) => props.handleShowColumns(true) }
                ]
            }
        />
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
