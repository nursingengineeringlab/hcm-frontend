import React from 'react';
import {Typography, Row, Col, Divider} from 'antd';
import "antd/dist/antd.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeartbeat, faThermometer, faUser, } from '@fortawesome/free-solid-svg-icons'
import GaugeChart from 'react-gauge-chart'
import {Graph} from './Plot.js'
const { Text } = Typography;

export const Device_Description = {
    "RRI": {
        "id": 1,
        "watch_threshold_min": 600,
        "watch_threshold_max": 1200,
        "trigger_min_direction": [700, 650, 550],
        "trigger_max_direction": [1000, 1100, 1200],
        "graph_min": 0,
        "graph_max": 1000,
    },
    "TEMP": {
        "id": 2,
        "watch_threshold_min": 95,
        "watch_threshold_max": 99.5,
        "trigger_min_direction": [97, 96.5, 96],
        "trigger_max_direction": [99.5, 100.0, 100.9],
        "graph_min": -20,
        "graph_max": 150,
    },
    "SPO2": {
        "id": 3,
        "watch_threshold_min": 95,
        "watch_threshold_max": 99.5,
        "trigger_min_direction": [95, 93, 90],
        "trigger_max_direction": [100, 100.0, 100],
        "graph_min": 94,
        "graph_max": 102,
    }, 
}
const bckColor = "#dcdcdc";
const tColor = "#ff0800";

export const exceeded_threshold = (val, device_type) =>{
    if(device_type in  Device_Description){
        if( (Device_Description[device_type].watch_threshold_max < val) ||
            (Device_Description[device_type].watch_threshold_min > val)
        ) {
            return true;
        }
    }
    return false;
}

export class DeviceTile extends React.Component {

  render() {
    const watch_style  = {fontWeight: "bold", fontSize: 20, color: this.props.textVisible ? bckColor : tColor,};
    const normal_style = {fontSize: 20, color: "#696969"};
    return (
        <>
            <Row justify='space-around'>
                <Col>
                    <Text code style={{}}>
                        {this.props.device_type === "RRI" ? <Text><FontAwesomeIcon icon={faHeartbeat} size="1x"/>RRI</Text> :
                        <Text><FontAwesomeIcon icon={faThermometer} size="1x"/>TEMP</Text>}
                    </Text>
                </Col>
            </Row>
            <Row justify='space-around'>
                <Col>
                    <Text style={this.props.watch ? watch_style : normal_style}>
                        {this.props.current_data}
                    </Text>
                </Col>
            </Row>
        </>
    );
  }
}


export class DeviceModal extends React.Component {
    constructor(props){
        super(props);
    }
    
    render() { 
      return (
          <>
            <div style={{padding: 30, width: '100%'}}>
            <Row justify='space-around'>

                {/* Personal Info */}
                <Col style={styles.pinfo} span={11}>
                    <div width="100%">
                        <Text style={{fontSize: 15, textAlign: 'center'}}> <FontAwesomeIcon color={this.props.data.color} icon={faUser} size="1x" style={{marginRight: 10}}/> Personal Info</Text>
                        <Divider style={{ margin: 10, }}/>
                        <Row> <Text strong style={{fontSize: 16, textAlign: 'center'}}> {this.props.data.name}  </Text> </Row>
                        <Row style={{marginBottom: 15}}> <Text disabled style={{fontSize: 15, textAlign: 'center'}}> {'@'+this.props.data.device_id} </Text> </Row>
                        <Row> <Text code style={{fontSize: 15, textAlign: 'center'}}> Location: Room {this.props.data.room_no}</Text></Row>
                        <Row style={{marginTop: 5}}> <Text code> Device Type: {this.props.data.device_type}</Text></Row>
                    </div>
                </Col>

                {/* Guage */}
                <Col style={styles.gbox} span={11}>
                    {this.props.data.active === false ? <Text>No real-time data</Text> : 
                    <Text>
                        <Row><Text> <b> RRI: </b> </Text></Row>
                        <Row><Text>{ this.props.data.rri_data[this.props.data.rri_data.length-1].value } </Text></Row>
                        <Row><Text><b> Temperature: </b></Text></Row>
                        <Row><Text>{ this.props.data.rri_data[this.props.data.temp_data.length-1].value }</Text></Row>
                    </Text>
                    }
                </Col>

            </Row>
            <Row style={{width: '100%'}} justify='start' span={24}><Graph {...this.props} kind={'RRI'}/></Row>
            <Row justify='start' span={24}><Graph {...this.props} kind={'TEMP'}/></Row>
            </div>


          </>
      );
    }
  }


  const styles = {
    pinfo:{
      borderRadius: 10, 
      margin: 5,
      padding: 10,
      boxShadow: "2px 2px 2px 2px #dcdcdc"
    },
    gbox:{
        borderRadius: 10, 
        margin: 5,
        padding: 10,
        boxShadow: "2px 2px 2px 2px #dcdcdc",
        //backgroundColor: '#dcdcdc',
    },
  }
  
  