import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./AppHeader.css";
import pollIcon from "../poll.svg";
import { Layout, Menu, Dropdown, Icon } from "antd";
const Header = Layout.Header;

function AppHeader({ currentUser, location, onLogout }) {
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      onLogout();
    }
  };

  let menuItems;
  if (currentUser) {
    menuItems = [
      <Menu.Item key="/profile0" className="profile-menu">
        <Link to={`/users/${currentUser.username}`}>프로파일</Link>
      </Menu.Item>,
      <Menu.Item key="/">
        <Link to="/">
          <Icon type="home" className="nav-icon" />
        </Link>
      </Menu.Item>,
      <Menu.Item key="/poll/new">
        <Link to="/poll/new">
          <img src={pollIcon} alt="poll" className="poll-icon" />
        </Link>
      </Menu.Item>,
      <Menu.Item key="/profile" className="profile-menu">
        <ProfileDropdownMenu
          currentUser={currentUser}
          handleMenuClick={handleMenuClick}
        />
      </Menu.Item>
    ];
  } else {
    menuItems = [
      <Menu.Item key="/info">
        <Link to="/info">Info</Link>
      </Menu.Item>,
      <Menu.Item key="/login">
        <Link to="/login">Login</Link>
      </Menu.Item>,
      <Menu.Item key="/signup">
        <Link to="/signup">Signup</Link>
      </Menu.Item>
    ];
  }

  return (
    <Header className="app-header">
      <div className="container">
        <div className="app-title">
          <Link to="/">Polling App</Link>
        </div>
        <Menu
          className="app-menu"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ lineHeight: "64px" }}
        >
          {menuItems}
        </Menu>
      </div>
    </Header>
  );
}

function ProfileDropdownMenu({ currentUser, handleMenuClick }) {
  const dropdownMenu = (
    <Menu onClick={handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">{currentUser.name}</div>
        <div className="username-info">@{currentUser.username}</div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={["click"]}
      getPopupContainer={() =>
        document.getElementsByClassName("profile-menu")[0]
      }
    >
      <a className="ant-dropdown-link">
        <Icon type="user" className="nav-icon" style={{ marginRight: 0 }} />{" "}
        <Icon type="down" />
      </a>
    </Dropdown>
  );
}

export default withRouter(AppHeader);
