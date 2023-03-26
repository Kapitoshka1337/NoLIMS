import React from "react";
import { connect } from "react-redux";
import { Layout, Nav } from "@douyinfe/semi-ui";
import { IconHome, IconHistogram, IconSetting } from "@douyinfe/semi-icons";

import { history } from "../store";

const mapStateToProps = (state) => ({
  ...state.settings,
  currentUser: state.common.currentUser,
  appName: state.common.appName,
});

const mapDispatchToProps = (dispatch) => ({
  // onClickLogout: () => dispatch({ type: LOGOUT }),
  // onSubmitForm: user =>
  //   dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  // onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

class Sider extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  async componentDidMount() {
    let items = [
      {
        itemKey: "Equipment",
        text: "Оборудование",
        icon: <IconHome size="large" />,
      },
      {
        itemKey: "Base",
        text: "Лаборатория ",
        icon: <IconHistogram size="large" />,
      },
      {
        itemKey: "Administrator",
        text: "Администрирование",
        icon: <IconSetting size="large" />,
      },
    ];

    let claims = this.props.currentUser.claims;

    if (claims != null)
      items.forEach((item) => {
        if (
          claims.filter(
            (f) => f.module.toLowerCase() == item.itemKey.toLowerCase()
          ).length > 0
        ) {
          item.visible = true;
          item.onClick = () => history.push(`/${item.itemKey.toLowerCase()}`);
        }
      });

    let it = items.filter((el) => el.visible);

    this.setState({ items: it });
  }

  render() {
    const { Sider } = Layout;

    return (
      <Sider style={{ backgroundColor: "var(--semi-color-bg-1)" }}>
        <Nav
          isCollapsed={true}
          style={{ height: "100%" }}
          items={this.state.items}
          header={{
            logo: (
              <img src={'https://cdn-icons-png.flaticon.com/512/8362/8362243.png'} alt="logo"/>
            ),
            // text: this.props.appName,
          }}
          footer={{
            collapseButton: false
          }}
        />
      </Sider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sider);
