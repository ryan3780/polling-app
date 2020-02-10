import React from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout, Menu, Dropdown, Icon } from 'antd';
const Header = Layout.Header;
    
function AppHeader ({currentUser, location, onLogout}){
    
  const handleMenuClick=({ key }) =>{
      if(key === "logout") {
        onLogout();
      }
    }
    
        let menuItems;
        if(currentUser) {
          menuItems = [
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
                  handleMenuClick={handleMenuClick}/>
            </Menu.Item>
          ]; 
        } else if(matchMedia("screen and (max-width:900px)").matches){
          const menu = (
            <Menu>
              <Menu.Item key="0">
                <a href="http://www.alipay.com/">1st menu item</a>
              </Menu.Item>
              <Menu.Item key="1">
                <a href="http://www.taobao.com/">2nd menu item</a>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="3">3rd menu item</Menu.Item>
            </Menu>
          );
          return(<Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link" href="/">
            Click me <Icon type="down" />
          </a>
        </Dropdown>)
          
         
        } else {
          menuItems = [  
            <Menu.Item key="/gosuSignup">
              <Link to="/gosuSignup">고수가입</Link>
            </Menu.Item>,
            <Menu.Item key="/signup">
              <Link to="/signup">회원가입</Link>
              </Menu.Item> ,
            <Menu.Item key="/findGosu">
              <Link to="/findGosu">고수 찾기</Link>
              </Menu.Item>, 
            <Menu.Item key="/login">
              <Link to="/login">로그인</Link>
              </Menu.Item>,                
            ];
        }
        

        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">Find App</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }


function ProfileDropdownMenu({currentUser,handleMenuClick}) {
  const dropdownMenu = (
    <Menu onClick={handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {currentUser.name}
        </div>
        <div className="username-info">
          @{currentUser.username}
        </div>
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
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);