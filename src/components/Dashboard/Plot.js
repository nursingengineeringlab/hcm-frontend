import React from 'react';
import Plot from 'react-plotly.js';
import {http_public_url, data_fetcher_port, dashboardHeaders} from "../../config.js"


var test_url = "http://172.24.41.85"
var datafetcher_base_url = test_url + ":" + data_fetcher_port + "/";


export class Plott extends React.Component {
    constructor(props){
        super(props);
        this.kind = props.kind;
    }
    
    state = {
        xindex: 0,
        yindex: 0,
        line: {
          x: [],
          y: [],
          name: this.kind,
          line: {color: this.props.kind === "RRI" ? '#FF3333' : '#3368FF'}
        },
        layout: { 
          datarevision: 0,
          title: this.kind,
          xaxis: {
            autorange: true,
            range: [0, 86400],
            // https://plotly.com/python/reference/layout/xaxis/#layout-xaxis-rangeselector   
            rangeselector: {buttons: [
                {
                  count: 1,
                  label: '1s',
                  step: 'second',
                  stepmode: 'backward'
                },
                {
                  count: 30,
                  label: '30m',
                  step: 'minute',
                  stepmode: 'backward'
                },
                {
                  count: 1,
                  label: '1h',
                  step: 'hour',
                  stepmode: 'backward'
                },
                {step: 'all'}
              ]},
            rangeslider: {autorange: true},
            type: 'date'
          },
          yaxis: {
            autorange: true,
            range: [0, 1500],
            type: 'linear'
          }
        },
        revision: 0,
    }

    componentDidMount() {
        var deviceId = this.props.data.device_id
        var endTime = Date.now();

        const { line, layout } = this.state;

        const endpoint = datafetcher_base_url + this.kind + '?deviceId=' + deviceId + '&endTime=' + endTime.toString() + '&count=300';

        console.log(endpoint)
        
        fetch(endpoint, {
          method: 'GET',
          headers: dashboardHeaders
        })
        .then((response) => response.json())
        .then((data) => {
          for (var element of data) {
            // console.log(element)
            line.x.push(element["Timestamp"])
            line.y.push(element["Value"])
          }
        }).catch(err => {
          console.log(err);
        });
        
        setInterval(this.increaseGraphic, 1000);
    } 

    rand = () => parseInt(Math.random() * 100 + this.state.revision, 10);
    
    
    increaseGraphic = () => {
        const { line, layout } = this.state;

        var x_push = () => {
          let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
          if(this.state.xindex < data_array.length) {
            line.x.push(data_array[this.state.xindex].time);
            this.state.xindex++;
          }
        };
        
        
        var y_push = () => {
          let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
          if(this.state.yindex < data_array.length) {
            line.y.push(data_array[this.state.yindex].value);
            this.state.yindex++;
          }
        };

        x_push();
        y_push();
        
        if (line.x.length >= 1000) {
          line.x.shift();
          line.y.shift();
        }
        this.setState({ revision: this.state.revision + 1 });
        layout.datarevision = this.state.revision + 1;
    }
    

    render() {
        return (
        <Plot
            data={[this.state.line,]}
            layout={this.state.layout}
            revision={this.state.revision}
        />
        );
  }
}