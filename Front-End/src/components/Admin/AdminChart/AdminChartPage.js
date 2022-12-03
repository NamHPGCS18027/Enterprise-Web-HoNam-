import React from 'react'
import { AdminChartTopic } from './AdminChartTopic'
import { AdminChartDepartment } from './AdminChartDepartment'
import Navbar from '../../Navbar'
import { AdminChartPARD } from './AdminChartPARD'
import './AdminChartpage.css'


export const AdminChartPage = () => {
  return (
    <div>
      <Navbar/>
      <section className='chart'>
        <div className="chart">
          <AdminChartDepartment />
        </div>
        <div className="chart">
          <AdminChartPARD />
        </div>
        <div className="chart">
          <AdminChartTopic />
        </div>
      </section>
    </div>
  )
}
