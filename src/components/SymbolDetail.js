import React from 'react';
import './SymbolDetail.css';

const SymbolDetail = ({pc, c, h, l, o, query, companyName, peers}) => {
    console.log(pc,c,h,l)
    let priceTd = ''
    let priceTb = ''
    /*
    when the opening price is greater than to equal to the previous
    closing price, show red, otherwise show green
    */ 
    if (o >= pc){
        priceTd = "td-d";
        priceTb = "t-pcohlr"
    }
    else{
        priceTd ="td-c";
        priceTb = "t-pcohlg";
    }
    return(
        <div className ="left-hidden">
            <div className = "t-right-content">
                <table id = "t-table">
                    <tbody>
                        <tr>
                            <td>Previous Close:</td>
                            <td id={priceTb}>{pc}</td>
                        </tr>
                        <tr>
                            <td>Today's Open:</td>
                            <td id={priceTb}>{o}</td>
                        </tr>
                        <tr>
                            <td>Today's High:</td>
                            <td id={priceTb}>{h}</td>
                        </tr>
                        <tr>
                            <td>Today's Low:</td>
                            <td id={priceTb}>{l}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className = "t-left-content">
                <table id = "t-table-left">
                    <tbody>
                        <tr>
                            <td id = "td-query">{query}</td>
                        </tr>
                        <tr id = "td-companyName">
                            <td>{companyName}</td>
                        </tr>
                        <tr id = {priceTd}>
                            <td>{c}</td>
                        </tr>
                    </tbody>
                </table>
                <table id = "t-table-sc">
                <tbody>
                    <tr id = "tr-sc">
                        <td>Similar Companies:</td>
                    </tr>
                    <tr id = "tr-peer">
                        {peers.map(peer => (
                            <td key={peer}>{peer}</td>
                        ))}
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    );
}
export default SymbolDetail;