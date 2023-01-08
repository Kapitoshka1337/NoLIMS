import React from 'react';
import { connect } from 'react-redux';
import { Nav } from '@douyinfe/semi-ui'
import { IconSave } from '@douyinfe/semi-icons';
import { useAbac } from 'react-abac'
import {
    
} from '../../constants/actionTypes';
const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({

  });

  function CardToolbar(props) {
    const { userHasPermissions } = useAbac();

    return (
        <Nav
            header={{text: props.header}}
            style={{padding: 0}}
            mode={'horizontal'}
            items={
                [
                    { itemKey: 'save', text: 'Сохранить', icon: <IconSave />, onClick: (e) => props.onSave(true), disabled: !props.formChanged || !userHasPermissions('checks.edit')}
                ]
            }
        />
    )
}


export default connect(mapStateToProps, mapDispatchToProps)(CardToolbar);
