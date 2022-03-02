// import React from 'react';

// export class MyGraph1 extends React.Component {
//     constructor(props){
//         super(props);
//         this.kind = props.kind;
//     }


// 	componentDidMount() {
// 	}
	
// 	render() {
// 		var data = [];
// 		var dataSeries = { type: "line" };
// 		var dataPoints = [];
//         let counter = 1;

//         let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
//         console.log(this.kind);

//         for (var i=0; i < data_array.length; i++){
//             counter++;
//             dataPoints.push({	
// 				x: counter,
// 				y: data_array[i].value
// 			});
//         }

//         dataSeries.dataPoints = dataPoints;
// 		data.push(dataSeries);
				
// 		// const options = {
//         //     theme: "light2",
//         //     height: 150,
//         //     width: 650,
// 		// 	// zoomEnabled: true,
// 		// 	// animationEnabled: true,
// 		// 	title: {
// 		// 		text: this.kind,
// 		// 		fontSize: 10,
// 		// 		padding: 10,
// 		// 	},
// 		// 	data: data  // random data
// 		// }
// 		const options = {
// 			theme: "light2",
// 			height: 250,
//             width: 650,
// 			title:{
// 				text: this.kind,
// 				fontSize: 20,
// 			},
// 			animationEnabled: true,
// 			exportEnabled: true,
// 			charts: [{
// 			  data: data
// 			}],
// 			navigator: {
// 				slider: {
// 				  minimum: 0,
// 				},
// 				axisX: {
// 				  labelFontColor: "white"
// 				}
// 			},		  
// 			rangeSelector: {
// 			  inputFields: {
// 				startValue: 4000,
// 				endValue: 6000,
// 				valueFormatString: "###0"
// 			  },
			  
// 			  buttons: [{
// 				label: "1s",
// 				range: 1000,
// 				rangeType: "number"
// 			  },{
// 				label: "1m",
// 				range: 2000,
// 				rangeType: "number"
// 			  },{
// 				label: "1h",
// 				range: 5000,
// 				rangeType: "number"
// 			  },{
// 				label: "24h",        
// 				rangeType: "all"
// 			  }]
// 			}
// 		  };			
// 		return (
// 		    <div><CanvasJSStockChart options={options} onRef={ref => this.chart = ref}/></div>
// 		);
// 	} 			
// }
 
// module.exports = MyGraph1;                              
