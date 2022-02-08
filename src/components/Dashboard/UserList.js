import React from 'react';
import { List} from 'antd';
import "antd/dist/antd.css";
import SeniorUser from './SeniorUser.js';
import {Typography, Row, Col} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faToggleOff} from '@fortawesome/free-solid-svg-icons'
// import Device_Description from './device_type.js'

const { Text } = Typography;


class UserList extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      isTextVisible: false,
    };

    this.online_element_size = 1;
    this.others_element_size = 1;
    this.inactive_element_size = 1;
  }

  componentDidMount(){
    /* This is used to blink text for items in watch list */
    setInterval(this.blinkText, 500);
  }

  blinkText = ()=>{
    var sLb = ! (this.state.isTextVisible);
    this.setState({isTextVisible: sLb});
  }


  render() {
    this.online_element_size = (this.props.watch_seniors.length + this.props.online_seniors.length ) < 50 ? 1 : 2;
    this.others_element_size = this.online_element_size;

    return (
      <div>
        {/* Watch List */}
        <div style={styles.watchlist_div1}>
          <div style={styles.watchlist_div2}>
            <div style={styles.header_div}> 
              <Row  justify='space-around'>
                <Col>
                  <Text style={{fontSize: 16, color: 'red', textAlign: 'center'}}>
                    <FontAwesomeIcon style={{marginRight: 5, color: 'red'}} icon={faEye} size="xs"/>Watch List
                  </Text> 
                </Col>
              </Row>
             </div>

             <div style={{padding: 30}}>
                <List
                    grid={this.online_element_size === 1 ? 
                        {gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 5,} : 
                        {gutter: 16, xs: 2, sm: 3, md: 5, lg: 5, xl: 8, xxl: 12,} 
                    }
                    dataSource={this.props.watch_seniors} 

                    renderItem={item => (
                        <SeniorUser data={item} element_size={this.online_element_size} textVisible={this.state.isTextVisible}/>
                    )}
                />
             </div>
          </div>
        </div>

        {/* Other Users */}
        <div>
          <List
              grid={this.others_element_size === 1 ? 
                  {gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 5,} : 
                  {gutter: 16, xs: 2, sm: 3, md: 5, lg: 5, xl: 10, xxl: 14,} 
              }
              dataSource={this.props.online_seniors} 

              renderItem={item => (
                  <SeniorUser data={item} element_size={this.others_element_size}/>
              )}
          />
        </div>
        
        {/* Inactive List */}
        <div style={styles.inactivelist_div1}>
          <div style={styles.inactivelist_div2}>
            <div style={styles.header_div}> 
              <Row justify='space-around'>
                <Col>
                  <Text style={{fontSize: 16, color: 'grey', textAlign: 'center'}}>
                    <FontAwesomeIcon style={{marginRight: 5, color: 'grey'}} icon={faToggleOff} size="xs"/>Inactive
                  </Text>
                </Col>
              </Row>
             </div>

             <div style={{padding: 30}}>
                <List
                    grid={this.inactive_element_size === 1 ? 
                        {gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 5,} : 
                        {gutter: 16, xs: 2, sm: 3, md: 5, lg: 5, xl: 8, xxl: 12,} 
                    }
                    dataSource={this.props.inactive_seniors} 

                    renderItem={item => (
                        <SeniorUser data={item} element_size={this.inactive_element_size} textVisible={this.state.isTextVisible}/>
                    )}
                />
             </div>
          </div>
        </div>

        
      </div>
    );
  }
}

export default UserList;



const styles = {
  inactivelist_div1:{
    padding: 0,
    marginTop: 300,
    marginBottom: 0
  },
  inactivelist_div2:{
    borderRadius: 30,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#d3d3d3', 
    minHeight: 100,
    backgroundColor: '#ececec', 
  },
  watchlist_div1:{
    padding: 0,
    marginTop: 20,
    marginBottom: 40
  },
  watchlist_div2:{
    borderRadius: 30,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#d3d3d3', 
    minHeight: 100,
    backgroundColor: '#ececec', 
  },
  header_div:{
    marginTop: -13,
    marginLeft: 40,
    width: 120,
    backgroundColor: '#ececec',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderStyle: 'solid'
  },
}

