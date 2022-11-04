import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

import './Charts.css';


const TimelineChart = ({data, categories}) => {

    let chartRef;
    var data = [];
    var dataCount = 5;
    var startTime = +new Date();
    var categories = ['categoryA', 'categoryB', 'categoryC', 'categoryD'];
    var types = [
        { name: 'JS Heap', color: '#7b9ce1' },
        { name: 'Documents', color: '#bd6d6c' },
        { name: 'Nodes', color: '#75d874' },
    ];
    const [selectedData, setSeletedData] = useState([])

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
            },
            emphasis:{
                opacity: 1
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

    const defaultOptions = {
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
            throttleDelay: 300,
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
                data: data,
            }
        ]
    }

    const options= defaultOptions;


    async function renderBrushed(params, echarts) { 
        const target = params.batch[0];
        if (target.areas.length != 0) {
            let selectRect = target.areas[0].coordRanges[0][0]; // [left,right]
            let selectedCategory = target.areas[0].coordRanges[0][1] // [0,0] or [0,1] ...
            //--- selected array ---//
            // let indexArr = data.map((d, i) => d.shape.x >= selectRect[0] && 
            //     d.shape.x <= selectRect[1] && 
            //     d.name>=selectedCategory[0] && d.name<=selectedCategory[1]? i : -1).filter(i => i >= 0);
            // console.log(indexArr)

            //--- selected data array ---//
            let indexArr = [];
            const selectedData = options.series[0].data.filter( (o, i) => {
                if(o.value[1] >= selectRect[0] && o.value[1] <= selectRect[1] && o.value[0]>=selectedCategory[0] && o.value[0]<=selectedCategory[1]){
                    indexArr.push(i);
                    return true
                }
            })
            console.log(selectRect, selectedData)
            
            //--- change options for color (all data) ---//
            let newOptions = options
            newOptions.series[0].data.forEach((data, index) => {
                if(!indexArr.includes(index)){
                    data.itemStyle.color = '#ddd';
                } else {
                    data.itemStyle.color = types.filter(t=>t.name===data.name)[0].color
                }
            })
            echarts.setOption(newOptions)
            echarts.dispatchAction({
                type: 'select',
                seriesIndex: 0,
                dataIndex: indexArr
            })
            // setSeletedData(selectedData)
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
        let newOptions = options
        newOptions.series[0].data.forEach((data, index) => {
            data.itemStyle.color = types.filter(t=>t.name===data.name)[0].color
        })
        chartRef.getEchartsInstance().setOption(options)
    };

    useEffect(()=>{
        // chartRef.getEchartsInstance().on('brushSelected', renderBrushed)
        chartRef.getEchartsInstance().getZr().on('click', releaseClick)
    },[])

    function onChartReady(echarts) {
        console.log('echarts is ready', echarts);
    }

    const onChartClick = (echarts) => {
        console.log(echarts)
    }

    useEffect(()=>{
        console.log("data changed",selectedData)
    },[selectedData])

    return <><ReactECharts 
    ref={(e)=>{chartRef=e}} 
    option={options} 
    onChartReady={onChartReady}
    onEvents={{
        'brushSelected': renderBrushed,
        // 'click': releaseClick
        'click': onChartClick
    }}
    style={{width: '80%', height: '500px'}}
    notMerge={true}
    />{}</>
    
}


export default TimelineChart