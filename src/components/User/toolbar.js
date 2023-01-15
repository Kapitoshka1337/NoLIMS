import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, SplitButtonGroup } from "@douyinfe/semi-ui";
import { IconRefresh, IconPlus, IconFilter, IconCheckList, IconDelete } from '@douyinfe/semi-icons';
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
        <section className="action_panel style_Toolbar">
        <h3 style={{ marginLeft: 5 }}>Сотрудники</h3>
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
              disabled={!userHasPermissions('user.add')}
              onClick={(e) => props.showCreate(true)}
              icon={<IconPlus />}
            >
              Создать
            </Button>
            <Button
              id="delete"
              disabled={!userHasPermissions('user.delete')}
              onClick={(e) => props.onDelete()}
              icon={<IconDelete />}
            >
              Удалить запись
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
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
