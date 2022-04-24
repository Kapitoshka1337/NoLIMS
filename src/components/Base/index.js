import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
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

class Base extends React.PureComponent {
  constructor()
  {
    super()

    this.state = {items:[
        {
            title: "Подразделения",
            module: "department",
            actions: [
                {
                    title: "Подразделения",
                    link: "/base/department/view",
                    desctiption: "Отобразить список подразделений "
                }
            ]
        },
        {
            title: "Местоположения",
            module: "location",
            actions: [
                {
                    title: "Местоположения",
                    link: "/base/location/view",
                    desctiption: "Отобразить список ролей"
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
            <Title heading={2}>Лаборатория</Title>
            <Paragraph>
                Модуль позволяет управлять подразделением, метосположением
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
                            <Link style={{display: 'block'}} to={action.link} key={action.title}>{action.title}</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Base);