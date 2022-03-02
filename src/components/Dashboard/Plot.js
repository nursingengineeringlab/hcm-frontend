import React from 'react';
import Plot from 'react-plotly.js';

export class Plott extends React.Component {
    constructor(props){
        super(props);
        this.kind = props.kind;
    }
    
    state = {
        index: 0,
        timer: new Date().getTime(),
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
        setInterval(this.increaseGraphic, 1000);
    } 

    rand = () => parseInt(Math.random() * 100 + this.state.revision, 10);
    
    
    increaseGraphic = () => {
        const { line, layout } = this.state;

        var x_push = () => {
          let step = this.kind === "RRI" ? 1000 : 5000;
          this.state.timer += step;
          line.x.push(this.state.timer);
        };
        
        
        var y_push = () => {
          let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
          if(this.state.index < data_array.length) {
            line.y.push(data_array[this.state.index].value);
            this.state.index++;
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