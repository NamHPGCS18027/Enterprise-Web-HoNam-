import React, { useState, useEffect } from 'react'
import { Url } from '../URL';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const MyChart = () => {
    const [getData, setgetData] = useState([])
    const [getfile, setgetfile] = useState([])

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(Url + "/api/Statistic/AllPostByDepartment", requestOptions)
            .then(response => response.json())
            .then(result => {
                setgetData(result.listResult)
                setgetfile(result)
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
    const download = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(Url + `/api/FileAction/GetFile?filePath=${getfile.filePath}`, requestOptions)
            .then(resp => resp.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = getfile.filePath[0];
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                alert('your file has downloaded!'); // or you know, something with better UX...
            })
            .catch(() => alert('oh no!'));
    }

    return (
        <div>
            <div className='chart'>
                <h1 className='text' >All Post By Department</h1>
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
                <button onClick={download}>Download</button>
            </div>
        </div>
    )
}
