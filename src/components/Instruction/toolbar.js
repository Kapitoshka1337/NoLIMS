import React from 'react';
import { connect } from 'react-redux';
import { Nav } from '@douyinfe/semi-ui'
import { IconRefresh, IconFilter, IconCheckList, IconDownload, IconDelete, IconPlus } from '@douyinfe/semi-icons';
import { useAbac } from 'react-abac'
import {
    
} from '../../constants/actionTypes';
const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({

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
                    { itemKey: 'create', text: 'Создать', icon: <IconPlus />, onClick: (e) => props.showCreate(true), disabled: !userHasPermissions('instruction.add') },
                    { itemKey: 'delete', text: 'Удалить запись', icon: <IconDelete />, onClick: (e) => props.onDelete(), disabled: !userHasPermissions('instruction.delete') },
                    { itemKey: 'document', text: 'Экспорт', icon: <IconDownload />,
                        items: [
                            {
                                itemKey: 'checkDocuement',
                                text: 'Файл инструкции',
                                onClick: (e) => props.handleDownload(), disabled: !userHasPermissions('file.view')
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
