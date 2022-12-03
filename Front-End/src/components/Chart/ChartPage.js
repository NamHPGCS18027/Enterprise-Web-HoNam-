import React from 'react'
import { ChartPARD } from './ChartPARD'
import { ChartTopic } from './ChartTopic'
import Navbar from '../Navbar'
import { MyChart } from './MyChart'


export const ChartPage = () => {
  return (
    <div>
      <Navbar />
      <section className='chart'>
        <div className="chart">
          <MyChart />
        </div>
        <div className="chart">
          <ChartPARD />
        </div>
        <div className="chart">
          <ChartTopic />
        </div>
      </section>
    </div>
  )
}
