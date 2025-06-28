import Header from './Header'
import Chart from './Chart'

import { Skeleton } from '@material-ui/lab'

import { tqNtFields, delivPerFields, delivQtyFields, turnOverFields, weightedClosePriceFields, weightedAndCloseFields, chartTitles } from '@constants/Chart'
import SingleChart from './SingleChart'

const grandFields = [tqNtFields, delivPerFields, delivQtyFields, turnOverFields, weightedClosePriceFields]

const Charts = ({stockData, loading}) => {

  return (
    <>
      <Header />
      {loading 
      ? <Skeleton variant="rect" animation="wave" height={300} />
      :
      grandFields.map((fields, i) => <Chart key={i} index={i} stockData={stockData} fields={fields} title={chartTitles[i]}/>
      )
      }
      {
        loading ? null : <SingleChart stockData={stockData} fields={weightedAndCloseFields}  />
      }
      
    </>
  )
}

export default Charts
