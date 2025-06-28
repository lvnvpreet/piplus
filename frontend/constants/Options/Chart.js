import { enIn } from 'date-fns/locale'
export const chartOptions = {
  plugins:{
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true
      }
    },
    title: {
      display: true,
      text: 'Open Interest Chart'
    }
  },
  scales: {
    x: {
      adapters: {
        date: {
            locale: enIn
        }
      },
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'MMM dd'
      },
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        text: 'OI',
        display: true
      },
      // ticks : {
      //   beginAtZero : true,
      // }   
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        text: 'Underlying Value',
        display: true
      },
      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    },
  }
}