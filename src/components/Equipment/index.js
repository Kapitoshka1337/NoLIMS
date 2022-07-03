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

function Equipment()
{
  const { userHasPermissions } = useAbac();
  const [items, setItems] = useState([
      {
        title: "Оборудование",
        module: "equipment",
        actions: [
            {
                title: "Оборудование",
                link: "equipment/view",
                desctiption: "Отобразить список оборудования"
            },
            {
                title: "Инструкции к оборудованию",
                link: "equipment/instruction/view",
                desctiption: "Отобразить список инструкций"
            },
            {
                title: "Техническое обслуживание",
                link: "equipment/service/view",
                desctiption: "Отобразить список оборудования требующее ТО"
            },
            {
                title: "Производители",
                link: "equipment/manufacturer/view",
                desctiption: "Отобразить список производителей"
            },
            {
                title: "Типы оборудования",
                link: "equipment/types/view",
                desctiption: "Отобразить список типов оборудования"
            },
            {
                title: "Статусы оборудования",
                link: "equipment/tags/view",
                desctiption: "Отобразить список статусов оборудования"
            },
        ]
      },
      {
          title: "Поверки",
          module: "verification",
          actions: [
              {
                  title: "Поверки",
                  link: "equipment/verification/view",
                  desctiption: "Отобразить список поверок"
              },
              {
                title: "Журнал поверок",
                link: "equipment/checks/view",
                desctiption: "Отобразить журнал поверок оборудования"
              },
              {
                title: "Виды документов",
                link: "equipment/documentkind/view",
                desctiption: "Отобразить виды документов для поверки"
              }
          ]
      }
    ])

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
            {items.map((item) => {
              return (
                <Col span={8} key={item.title}>
                  <Card title={item.title}>
                      {item.actions.map((action) => {
                        let tt = action.link.split('/');
                        let idx = tt.length > 2 ? 1 : 0;
                        if (userHasPermissions(`${tt[idx]}.view`))
                        {
                          return (
                            <div className='actions' key={action.title}>
                              <Link style={{display: 'block'}} to={action.link} key={action.title}>{action.title}</Link>
                              <span>{ action.desctiption }</span>
                            </div>
                          )
                        }
                      })
                    }
                  </Card>
                </Col>
              )
            })}
            </Row>
      </>
    );
  }

export default connect(mapStateToProps, mapDispatchToProps)(Equipment);
