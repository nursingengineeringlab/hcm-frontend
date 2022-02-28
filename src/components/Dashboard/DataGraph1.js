import React from 'react';
import {CanvasJSChart} from 'canvasjs-react-charts'
 

export class MyGraph1 extends React.Component {
    constructor(props){
        super(props);
        this.kind = props.kind
    }


	componentDidMount() {
	}
	
	render() {
		var data = [];
		var dataSeries = { type: "line" };
		var dataPoints = [];
        let counter = 1;

        let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
        console.log(this.kind);

        for (var i=0; i < data_array.length; i++){
            let idata = data_array[i];
            counter++;
            dataPoints.push({
				x: counter,
				y: idata.value
			});
        }

        dataSeries.dataPoints = dataPoints;
		data.push(dataSeries);
				
		const options = {
            theme: "light2",
            height: 100,
            width: 350,
			zoomEnabled: true,
			animationEnabled: true,
			// title: {
			// 	text: this.kind,
			// },
			data: data  // random data
		}
						
		return (
		    <div><CanvasJSChart options={options} onRef={ref => this.chart = ref}/></div>
		);
	} 			
}
 
// module.exports = MyGraph1;                              
