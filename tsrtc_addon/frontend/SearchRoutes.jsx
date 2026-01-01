import React, { useEffect, useState } from 'react';
import RouteMap from './RouteMap';

export default function SearchRoutes(){ 
  const [stops, setStops] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(()=>{
    fetch('http://localhost:5000/stops').then(r=>r.json()).then(setStops).catch(console.error);
  },[]);

  const search = async ()=>{
    if(!from || !to) return;
    const res = await fetch(`http://localhost:5000/search?from=${from}&to=${to}`);
    const data = await res.json();
    setRoutes(data);
    setSelected(null);
  }

  return (<div style={{padding:20}}>
    <h2>Search Bus Routes</h2>
    <div style={{display:'flex', gap:10, alignItems:'center'}}>
      <div>
        <label>From</label><br/>
        <select value={from} onChange={e=>setFrom(e.target.value)} style={{minWidth:250}}>
          <option value=''>Select Source</option>
          {stops.map(s=> <option key={s.stop_id} value={s.stop_id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label>To</label><br/>
        <select value={to} onChange={e=>setTo(e.target.value)} style={{minWidth:250}}>
          <option value=''>Select Destination</option>
          {stops.map(s=> <option key={s.stop_id} value={s.stop_id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <button onClick={search} style={{padding:'10px 20px'}}>Search Routes</button>
      </div>
    </div>

    <div style={{marginTop:20}}>
      <h3>Results ({routes.length})</h3>
      <div style={{display:'flex', gap:10}}>
        <div style={{flex:1}}>
          {routes.map(r=> (
            <div key={r.route_id} style={{padding:10,border:'1px solid #ddd', marginBottom:8, cursor:'pointer'}} onClick={()=>setSelected(r)}>
              <strong>{r.route_number}</strong> — {r.from} → {r.to}
            </div>
          ))}
        </div>
        <div style={{flex:2}}>
          <RouteMap route={selected} />
        </div>
      </div>
    </div>
  </div>);
}
