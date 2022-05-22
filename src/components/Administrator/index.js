import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { useAbac } from 'react-abac'

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';
import { Card, Row, Col, Typography } from '@douyinfe/semi-ui';

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

function Administrator () {
  const { userHasPermissions } = useAbac();
  const [items, setItems] = useState([
    {
        title: "Сотрудники",
        module: "user",
        actions: [
            {
                title: "Просмотр",
                link: "/administrator/user/view",
                desctiption: "Отобразить список сотрудников"
            }
        ]
    },
    {
        title: "Роли",
        module: "roles",
        actions: [
            {
                title: "Просмотр",
                link: "/administrator/roles/view",
                desctiption: "Отобразить список ролей"
            }
        ]
    }
])
    // this.state = {items:[
    //     {
    //         title: "Сотрудники",
    //         module: "user",
    //         actions: [
    //             {
    //                 title: "Просмотр",
    //                 link: "/administrator/user/view",
    //                 desctiption: "Отобразить список сотрудников"
    //             }
    //         ]
    //     },
    //     {
    //         title: "Роли",
    //         module: "roles",
    //         actions: [
    //             {
    //                 title: "Просмотр",
    //                 link: "/administrator/roles/view",
    //                 desctiption: "Отобразить список ролей"
    //             }
    //         ]
    //     }
    // ]};
  // render() {
    const { Title, Paragraph } = Typography;

    return (
      <>
          <Row style={{marginBottom: '12px'}}>
            <Title heading={2}>Администрирование</Title>
            <Paragraph>
            Модуль позволяет управлять сотрудниками, ролями, правами доступа
            </Paragraph>
            <hr></hr>
          </Row>
          <Row gutter={[16,16]}>
            {items.map((item) => {
                    if (userHasPermissions(`${item.module}.view`))
                    {
                      return (
                        <Col span={8} key={item.title}>
                          <Card title={item.title}>
                              {item.actions.map((action) => {
                                return (
                                  <div className='actions' key={action.title}>
                                    <Link style={{display: 'block'}} to={action.link} key={action.title}>{action.title}</Link>
                                    <span>{ action.desctiption }</span>
                                  </div>
                                )
                              })}
                          </Card>
                        </Col>
                      )
                    }
                    // else return 'Нет прав'
                  }
                )
              }
            </Row>
      </>
    );
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(Administrator);
