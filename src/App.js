import React, {useEffect, useState} from "react";
import SymbolDetail from './SymbolDetail';
import {Line} from 'react-chartjs-2';
import './App.css';
import Loader from "react-loader-spinner";

const App = () => {
  const [symbolDetail, setsymbolDetail] = useState({"c": 0, "h": 0, "l": 0, "o": 0, "pc": 0});
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [companyName, setcompanyName] = useState('');
  // const [cpOneYear, setcpOneYear] = useState([]);
  const [peers, setPeers] = useState([]);
  const [graphData, setgraphData] = useState({
    labels: [],
    datasets: [
        {
            label: 'close price',
            data: [],
        }
    ],
    });
  const [symbols, setSymbols] = useState([]);
  const [keyquery, setkeyQuery] = useState('');
  const [isOpened, setIsOpened] = useState(false);
  const [lastYear, setlastYear] = useState(0);
  const [dateFrom, setdateFrom] = useState(0);
  const [dateTo, setdateTo] = useState(0);
  const [spinnerLoading, setSpinnerLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [alertclicked, setalertClicked] = useState(false);

  const appkey = "c19cnqv48v6psigtb4ag";

  useEffect( ()=>{
    getAllSymbol();
    setlastYear(new Date().getFullYear()-1);
  },[]);

  useEffect(()=>{
    if (lastYear !== undefined){
      setTimeout(() => {
        setdateFrom(Math.floor(new Date(lastYear.toString()+".01.01").getTime()/1000));
        setdateTo(Math.floor(new Date(lastYear.toString()+".12.31").getTime()/1000));
      }, 1500);
    }
  },[lastYear]);

  useEffect( ()=>{
    if(query !== ''){
      getAllData();
    };
  },[clicked]);

  useEffect(()=>{
    setIsOpened(false);
  },[search]);

  const getAllSymbol = async () =>{
    try{
      const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${appkey}`, {
        timeout: 6000
      });
      if (!response.ok){
        setalertClicked(true);
        setSpinnerLoading(false);
        throw new Error(`HTTP error! status: ${response.status}.`);
      }
      else{
        setalertClicked(false);
      }
      const data = await response.json();
      let arr = []
      data.map(d=>
        arr.push(d.symbol)
      );
      setSymbols(arr)
    }catch(err){
        alert(err + " An error occured. Please try again later.");
    }
  }

  const getSymbolDetail = async () => {
    try{
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${query}&token=${appkey}`,{
        timeout: 6000
      });
      if (!response.ok){
        setalertClicked(true);
        setSpinnerLoading(false);
        throw new Error(`HTTP error! status: ${response.status} when getting Symbol Detail.`);
      }
      else{
        setalertClicked(false);
        console.log(alertclicked);
      }
      
      const data = await response.json();
      if (data !== undefined){
        setsymbolDetail(data);
      }
    }catch(err){
        alert(err + " Please try again later.");
    }
  }

  const closePriceOneYear = async () => {
    try{
      const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${query}&resolution=D&from=${dateFrom}&to=${dateTo}&token=${appkey}`,{
        timeout: 6000
      });
      if (!response.ok){
        setalertClicked(true);
        setSpinnerLoading(false);
        throw new Error(`HTTP error! status: ${response.status} when getting Daily Close Price for Last Year.`);
      }
      else{
        setalertClicked(false);
        console.log(alertclicked);
      }
      const data = await response.json();
      if (data.t !== undefined){
        const dates = data.t.map(element => 
          new Date(element*1000).toLocaleDateString()
        )
        setgraphData(
        {
          labels: dates,
          datasets: [
              {
                  label: 'Daily Closing Prices for Year ' + lastYear,
                  data: data.c,
              }
          ],
      }
      );
      }
    }catch(err){
      alert(err + " Please try again later.");
    }
  
  }

  const getCompanyName = async () => {
    try{
      const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${query}&token=${appkey}`, {
        timeout: 6000
      });
      if (!response.ok){
        setalertClicked(true);
        setSpinnerLoading(false);
        throw new Error(`HTTP error! status: ${response.status} when getting Company Name.`);
      }
      else{
        setalertClicked(false);
        console.log(alertclicked);
      }
      const data = await response.json();
      setcompanyName(data.name);
    }catch(err){
        alert(err + " Please try again later.")
    }
  }

  const getPeers = async () => {
    try{
      const response = await fetch(`https://finnhub.io/api/v1/stock/peers?symbol=${query}&token=${appkey}`,{
        timeout: 6000
      });
      if (!response.ok){
        setalertClicked(true);
        setSpinnerLoading(false);
        throw new Error(`HTTP error! status: ${response.status} when getting Peers data.`);
      }
      else{
        console.log('alert321');
        setalertClicked(false);
      }
      const data = await response.json();
      data.splice(data.indexOf(query), 1);
      setPeers(data);
    }
    catch(err){
      alert(err + " Please try again later.");
    }
}

  function getAllData(){
    if(alertclicked){return};
    getSymbolDetail();
    closePriceOneYear();
    getCompanyName();
    getPeers();
  }

  const updateSearch = e =>{
    setSearch(e.target.value.toUpperCase());
  }


  const getSearch = e =>{
    e.preventDefault();
    if(alertclicked){
        setSpinnerLoading(true);
        setTimeout(() => {
          getAllSymbol();
          setIsOpened(false);
          setSpinnerLoading(false);
          // setTimeout(() => {
          //   console.log(alertclicked);
          // }, 10000);
          // if(!alertclicked){
          //   updateQuery(search);
          // }
      }, 20000);
    }else{
        updateQuery(search);
    }
  }

  function updateQuery(search){
    if(search === ""){
      alert("Please input a ticker!");
    }
    else if(symbols.includes(search) === false){
      alert("Please input a valid ticker!");
    }
    else{
      setSpinnerLoading(true);
      setQuery(search);
      setClicked(!clicked);
      setkeyQuery(search+search);
      setTimeout(() => {
        setSpinnerLoading(false);
        setIsOpened(true);
      }, 1000);
    }
  }

  return (
    
    <div className="App">
      <div className="header">
      </div>
      <div className="left-content">
        <div className = "inner-left-content">
          <div className = "form-section">
            <form className = "search-form">
              <label className = "label-input">Enter Ticker Symbol</label>
              <input className = "search-bar" type = "text" value = {search} onChange = {updateSearch}></input>
              <button className = "search-button" type="submit" onClick = {getSearch}>
                Enter &rarr;
              </button>
            </form>
          </div>
          {isOpened &&(
              <div className = "left-content-symbol">
                  <SymbolDetail
                      key = {query}
                      pc = {symbolDetail.pc}
                      c = {symbolDetail.c}
                      h = {symbolDetail.h}
                      l = {symbolDetail.l}
                      o = {symbolDetail.o}
                      query = {query}
                      companyName = {companyName}
                      peers = {peers}
                  />
              </div>
          )}
        </div>
      </div>
      <div className = "loader">
        <Loader
          key = {keyquery+query}
          type="BallTriangle"
          color="#00BFFF"
          height={100}
          width={100}
          visible={spinnerLoading}
        />
      </div>

      <div className = "right-content">
        {isOpened && (
          <div className = "line-graph">
            <Line
                key = {keyquery}
                data={graphData}
                width={100}
                height={50}
                // options={{ maintainAspectRatio: false }}
                options = {{
                  scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Price'
                      }
                    }],
                    xAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Date'
                      }
                    }],
                  }     
                }}
            />
          </div>)}
        </div>
    </div>
  );
};

export default App;
