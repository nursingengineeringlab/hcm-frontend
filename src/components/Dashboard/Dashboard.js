import React, { Component } from "react";
import { Layout, Menu} from 'antd';
import "antd/dist/antd.css";
import "./Dashboard.css"
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import UserList from './UserList.js'
import {exceeded_threshold} from './DeviceType.js'
import { Navbar, Nav } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logout } from "../Login/LoginActions";
import {http_public_url, api_port, dashboardHeaders} from "../../config.js"
const { Content, Footer, Sider } = Layout;


var randomColor = require('randomcolor'); // import the script


var api_base_url = http_public_url + ":" + api_port + "/";
var web_socket_url = "ws://127.0.0.1:" + api_port + "/ws/sensor/RR"
const wsclient = new WebSocket(web_socket_url);
dashboardHeaders.append('Accept', 'application/json');


const max_array_len = 10;

class Dashboard extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      flag: false,
      object: ""
    };
    this.OnlineSeniors =  new Map();
  }

  onLogout = () => {
    this.props.logout();
  };

  componentDidMount(){

    wsclient.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    wsclient.onclose = (message) => {
      console.log(message);
    };

    wsclient.onerror = (message) => {
      console.log(message);
    };

    wsclient.onmessage = (message) => {
      this.call_back(message);
    };
    
    fetch(api_base_url + 'seniors/', {
        method: 'GET',
        headers: dashboardHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      for (var element of data['results']) {
        element["data"] = [{"value": 60, "time": 0}];
        element["battery"] = 60;
        element["watch"] = exceeded_threshold(element.data[element.data.length - 1].value, element['device_type']);  // determine whether to add to watch list
        element["active"] = false;
        element["color"] = randomColor({luminosity: 'dark',});
        this.OnlineSeniors.set(element['device_id'], element);
      }
      this.setState({flag: !this.state.flag});  // Triggers a re-rendering
    }).catch(err => {
      console.log(err)
    });

  }

  call_back = e =>  {
    // console.log(e.data)
    // var packet = e.data["message"];
    const packet = JSON.parse(e.data).message;
    if(packet.command === "new") {
        console.log("New device connected.", packet.device_id);
        packet.active = true;
        this.OnlineSeniors.set(packet.device_id, packet);
        // this.OnlineSeniors.get(packet.device_id).active = true;
    } else if (packet.command === "update") {
        if(this.OnlineSeniors.has(packet.device_id)) {
          // const time_now = Date.now();
          let new_data = {"value": packet.value, "time": packet.time};
          // console.log(packet.device_id, packet.sequence_id, packet.value, time_now, packet.time, time_now - packet.time);    
          this.OnlineSeniors.get(packet.device_id).data.push(new_data);
          this.OnlineSeniors.get(packet.device_id).data_type = packet.data_type;
          this.OnlineSeniors.get(packet.device_id).active = true;
          this.OnlineSeniors.get(packet.device_id).watch = exceeded_threshold(
              new_data.value,
              this.OnlineSeniors.get(packet.device_id).device_type
          );
          // Maintain array size
          if(this.OnlineSeniors.get(packet.device_id).data.length > max_array_len){
            this.OnlineSeniors.get(packet.device_id).data.shift();
          }
        } else {
          console.log("Device not found", packet.device_id);
        }
    } else if (packet.command === "close") {
        packet.active = false;
        this.OnlineSeniors.get(packet.device_id).active = false;
        console.log("Device offline", packet.device_id);
        //this.OnlineSeniors.delete(packet.device_id);
    }
    
    // Triggers a re-rendering
    this.setState({flag: !this.state.flag});  
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { user } = this.props.auth;
    const { collapsed } = this.state;
    return (
      <div>
        <div className="dash-bgclolor">
        <Navbar className="dash-bgclolor">
          <Navbar.Brand className="text-light">Healthcare Monitor System</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="text-light">
              User: <b>{user.username}</b>
            </Navbar.Text>
            <Nav.Link onClick={this.onLogout} className="text-light">Logout</Nav.Link>
          </Navbar.Collapse>
        </Navbar>
        </div>

        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <div style={{height: 5}}> </div>
              <Menu.Item key="1" icon={<TeamOutlined />}>
                Online Users
              </Menu.Item>
              <Menu.Item key="2" icon={<SearchOutlined />}>
                Search
              </Menu.Item>
              {/* <Menu.Item key="3" icon={<UserOutlined />}>
                Add New User
              </Menu.Item> */}
            </Menu>
          </Sider>

          <Layout className="site-layout">
            <Content style={{ margin: '0 16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <UserList
                  online_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.watch === false && data.active === true)}
                  watch_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.watch === true && data.active === true)}
                  inactive_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.active === false)}
                />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>NE Lab ©2022 Umass Amherst</Footer>
          </Layout>
        </Layout>
        
      </div>
    );
  }
}

Dashboard.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  logout
})(withRouter(Dashboard));