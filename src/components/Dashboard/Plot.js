import React from 'react';
import Plot from 'react-plotly.js';

export class Plott extends React.Component {
    constructor(props){
        super(props);
        this.kind = props.kind;
    }
    state = {
        timer: new Date().getTime(),
        line1: {
          x: [],
          y: [], 
          name: 'ECG'
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
        setInterval(this.increaseGraphic, 1000);
    } 

    rand = () => parseInt(Math.random() * 100 + this.state.revision, 10);
    
//         let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
//         console.log(this.kind);

//         for (var i=0; i < data_array.length; i++){
//             counter++;
//             dataPoints.push({	
// 				x: counter,
// 				y: data_array[i].value
// 			});
//         }

    increaseGraphic = () => {
        const { line1, layout } = this.state;
        console.log(this.state.timer);
        this.state.timer += 1000;
        line1.x.push(this.state.timer);
        if(this.kind == "RRI") {
          line1.y.push(this.rand());
        } else {
          line1.y.push(this.rand()+100);
        }
        if (line1.x.length >= 1000) {
          line1.x.shift();
          line1.y.shift();
        }
        this.setState({ revision: this.state.revision + 1 });
        layout.datarevision = this.state.revision + 1;
    }
    

    render() {

        return (
        <Plot
            data={[
                this.state.line1,
              ]}
            layout={this.state.layout}
            revision={this.state.revision}
        />
        );
  }
}