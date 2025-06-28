export const chartOptions = {
  chart: {
      type: 'line',
      stacked: false,
      zoom: {
        type: 'xy',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    stroke: {
      curve: 'straight',
      width: 3
    },
    title: {
      text: 'Total Traded Quantity / No Of Trades',
    },
    yaxis: {
      title: {
        text: 'Price'
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,  
    }
}

export const tqNtFields = [
  'ttl_trd_qnty / no_of_trades', 
  'ttl_trd_qnty_3_ma / no_of_trades_3_ma', 
  'ttl_trd_qnty_5_ma / no_of_trades_5_ma',
  'ttl_trd_qnty_8_ma / no_of_trades_8_ma',
  'ttl_trd_qnty_13_ma / no_of_trades_13_ma',
]

export const delivQtyFields = [
  'deliv_qty',
  'deliv_qty_3_ma',
  'deliv_qty_5_ma',
  'deliv_qty_8_ma',
  'deliv_qty_13_ma',
]

export const delivPerFields = [
  '(deliv_qty / ttl_trd_qnty) * 100',
  '(deliv_qty_3_ma / ttl_trd_qnty_3_ma) * 100',
  '(deliv_qty_5_ma / ttl_trd_qnty_5_ma) * 100',
  '(deliv_qty_8_ma / ttl_trd_qnty_8_ma) * 100',
  '(deliv_qty_13_ma / ttl_trd_qnty_13_ma) * 100',
]

export const turnOverFields = [
  'turnover_lacs',
  'turnover_lacs_3_ma',
  'turnover_lacs_5_ma',
  'turnover_lacs_8_ma',
  'turnover_lacs_13_ma',
]

export const weightedClosePriceFields = [
  '(high_price+low_price+(2*close_price))/4',
  '(high_price+low_price+(2*close_price))/4_3_ma',
  '(high_price+low_price+(2*close_price))/4_5_ma',
  '(high_price+low_price+(2*close_price))/4_8_ma',
  '(high_price+low_price+(2*close_price))/4_13_ma',
]

export const weightedAndCloseFields = [
  '(high_price+low_price+(2*close_price))/4',
  'close_price'
]

export const chartTitles = [
  'Total Traded Quantity / No Of Trades',
  'Delivery Percentage',
  'Delivery Quantity',
  'Turnover (Lacs)',
  'Weighted Close Price',
  'Close Price and Weighted Close Price'
]