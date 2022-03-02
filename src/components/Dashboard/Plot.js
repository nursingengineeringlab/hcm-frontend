import React from 'react';
import Plot from 'react-plotly.js';

export class Plott extends React.Component {
    constructor(props){
        super(props);
        this.kind = props.kind;
    }
    state = {
        line1: {
          x: [-3, -2, -1],
          y: [1, 2, 3], 
          name: 'Line 1'
        },
        line2: {
          x: [1, 2, 3],
          y: [-3, -2, -1],
          name: 'Line 2'
        }, 
        layout: { 
          datarevision: 0,
          title: this.kind,
          xaxis: {
            autorange: true,
            range: ['2015-02-17', '2017-02-16'],
            rangeselector: {buttons: [
                {
                  count: 1,
                  label: '1m',
                  step: 'month',
                  stepmode: 'backward'
                },
                {
                  count: 6,
                  label: '6m',
                  step: 'month',
                  stepmode: 'backward'
                },
                {step: 'all'}
              ]},
            rangeslider: {range: ['2015-02-17', '2017-02-16']},
            type: 'date'
          },
          yaxis: {
            autorange: true,
            range: [86.8700008333, 138.870004167],
            type: 'linear'
          }
        },
        revision: 0,
    }
    componentDidMount() {
        setInterval(this.increaseGraphic, 1000);
    } 
    rand = () => parseInt(Math.random() * 10 + this.state.revision, 10);
    
    increaseGraphic = () => {
        const { line1, line2, layout } = this.state;
        line1.x.push(this.rand());
        line1.y.push(this.rand());
        if (line1.x.length >= 10) {
          line1.x.shift();
          line1.y.shift();
        } 
        line2.x.push(this.rand());
        line2.y.push(this.rand());
        if (line2.x.length >= 10) {
          line2.x.shift();
          line2.y.shift();
        }
        this.setState({ revision: this.state.revision + 1 });
        layout.datarevision = this.state.revision + 1;
    }
    

    render() {
        var trace1 = {
            type: "scatter",
            mode: "lines",
            name: 'AAPL High',
            x: [1,2,3,4,5],
            y: [7,1,3,1,213],
            line: {color: '#17BECF'}
        }
                    
        var data = [trace1];
         
        var layout = {
          
        };

        return (
        <Plot
            data={[
                this.state.line1,
                this.state.line2,
              ]}
            layout={this.state.layout}
            revision={this.state.revision}
            // layout={layout }
        />
        );
  }
}