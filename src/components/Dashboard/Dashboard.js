import React, { Component } from "react";
import { Layout, Menu} from 'antd';
import "antd/dist/antd.css";
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
const { Header, Content, Footer, Sider } = Layout;


var randomColor = require('randomcolor'); // import the script

// var https_public_url = "http://127.0.0.1"
// var api_base_url = https_public_url + ":8000/";
// const wsclient = new WebSocket('ws://127.0.0.1:8000/ws/sensor/RR');
// var https_public_url = "http://shiywang.asuscomm.com"
// var api_base_url = https_public_url + ":30007/";
// const wsclient = new WebSocket('ws://shiywang.asuscomm.com:30007/ws/sensor/RR');

var https_public_url = "http://127.0.0.1";
var api_base_url = https_public_url + ":8000/";
const wsclient = new WebSocket('ws://127.0.0.1:8000/ws/sensor/RR');



let username = 'test';
let password = 'test';
let headers = new Headers();
headers.append('Accept', 'application/json');
headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));


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
    //this.OnlineSeniors.set(temp_user.device_id, temp_user);
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
        headers: headers 
    })
    .then((response) => response.json())
    .then((data) => {
      for (var element of data['results']) {
        // console.log(element);
        element["data"] = [{"value": 60, "time": 0}];
        element["battery"] = 60;
        element["watch"] = exceeded_threshold(element.data[element.data.length - 1].value, element['device_type']);  // determine whether to add to watch list
        element["color"] = randomColor({luminosity: 'dark',});
        this.OnlineSeniors.set(element['device_id'], element);
      }
      // for (var d in data['results']){
      //   console.log(d);
      //   data[key]["watch"] = exceeded_threshold(data[key].data[data[key].data.length - 1].value, data[key].device_type);  // determine whether to add to watch list
      //   data[key]["color"] = randomColor({luminosity: 'dark',});
      //   this.OnlineSeniors.set(key, data[key]);
      // }
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
        // determine whether to add to watch list
        // packet["watch"] = exceeded_threshold(packet[packet.data.length - 1].value, packet.device_type);  
        // packet["color"] = randomColor({luminosity: 'dark',});
        this.OnlineSeniors.set(packet.device_id, packet);
    } else if (packet.command === "update") {
        if(this.OnlineSeniors.has(packet.device_id)) {
          let new_data = {"value": packet.value, "time": packet.time};
          const time_now = Date.now();
          console.log(packet.device_id, packet.sequence_id, packet.value, time_now - packet.time);
    
          this.OnlineSeniors.get(packet.device_id).data.push(new_data)
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
        console.log("Device offline", packet.device_id);
        this.OnlineSeniors.delete(packet.device_id);
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
      <Navbar bg="light">
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            User: <b>{user.username}</b>
          </Navbar.Text>
          <Nav.Link onClick={this.onLogout}>Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>


      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div style={{height: 60}}> </div>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<TeamOutlined />}>
              Online Users
            </Menu.Item>
            <Menu.Item key="2" icon={<SearchOutlined />}>
              Search 
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              Add New User 
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <UserList
                online_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.watch === false)}
                watch_seniors={Array.from(this.OnlineSeniors.values()).filter(data=>data.watch === true)}
              />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>NE Lab ©2021 Umass Amherst</Footer>
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