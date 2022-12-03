import React, { useState, useEffect } from 'react';
import './QamDeadLine.css';
import Navbar from '../Navbar';
import { Url } from '../URL';
import { Link } from 'react-router-dom';
import QamDownload from './Download/QamDownload';

function QamDeadLine() {
  const [modalOpenDeadlineDownload, setModalOpenDeadlineDownload] = useState(false);
  const [Topics, setTopics] = useState([])
  const [downloadTopic,setdownloadTopic]=useState('')
  const [loading , setloading]=useState(false)
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url+"/api/Topics/GetAllTopic", requestOptions)
      .then(response => response.json())
      .then(data => {
        setTopics(data)
        setloading(true)
      })
      .catch(error => console.log('error', error))
  }, [])

  const handaleDownload = (data) => {
    setModalOpenDeadlineDownload(true)
    setdownloadTopic(data)
  }
  const listTopics = Topics.map(data => (
    <tr key={data.topicId}>
      <td >{data.topicName}</td>
      <td>{data.status}</td>
      <td>{data.topicDesc}</td>
      <td >{data.closureDate}</td>
      <td >{data.finalClosureDate}</td>
      <td>
        <button className='Delete' onClick={() => handaleDownload(data)}>Dowload</button>
      </td>
    </tr>
  ))
  return <div>
    <Navbar />
    <section className='Managementpage'>

      <div className='buttonMana'>
      <Link to='/ManageDepartmentQamAccount'><button type='button' className='buttonAccount'>Account</button></Link>
        <Link to='/ManageDepartmentQamIdea'><button type='button' className='buttonDeadline'>Idea</button></Link>
        <Link to='/ManageDepartmentQamDepartment'><button type='button' className='buttonDeadline'>Department</button></Link>
        <Link to='/QamDeadLine'><button type='button' className='buttonDeadline'>DeadLine</button></Link>
      </div>

      <div className='manage-header'>
        <div className="text">Management DeadLine</div>
      </div>
      <div className='contentManage'>
        <div className='text'>List DeadLine</div>
      </div>

      <table className='tableuser'>
        <thead>
          <tr>
            <th>Idea Title</th>
            <th>Status</th>
            <th>Description</th>
            <th>Closure Date</th>
            <th>Final Closure Date</th>
            {/* <th>Edit</th> */}
            <th>Download All File</th>
            {/* <th>Delete</th> */}
          </tr>
        </thead>
        {loading ?
        <tbody>
          {listTopics}
          {modalOpenDeadlineDownload && <QamDownload setOpenModalDeadlineDownload={setModalOpenDeadlineDownload} data={downloadTopic} />}
        </tbody>:
        <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
        }
      </table>

    </section>
  </div>
}
export default QamDeadLine;