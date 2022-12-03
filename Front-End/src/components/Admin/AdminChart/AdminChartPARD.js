import React, { useState, useEffect } from 'react'
import { Url } from '../../URL';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


export const AdminChartPARD = () => {
    const [getData, setgetData] = useState([])
  

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(Url + "/api/Statistic/PostApproveRatioByDepartment", requestOptions)
            .then(response => response.json())
            .then(result => {
                setgetData(result.listResult)
            })
            .catch(error => {
                console.log('error', error)
            });
    }, [])
    
    const nameData = getData.map(data => [data.dataName])
    const valueData = getData.map(data => [data.percent])
    const state = {
        labels: nameData,
        datasets: [
            {
              label: '# of Votes',
              data:valueData,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 4,
            },
          ],
    }


    return (
        <div>
            <div className='chart'>
            <h1 className='text'>Post Approve Ratio By Department</h1>
            <Pie
                data={state}
                options={{
                    title: {
                        display: true,
                        text: 'Average Rainfall per month',
                        fontSize: 20
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                }}
            />
            </div>
        </div>
    )
}
