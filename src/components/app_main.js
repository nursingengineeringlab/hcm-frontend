import React from 'react';
import { Layout, Menu} from 'antd';
import "antd/dist/antd.css";
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import UserList from './user_list.js'
import {exceeded_threshold} from './device_type.js'
const { Header, Content, Footer, Sider } = Layout;
var randomColor = require('randomcolor'); // import the script

// var https_public_url = "http://127.0.0.1"
// var api_base_url = https_public_url + ":8000/";
// const wsclient = new WebSocket('ws://127.0.0.1:8000/ws/sensor/RR');


// var https_public_url = "http://shiywang.asuscomm.com"
// var api_base_url = https_public_url + ":30007/";
// const wsclient = new WebSocket('ws://shiywang.asuscomm.com:30007/ws/sensor/RR');

var https_public_url = "http://127.0.0.1"
var api_base_url = https_public_url + ":8000/";
const wsclient = new WebSocket('ws://127.0.0.1:8000/ws/sensor/RR');



let username = 'test';
let password = 'test';
let headers = new Headers();
headers.append('Accept', 'application/json');
headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));


const max_array_len = 10;

class MainApp extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      flag: false,
      object: ""
    };
    this.OnlineSeniors =  new Map();
  }

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
        element["data"] = [{"value": 60, "time": 0}];
        element["battery"] = 60;
        element["watch"] = exceeded_threshold(element.data[element.data.length - 1].value, element['device_type']);  // determine whether to add to watch list
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
        this.OnlineSeniors.set(packet.device_id, packet);
    } else if (packet.command === "update") {
        if(this.OnlineSeniors.has(packet.device_id)) {
          const time_now = Date.now();
          let new_data = {"value": packet.value, "time": packet.time};
          console.log(packet.device_id, packet.sequence_id, packet.value, time_now, packet.time, time_now - packet.time);
    
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
    const { collapsed } = this.state;
    return (
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
    );
  }
}

export default MainApp;