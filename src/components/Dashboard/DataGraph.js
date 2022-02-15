import React from 'react';
import {ResponsiveLine } from '@nivo/line'
import {Device_Description} from './DeviceType.js'
import {http_public_url, api_port, dashboardHeaders} from "../../config.js"

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
    <g>
        <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
        <circle
            r={size / 5}
            strokeWidth={borderWidth}
            stroke={borderColor}
            fill={color}
            fillOpacity={0.35}
        />
    </g>
)

export class MyGraph extends React.Component {
    constructor(props){
        super(props);    
        this.kind = props.kind
    }

    // componentDidMount(){
    //     var api_base_url = http_public_url + ":" + api_port + "/";

    //     fetch(api_base_url + 'sensordata/RRI', {
    //         method: 'GET',
    //         headers: dashboardHeaders
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log(data);
    //     }).catch(err => {
    //       console.log(err)
    //     });
    // }

    render(){
        let ndata = [];
        let counter = 1;

        let data_array = this.kind === "RRI" ? this.props.data.rri_data : this.props.data.temp_data;
        for (var i=0; i < data_array.length; i++){
            let idata = data_array[i];
            let ttime = new Date(idata.time * 1000);
            // var stime = ttime.getMinutes() + ":" + ttime.getSeconds();
            // console.log(counter)
            let item ={"x": counter, "y": idata.value};
            counter++;
            ndata.push(item);
        }
        
        return(
            <>
        <ResponsiveLine
            data={[
                {
                    id: 'Data A',
                    data: ndata,
                },
            ]}
            xScale={{
                type: 'linear',
                // format: '%M:%S',
                // useUTC: false,
                min: 'auto',
                max: 'auto',
            }}
            // xFormat="time:%M:%S"
                 
            yScale={{ 
                type: 'linear', 
                min: Device_Description[this.kind].graph_min,
                max: Device_Description[this.kind].graph_max, 
                stacked: false,
                reverse: false 
            }}
            yFormat=" >-.2f"
            curve="monotoneX"
            colors={{ scheme: 'nivo' }}
            axisBottom={{
                // format: "%M:%S",
                legend: 'Time (Seconds)',
                legendOffset: 46,
                legendPosition: 'middle'
            }}
            axisLeft={{
                legend: this.kind,
                legendPosition: 'middle',
                legendOffset: -40,
            }}
            // pointSymbol={CustomSymbol}
            pointSize={0.1}
            pointBorderWidth={1}
            pointBorderColor={{
                from: 'color',
                modifiers: [['darker', 0.3]],
            }}
            pointLabelYOffset={-12}
            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        />
        </>
        );
    }

}