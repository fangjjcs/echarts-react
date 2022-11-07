import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useDispatch } from "react-redux";

import './Charts.css';
import { setBrushedIndexArr } from '../store/select-action';
import { formatDate, getBrushedData, updateColor } from './utils/ChartUtils';
import useWindowSize from './hooks/useWindowSize';

const TimelineChart = ({data, categories, types, startTime, chartRef}) => {

    const dispatch = useDispatch();
    const [options, setOptions] = useState({})
    const windowSize = useWindowSize(0, 400);
    
    useEffect(()=>{
        setOptions({
            tooltip: {
                formatter: function (params) {
                    return params.marker + params.name + ': ' + params.value[3] + ' ms';
                }
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
                    top: windowSize.height - 50,
                    labelFormatter: (params) => formatDate(params)
                },
                {
                    type: 'inside',
                    filterMode: 'weakFilter'
                }
            ],
            grid: {
                height: windowSize.height - 100,
                top: 20,
            },
            xAxis: {
                min: startTime,
                scale: true,
                axisLabel: {
                    formatter: (params) => formatDate(params)
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
            ],
            animation: false
        })
    },[data])

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

    const renderBrushed = (params, echarts) => { 
        const target = params.batch[0];
        if (target.areas.length != 0) {

            const [indexArr, brushedData] = getBrushedData(target.areas[0], echarts.getOption().series[0].data)
            dispatch(setBrushedIndexArr(indexArr))
            // dispatch(setBrushedData(JSON.stringify(brushedData)))

            const options = updateColor(echarts.getOption(), types, indexArr, false)
            echarts.setOption(options)
        };
    }

    const releaseClick = (params) => {
        console.log("[RELEASE]")
        const options = updateColor(chartRef.getEchartsInstance().getOption(), types, [], true)
        chartRef.getEchartsInstance().setOption(options)
    };

    useEffect(()=>{
        chartRef.getEchartsInstance().getZr().on('click', ()=>releaseClick())
        window.addEventListener("resize", function () {
            chartRef.getEchartsInstance().resize();
        });
    },[options])

    const onChartReady = () => {
        console.log("[ECHARTS IS READY]");
    }

    return <ReactECharts 
        ref={(e)=>{chartRef=e}} 
        option={options} 
        onChartReady={onChartReady}
        onEvents={{
            'brushSelected': renderBrushed,
            // 'click': releaseClick
        }}
        style={{width: '90%', height: windowSize.height}}
        notMerge={true}
        />
    
}


export default TimelineChart