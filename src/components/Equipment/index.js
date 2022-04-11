import React, {lazy} from 'react';
import { connect } from 'react-redux';
import { NavLink, Switch } from 'react-router-dom'
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

class Equipment extends React.PureComponent {
  constructor()
  {
    super()

    this.state = {items:[
      {
        title: "Оборудование",
        module: "equipment",
        actions: [
            {
                title: "Оборудование",
                link: "/equipment/view",
                desctiption: "Отобразить список оборудования"
            },
            {
                title: "Журнал поверок",
                link: "/equipment/checks/view",
                desctiption: "Отобразить журнал поверок оборудования"
            }
        ]
      },
      {
          title: "Поверки",
          module: "verification",
          actions: [
              {
                  title: "Поверки",
                  link: "/equipment/verification/view",
                  desctiption: "Отобразить список поверок"
              }
          ]
      },
      {
          title: "Инструкции к оборудованию",
          module: "instruction",
          actions: [
              {
                  title: "Инструкции",
                  link: "/equipment/instruction/view",
                  desctiption: "Отобразить список инструкций"
              }
          ]
      },
      {
          title: "Техническое обслуживание",
          module: "service",
          actions: [
              {
                  title: "Техническое обслуживание",
                  link: "/equipment/service/view",
                  desctiption: "Отобразить список обордования требующее ТО"
              }
          ]
      }
    ]};
  }
  render() {
    const { Title, Paragraph } = Typography;

    return (
      <>
          <Row style={{marginBottom: '12px'}}>
            <Title heading={2}>Оборудование</Title>
            <Paragraph>
              Модуль позволяет управлять оборудованием, поверками, техническим обслуживанием
            </Paragraph>
            <hr></hr>
          </Row>
          <Row gutter={[16,16]}>
            {this.state.items.map((item) => {
              return (
                <Col span={8} key={item.title}>
                  <Card title={item.title}>
                      {item.actions.map((action) => {
                        return (
                          <div className='actions' key={action.title}>
                            <NavLink style={{display: 'block'}} to={action.link} key={action.title}>{action.title}</NavLink>
                            <span>{ action.desctiption }</span>
                          </div>
                        )
                      })}
                  </Card>
                </Col>
              )
            })}
            </Row>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Equipment);
