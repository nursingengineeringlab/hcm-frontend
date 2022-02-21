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
import mqtt from 'mqtt';

// https://github.com/improbable-eng/grpc-web/issues/96#issuecomment-347871452
const ecg = require('./ecg_pb');

// const pbjs = require('pbjs');
// import { load } from "protobufjs";


// const schema = pbjs.parseSchema(`
//   message ECGPacket {
//     enum CommandType {
//         NEW = 1;
//         UPDATE = 2;
//     }
//     enum DataType {
//       RRI = 1;
//       TEMP = 2;
//       SPO2 = 3;
//     }
//     required CommandType command = 1;
//     required string device_id = 2;
//     required int32 sequence_id = 3;
//     required int32 value = 4;
//     required uint32 battery = 5;
//     required bool active = 6;
//     optional uint64 time = 7;
//     required DataType data_type = 8 [default = RRI];
//   }
// `).compile();

const { Content, Footer, Sider } = Layout;


var randomColor = require('randomcolor'); // import the script

// var mqtt    = require('mqtt');
// var options = {
//   // protocol: 'mqtts',
//   username: 'shiywang',
//   password: 'Wsy920926!@#'
// }

// var mqtt_client  = mqtt.connect('mqtts://ba344abc818a45729f7fb3de3fc0313f.s1.eu.hivemq.cloud:8884', options);

var api_base_url = http_public_url + ":" + api_port + "/";
var web_socket_url = "ws://127.0.0.1:" + api_port + "/ws/sensor/RR"
// const wsclient = new WebSocket(web_socket_url);
dashboardHeaders.append('Accept', 'application/json');


const array_len_24h = 1000;

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
    var options = {
      // username: 'shiywang',
      clientId: 'clientId-K90MhBcEwe',
      // password: 'Wsy920926!@#'
    }
    var client = mqtt.connect("mqtt://localhost:8883", options);
    // var client = mqtt.connect("wss://ba344abc818a45729f7fb3de3fc0313f.s1.eu.hivemq.cloud:8884", options);

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
    console.log(packet)
    if(packet.command === 1) {
        console.log("New device connected.", packet.deviceId);
        packet.active = true;
        this.OnlineSeniors.set(packet.deviceId, packet);
    } else if (packet.command === 2) {
        if(this.OnlineSeniors.has(packet.deviceId)) {
          let new_data = {"value": packet.value, "time": packet.time};

          if(packet.dataType == ecg.ECGPacket.DataType.RRI) {
            this.OnlineSeniors.get(packet.deviceId).rri_data.push(new_data);
          } else if ( packet.dataType == ecg.ECGPacket.DataType.TEMP) {
            this.OnlineSeniors.get(packet.deviceId).temp_data.push(new_data);
          }
          
          this.OnlineSeniors.get(packet.deviceId).dataType = packet.dataType;
          this.OnlineSeniors.get(packet.deviceId).active = true;
          this.OnlineSeniors.get(packet.deviceId).watch = exceeded_threshold(
              new_data.value,
              this.OnlineSeniors.get(packet.deviceId).dataType
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

    } else if (packet.command === "close") {
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