import React from 'react';
import { connect } from 'react-redux';
import { Nav } from '@douyinfe/semi-ui'
import { IconRefresh, IconPlus, IconMapPin, IconVerify, IconFilter, IconCheckList } from '@douyinfe/semi-icons';
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
                    { itemKey: 'create', text: 'Создать', icon: <IconPlus />, onClick: (e) => props.showCreate(true), disabled: !userHasPermissions('equipment.add') },
                    { itemKey: 'toVerification', text: 'Отправить на поверку', icon: <IconVerify />, onClick: (e) => props.onSentToCheck(), disabled: !userHasPermissions('verification.add')},
                    { itemKey: 'changeLocation', text: 'Сменить местоположение', icon: <IconMapPin />, disabled: !userHasPermissions('equipment.edit')},
                    { itemKey: 'filter', text: 'Фильтрация', icon: <IconFilter />, onClick: (e) => props.handleShowFilter(true) },
                    { itemKey: 'appearance', text: 'Внешний вид', icon: <IconCheckList />, onClick: (e) => props.handleShowColumns(true) }
                ]
            }
        />
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
