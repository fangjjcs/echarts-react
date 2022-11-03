import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

import './Charts.css';

const TimelineChart = props => {

    let chartRef;
    var data = [];
    var dataCount = 5;
    var startTime = +new Date();
    var categories = ['categoryA', 'categoryB', 'categoryC'];
    var types = [
        { name: 'JS Heap', color: '#7b9ce1' },
        { name: 'Documents', color: '#bd6d6c' },
        { name: 'Nodes', color: '#75d874' },
    ];

    // Generate mock data
    categories.forEach(function (category, index) {
        var baseTime = startTime;
        for (var i = 0; i < dataCount; i++) {
        var typeItem = types[Math.round(Math.random() * (types.length - 1))];
        var duration = Math.round(Math.random() * 10000);
        data.push({
            name: typeItem.name,
            category: category,
            value: [index, baseTime, (baseTime += duration), duration],
            itemStyle: {
                color: typeItem.color
            }
        });
        baseTime += Math.round(Math.random() * 2000);
        }
    });

    const renderItem = (params, api) => {
        var categoryIndex = api.value(0);

        var start = api.coord([api.value(1), categoryIndex]);
        var end = api.coord([api.value(2), categoryIndex]);
        var height = api.size([0, 1])[1] * 0.6;
        var rectShape = echarts.graphic.clipRectByRect(
        {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
        },
        {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
        }
        );
        return (
            rectShape && {
                type: 'rect',
                transition: ['shape'],
                shape: rectShape,
                style: api.style(),
                name: categoryIndex
            }
        );
    }

    const emphasisStyle = {
        itemStyle: {
          color: '#eee',
          opacity: 1
        }
    };
    const options = {
        tooltip: {
            formatter: function (params) {
                return params.marker + params.name + ': ' + params.value[3] + ' ms';
            }
        },
        title: {
            text: 'Profile',
            left: 'center'
        },
        brush: {
            toolbox: ['rect'],
            xAxisIndex: 0,
            throttleType: 'debounce',
            throttleDelay: 200,
        },
        dataZoom: [
            {
                type: 'slider',
                filterMode: 'weakFilter',
                showDataShadow: false,
                top: 400,
                labelFormatter: ''
            },
            {
                type: 'inside',
                filterMode: 'weakFilter'
            }
        ],
        grid: {
            height: 300
        },
        xAxis: {
            min: startTime,
            scale: true,
            axisLabel: {
                formatter: function (val) {
                    return Math.max(0, val - startTime) + ' ms';
                }
            }
        },
        yAxis: {
            data: categories
        },
        series: [
            {
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    opacity: 1
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                emphasis: emphasisStyle,
                data: data
            }
        ]
    };

    function renderBrushed(params) { 
        const target = params.batch[0];
        const data = chartRef.getEchartsInstance()._chartsViews[0].group._children
        if (target.areas.length != 0) {
            let selectRect = target.areas[0].range[0]; // [left,right]
            let selectedCategory = target.areas[0].coordRanges[0][1] // [0,0] or [0,1] ...
            //--- selected array ---//
            let indexArr = data.map((d, i) => d.shape.x >= selectRect[0] && 
                d.shape.x <= selectRect[1] && 
                d.name>=selectedCategory[0] && d.name<=selectedCategory[1]? i : -1).filter(i => i >= 0);
            console.log(indexArr)

            //--- selected data array ---//
            const selectedData = indexArr.map(i => ([...options.series.map(s => s.data[i])])).flat()
            console.log(selectedData)
            //--- change options for color (all data) ---//
            options.series[0].data.forEach((data, index) => {
                if(!indexArr.includes(index)){
                    data.itemStyle.color = '#eee';
                } else {
                    data.itemStyle.color = types.filter(t=>t.name===data.name)[0].color
                }
            })
            console.log(options)
            chartRef.getEchartsInstance().setOption(options)
            
            //--- selected data ---//
            // let selectedData = data.filter((d) => d.shape.x >= selectRect[0] && d.shape.x <= selectRect[1]&& 
            //     d.name>=selectedCategory[0] && d.name<=selectedCategory[1])
            
            //--- highlight selected data ---//
            // chartRef.getEchartsInstance().dispatchAction({
            //     type: 'highlight',
            //     seriesIndex: [0],
            //     dataIndex: [indexArr],
            // });
           
  
        };
    }
    
    function releaseClick (params) {
        options.series[0].data.forEach((data, index) => {
            data.itemStyle.color = types.filter(t=>t.name===data.name)[0].color
        })
        chartRef.getEchartsInstance().setOption(options)
        const data = options.series[0].data
        console.log(data)
    };

    useEffect(()=>{
        chartRef.getEchartsInstance().on('brushSelected', renderBrushed)
        chartRef.getEchartsInstance().getZr().on('click', releaseClick)
        
    },[])

    return <ReactECharts ref={(e)=>{chartRef=e}} option={options} style={{width: '80%', height: '500px'}}/>;
}


export default TimelineChart