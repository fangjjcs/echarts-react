import { useState } from 'react';
import './App.css';
import Chart from './components/Charts';
import TimelineChart from './components/TimelineChart';

function App() {

  const categories = [ 'A', 'B']
  const data = [
    { name: "a", group: 'A', startTime: '2022-11-04 11:00:00', startTime: '2022-11-04 11:04:00'},
    { name: "b", group: 'A', startTime: '2022-11-04 11:05:30', startTime: '2022-11-04 11:10:00'},
    { name: "c", group: 'B', startTime: '2022-11-04 11:00:00', startTime: '2022-11-04 11:10:00'}
  ]

  return (
    <div className="App">
      <header className="App-header">
        <TimelineChart data={data} categories={categories}/>
      </header>
    </div>
  );
}

export default App;
