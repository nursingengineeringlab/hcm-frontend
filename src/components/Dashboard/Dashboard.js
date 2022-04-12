import React, { Component } from "react";
import { Layout, Menu} from 'antd';
import "antd/dist/antd.css";
import "./Dashboard.css"
import {
  TeamOutlined,
} from '@ant-design/icons';
import UserList from './UserList.js'
import {exceeded_threshold} from './DeviceType.js'
import { Navbar, Nav } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { logout } from "../Login/LoginActions";
import {http_public_url, mqtt_url, dashboardHeaders} from "../../config.js"
import mqtt from 'mqtt';

// import {ECGPacket} from './ecg_pb'
// https://github.com/improbable-eng/grpc-web/issues/96#issuecomment-347871452
const ecg = require('./ecg_pb');
const { Content, Footer, Sider } = Layout;
const array_len_24h = 1000;

var randomColor = require('randomcolor'); // import the script


var api_base_url = http_public_url;
dashboardHeaders.append('Accept', 'application/json');

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

<<<<<<< HEAD
=======
    // console.log(env)
    // console.log(env.SSL_KEY_FILE)
    // console.log(env.SSL_CRT_FILE)
>>>>>>> revert back to ws

    var options = {
      clean: true,
      connectTimeout: 4000,
      // Auth
      clientId: 'hcm_frontend',
      username: 'emqx_test',
      password: 'emqx_test',
<<<<<<< HEAD
=======
      // key: env.SSL_KEY_FILE,
      // cert: env.SSL_CRT_FILE,
      rejectUnauthorized: true,
      // protocol: 'mqtts',
>>>>>>> revert back to ws
    }
    var client = mqtt.connect(mqtt_url, options);

    client.on('connect', function () {
      client.subscribe('emqtt')
    })
    
    
    client.on('message', this.call_back)
    
    client.on('error', function (error) {
        console.log(error);
    });
    
    
    fetch(api_base_url + 'seniors/', {
        method: 'GET',
        headers: dashboardHeaders
    })
    .then((response) => response.json())
    .then((data) => {
      for (var element of data['results']) {
        element["rri_data"] = [];
        element["temp_data"] = [];
        element["battery"] = 60;
        element["watch"] = false;
        element["active"] = false;
        element["color"] = randomColor({luminosity: 'dark',});
        this.OnlineSeniors.set(element['device_id'], element);
      }
      this.setState({flag: !this.state.flag});  // Triggers a re-rendering
    }).catch(err => {
      console.log(err)
    });

  };

  // function (topic, message) {
  //   const desData = ecg.ECGPacket.deserializeBinary(message).toObject();
  //   this.call_back();
  //   // const ecgObj = new ECGPacket()
  //   // const packet = schema.decodeECGPacket(message);
  //   console.log(desData)
  //   // this.setState({flag: !this.state.flag}); 
  // }
  call_back = (topic, message) => {
    const packet = ecg.ECGPacket.deserializeBinary(message).toObject();
    // console.log(packet)
    if(packet.command === ecg.ECGPacket.CommandType.NEW) {
        console.log("New device connected.", packet.deviceId);
        packet.active = true;
        this.OnlineSeniors.set(packet.deviceId, packet);
        this.OnlineSeniors[packet.deviceId].rri_data = new Array();
        this.OnlineSeniors[packet.deviceId].temp_data = new Array();

    } else if (packet.command === ecg.ECGPacket.CommandType.UPDATE) {
        if(this.OnlineSeniors.has(packet.deviceId)) {
          let new_data = {"value": packet.value, "time": packet.time};
          
          if(packet.dataType === ecg.ECGPacket.DataType.RRI) {
            this.OnlineSeniors.get(packet.deviceId).rri_data.push(new_data);
          } else if (packet.dataType === ecg.ECGPacket.DataType.TEMP) {
            this.OnlineSeniors.get(packet.deviceId).temp_data.push(new_data);
          }
          
          this.OnlineSeniors.get(packet.deviceId).data_type = packet.dataType === ecg.ECGPacket.DataType.RRI ? "RRI" : "TEMP";
          this.OnlineSeniors.get(packet.deviceId).active = true;
          this.OnlineSeniors.get(packet.deviceId).watch = exceeded_threshold(
              new_data.value,
              this.OnlineSeniors.get(packet.deviceId).date_type
          );
          // Maintain array size
          if(this.OnlineSeniors.get(packet.deviceId).rri_data.length > array_len_24h){
            this.OnlineSeniors.get(packet.deviceId).rri_data.shift();
          }
          if(this.OnlineSeniors.get(packet.deviceId).temp_data.length > array_len_24h){
            this.OnlineSeniors.get(packet.deviceId).temp_data.shift();
          }

        } else {
          console.log("Device not found", packet.deviceId);
        }

    } else if (packet.command === ecg.ECGPacket.CommandType.CLOSE) {
        packet.active = false;
        this.OnlineSeniors.get(packet.deviceId).active = false;
        console.log("Device offline", packet.deviceId);
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
        <script src="//cdn.rawgit.com/dcodeIO/protobuf.js/6.X.X/dist/protobuf.js"></script>
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
              {/* <Menu.Item key="2" icon={<SearchOutlined />}>
                Search
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