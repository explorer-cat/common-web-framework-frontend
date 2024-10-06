import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/table.css'
import { utils } from '../../utils/utils';

const CryptoTable = ({ tableOption,rowsData }) => {
  const { options, columns, values } = tableOption;
  const {data, isError, errorCode} = rowsData;

  const tableTextFormat = (id, value, idx) => {

    if (!value) {
      return value;
    }
    if (id == "currency") {
      return <span>{utils.getTickerName('KRW-' + value)}</span> //현재가
    } else if (id === 'balance') {
      return <span>{utils.formatToKRW(parseFloat(value), 4)}<span style={{ fontSize: 12 }}> {data[idx]['currency']}</span></span>
    } else if (id === 'current_price') {
    const divRef = React.createRef();
    //fadein 조건은 이전 row정보와 거래 시간의 거래건이며,  이전 row정보와 다른 가격이 왔을때만 fade_in 효과를 줌
    //fade_in 되진않지만 계속해서 리렌더링은 해주고있음.
    if(data[idx].prev_trade_timestamp !== data[idx].trade_timestamp && data[idx].current_price !== data[idx].prev_price) {
      setTimeout(() => {
        const divElement = ReactDOM.findDOMNode(divRef.current);
        if (divElement && !divElement.classList.contains('fade_in')) {
          divElement.classList.add('fade_in');
          setTimeout(() => {
            divElement.classList.remove('fade_in');
          }, 500);
        }
      }, 0); 
    }
    
      return (
        <div data-key = {data[idx].currency} style={{ display: 'flex', flexDirection: 'column' }}>
          <span ref = {divRef} style={{ color: data[idx]['change'] == 'RISE' ? '#F04251' : '#3485FA' }}>{utils.formatToKRW(parseFloat(data[idx].current_price), 2) + '원'}</span>
          <span style={{ fontSize: 12, color: data[idx]['change'] == 'RISE' ? '#F04251' : '#3485FA' }}>
            {data[idx]['change'] == 'RISE' ? '+' : '-'}
            {(data[idx]['change_rate'] * 100).toFixed(2)}%</span>
        </div>
      ) 

    } else if (id === 'avg_buy_price') {
      return <span>{utils.formatToKRW(parseFloat(value), 2) + '원'}</span>
    } else if (id === 'purchase_amt') {
      return <span>{utils.formatToKRW(parseFloat(value), 0) + '원'}</span>
    } else if (id === 'valuation_amt') {
      return <span>{utils.formatToKRW(parseFloat(value), 0) + '원'}</span>
    } else if (id === 'profit_loss') {
      const isUp = value > 0 ? true : false
      if (isUp) {
        return <span style={{ color: '#F04251' }}>+{utils.formatToKRW(data[idx]['profit_loss_price'])}원 ({'+' + (value).toFixed(2) + '%'})</span>
      } else {
        return <span style={{ color: '#3485FA' }}>{utils.formatToKRW(data[idx]['profit_loss_price'])}원 ({(value).toFixed(2) + '%'})</span>
      }
    } else {
      return <span>{value}</span>;
    }
  }

  if(isError) {
    return (
    <div id="real_server" style={{ width: '100%' }}>
    <div className="public_table">
      <table>
        <thead className="table_header">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                style={{
                  textAlign: values[idx].align,
                  width: values[idx].width + '%',
                  display: values[idx].hidden ? 'none' : 'table-cell',
                }}
              >
                {idx === 0 && options.checkbox && (
                  <div className="public_checkbox">
                    <input type="checkbox" id="all_col_check" />
                    <label htmlFor="all_col_check"></label>
                  </div>
                )}
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table_content">
          <div style={{ overflow: "auto", height: 530 }}>
              <div class="crypto_table_empty flex" style = {{alignItems:'center',flexDirection:'column',gap :12}}>
                <span style = {{fontSize:15,fontWeight:700}}>업비트 측 API 요청제한 안내</span>
                <span style = {{color:'white'}}>{data}초 뒤에 새로고침 해주세요.</span>
              </div>
          </div>
        </tbody>
      </table>
    </div>
  </div>
    )
  }

  if(data.length < 0) {
    return(
      <div>dfdf</div>
    )
  } 

  if(data.length > 0) {
    return (      
      <div id="real_server" style={{ width: '100%' }}>
        <div className="public_table">
          <table>
            <thead className="table_header">
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    style={{
                      textAlign: values[idx].align,
                      width: values[idx].width + '%',
                      display: values[idx].hidden ? 'none' : 'table-cell',
                    }}
                  >
                    {idx === 0 && options.checkbox && (
                      <div className="public_checkbox">
                        <input type="checkbox" id="all_col_check" />
                        <label htmlFor="all_col_check"></label>
                      </div>
                    )}
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table_content">
              <div style={{ overflow: "auto", height: 530 }}>
                {data.length == 0 || !data ?
                  <div class="crypto_table_empty">
                    <span>보유중인 자산이 없어요.</span>
                  </div>
                  :
                  <>
                    {data.map((rowData, rowIndex) => (
                      <tr key={rowIndex}>
                      
                        {values.map((value, idx) => (
                          <td
                            key={idx}
                            style={{
                              width: value.width + '%',
                              textAlign: value.align,
                              display: value.hidden ? 'none' : 'table-cell',
                            }}
                          //  className="fade_in"
                          >
                            {/* 컬럼명이 종목 이라면 */}
                            {value.id === "key" ? <span>{rowIndex}</span> : null}
                            {value.id === "currency" ? <img src={`https://static.upbit.com/logos/${rowData['currency']}.png`} width={24} /> : null}
                            {tableTextFormat(value.id, rowData[value.id], rowIndex)}

                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                }
              </div>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

};

export default CryptoTable;
