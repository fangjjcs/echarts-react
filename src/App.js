import { useState, useEffect, useRef } from 'react';
import './App.css';
import { useDispatch, useSelector } from "react-redux";

import Chart from './components/Charts';
import TimelineChart from './components/TimelineChart';

function App() {

  const chartRef = useRef(null);
  const [categories, setCategories] = useState(['A', 'B'])
  const startTime = +new Date("2022-11-04 11:00:00")
  const [data, setData] = useState([
    { name: "a", categories: 'A', startTime: '2022-11-04 11:00:00', endTime: '2022-11-04 11:04:00'},
    { name: "b", categories: 'A', startTime: '2022-11-04 11:05:30', endTime: '2022-11-04 11:10:00'},
    { name: "c", categories: 'B', startTime: '2022-11-04 11:00:00', endTime: '2022-11-04 11:10:00'}
  ])

  const [chartData, setChartData] = useState([])
  var types = [
      { name: 'a', color: '#7b9ce1' },
      { name: 'b', color: '#bd6d6c' },
      { name: 'c', color: '#75d874' },
      { name: 'd', color: '#7b9ce1' },
  ];

  useEffect(()=>{
      generateChartData(data);
  },[data])
 
  const generateChartData = (data) => {
      let chartData = data
      chartData.forEach( (obj,index) => {
          const s = new Date(obj.startTime)
          const e = new Date(obj.endTime)
          obj.category = obj.categories
          obj.value = [categories.indexOf(obj.categories), +s, +e, e-s];
          obj.itemStyle={
              color: types.filter(t=>t.name===obj.name)[0].color
          };
          obj.emphasis={
              opacity: 1
          }
      })
      setChartData(chartData)
      console.log(chartData)
  }

  const changeData = () => {
    setCategories(['A','B','C'])
    setData([
      { name: "a", categories: 'A', startTime: '2022-11-04 11:00:00', endTime: '2022-11-04 11:04:00'},
      { name: "b", categories: 'A', startTime: '2022-11-04 11:05:30', endTime: '2022-11-04 11:10:00'},
      { name: "c", categories: 'B', startTime: '2022-11-04 11:10:00', endTime: '2022-11-04 11:13:00'},
      { name: "c", categories: 'B', startTime: '2022-11-04 11:15:00', endTime: '2022-11-04 11:18:00'},
      { name: "d", categories: 'C', startTime: '2022-11-04 11:00:00', endTime: '2022-11-04 11:10:00'},
      { name: "d", categories: 'C', startTime: '2022-11-04 11:20:00', endTime: '2022-11-04 11:30:00'}
    ])
  }

  //--- Massive Data ---//
  var data2 = [];
    var dataCount = 500;
    var startTime2 = +new Date("2022-11-04 11:00:00");
    var categories2 = ['categoryA', 'categoryB', 'categoryD',  'categoryF',  'categoryE'];
    var types2 = [
        { name: 'JS Heap', color: '#7b9ce1' },
        { name: 'Documents', color: '#bd6d6c' },
        { name: 'Nodes', color: '#75d874' },
    ];

    categories2.forEach(function (category, index) {
        var baseTime = startTime2;
        for (var i = 0; i < dataCount; i++) {
        var typeItem = types2[Math.round(Math.random() * (types2.length - 1))];
        var duration = Math.round(Math.random() * 9000000);
        data2.push({
            name: typeItem.name,
            category: category,
            value: [index, baseTime, (baseTime += duration), duration],
            itemStyle: {
                color: typeItem.color
            }
        });
        baseTime += Math.round(Math.random() * 90000);
        }
    });

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={changeData}>change</button>
        <TimelineChart data={data2} categories={categories2} types={types2} startTime={startTime2} chartRef={chartRef}/>
      </header>
    </div>
  );
}

export default App;
