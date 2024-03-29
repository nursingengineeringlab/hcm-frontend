import React from 'react';
import Plot from 'react-plotly.js';
import {data_fetcher_http_url, dashboardHeaders} from "../../config.js"


export class Graph extends React.Component {
    constructor(props){
        super(props);
        this.kind = props.kind;
        this.mouseClick = this.props.mouseClick;
    }
    
    state = {
        xindex: 0,
        yindex: 0,
        line: {
          // mode: 'markers',
          // type: 'scatter',
          x: [],
          y: [],
          name: this.props.kind,
          connectgaps: false,
          line: {color: this.props.kind === "RRI" ? '#FF3333' : '#3368FF'}
        },
        oldline: {
          // mode: 'markers',
          // type: 'scatter',
          x: [],
          y: [],
          name: this.props.kind + ' last 6 hours',
          connectgaps: false,
          line: {color: this.props.kind === "RRI" ? '#FF3373' : '#9392FF'}
        },
        layout: { 
          autosize: true,
          automargin: true,
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
                  count: 5,
                  label: '5m',
                  step: 'minute',
                  stepmode: 'backward'
                },
                {
                  count: 10,
                  label: '10m',
                  step: 'minute',
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
        this.fetchFromRedis();
        setInterval(this.increaseGraphic, 1000);
    } 

    componentDidUpdate(prevProps) {
      // console.log(this.props.mouseClick);
      if (this.props.mouseClick !== prevProps.mouseClick) {
        this.fetchFromRedis();
      }
    }
  
    fetchFromRedis = () => {
      console.log("fetchFromRedis was called")
      const onehourMillsec = 3600000;
      const sixhoursMillsec = 21600000;
      var deviceId = this.props.data.device_id
      var endTime = Date.now()-1000;
      var startTime = endTime - sixhoursMillsec;
      const { line, oldline } = this.state;


      const endpoint = data_fetcher_http_url + this.kind + '?deviceId=' + deviceId + '&endTime=' + endTime.toString() + '&startTime=' + startTime.toString();
      oldline.x = [];
      oldline.y = [];
      console.log(endpoint)
      // reload oldline from datafetcher REST API (redis)
      fetch(endpoint, {
        method: 'GET',
        headers: dashboardHeaders
      })
      .then((response) => response.json())
      .then((data) => {
        if(data) {
          for (var element of data) {
            oldline.x.unshift(element["Timestamp"])
            oldline.y.unshift(element["Value"])
            // console.log("---------------------------")
            // console.log(element["Timestamp"])
            // console.log(element["Value"])
            // console.log("---------------------------")
            // line.x[0] = element["Timestamp"];
            // line.y[0] = element["Timestamp"];
          }
        }
      }).catch(err => {
        console.log(err);
      });
      
      
      //clear out current line content
      line.x = [];
      line.y = [];

      //assign first line datapoint to last datapoint of oldline
      // this.state.xindex++;
      // this.state.yindex++;
    }

    increaseGraphic = () => {
        const { line, layout } = this.state;

        var x_push = (data_array) => {
          // console.log("x index is: ", this.state.xindex);
          // console.log("data_arry.length is", data_array.length)
          while(this.state.xindex < data_array.length) {
            line.x.unshift(data_array[this.state.xindex].time);
            this.state.xindex++;
          }
        };
        
        
        var y_push = (data_array) => {
          // console.log("y index is: ", this.state.yindex);
          // console.log("data_arry.length is", data_array.length)
          while(this.state.yindex < data_array.length) {
            line.y.unshift(data_array[this.state.yindex].value);
            this.state.yindex++;
          }
        };

        let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
        if(data_array.length != 0) {
          x_push(data_array);
          y_push(data_array);
        }
        // x_y_push();
        
        // if (line.x.length >= 1000) {
        //   line.x.shift();
        //   line.y.shift();
        // }
        this.setState({ revision: this.state.revision + 1 });
        layout.datarevision = this.state.revision + 1;
    }
    

    render() {
        return (
        <Plot
            data={[this.state.line, this.state.oldline]}
            layout={this.state.layout}
            revision={this.state.revision}
        />
        );
  }
}