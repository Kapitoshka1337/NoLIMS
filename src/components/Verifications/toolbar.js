import React from 'react';
import { connect } from 'react-redux';
import { Nav, ButtonGroup, Button  } from '@douyinfe/semi-ui'
import { IconRefresh, IconFilledArrowUp, IconPlay, IconDelete, IconStop, IconPrint, IconFilter, IconCheckList } from '@douyinfe/semi-icons';
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
      <h3 style={{ marginLeft: 5 }}>Поверки</h3>
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
            id="delete"
            disabled={!userHasPermissions("equipment.delete")}
            onClick={(e) => props.onDelete()}
            icon={<IconDelete />}
          >
            Удалить запись
          </Button>
          <Button
            id="startVerification"
            disabled={!userHasPermissions("verification.play")}
            onClick={(e) => props.onStartVerification()}
            icon={<IconPlay />}
          >
            Запустить поверку
          </Button>
          <Button
            id="cancelVerification"
            disabled={!userHasPermissions("verification.reset")}
            onClick={(e) => props.onCancelVerification()}
            icon={<IconStop />}
          >
            Отменить поверку
          </Button>
          <Button
            id="toDepartment"
            disabled={!userHasPermissions("verification.return")}
            onClick={(e) => props.onReturnToDepartment()}
            icon={<IconFilledArrowUp />}
          >
            Отдать в отдел
          </Button>
          <Button
            id="printOrder"
            onClick={(e) => props.onGet()}
            icon={<IconPrint />}
          >
            Печать заявки в ЦСМ
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
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
