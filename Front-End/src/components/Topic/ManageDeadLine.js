import React, { useState, useEffect } from 'react';
import './ManageDeadLine.css';
import ModalDeadlineCreate from './Create/ModalDealineCreate';
import ModalDeadlineEdit from './Edit/ModalDeadlineEdit';
import ModalDeadlineDelete from './Delete/ModalDeadlineDelete';
import Navbar from '../Navbar';
import { Url } from '../URL';
import { Link } from 'react-router-dom';
import ModalDeadlineDownload from './Download/ModalDealineDownload';

function ManageDeadLine() {
  const [modalOpenDeadlineCreate, setModalOpenDeadlineCreate] = useState(false);
  const [modalOpenDeadlineEdit, setModalOpenDeadlineEdit] = useState(false);
  const [modalOpenDeadlineDelete, setModalOpenDeadlineDelete] = useState(false);
  const [modalOpenDeadlineDownload, setModalOpenDeadlineDownload] = useState(false);
  const [Topics, setTopics] = useState([])
  const [reloadpage,setreloadpage] = useState(false)
  const [editTopic,seteditTopic]=useState('')
  const [deleteTopics , setdeleteTpics]=useState("")
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
  }, [reloadpage])

  const handaleEdit = (data) =>{
    setModalOpenDeadlineEdit(true)
    seteditTopic(data)
  }
  const handleDelete = (data) => {
    setModalOpenDeadlineDelete(true)
    setdeleteTpics(data)
  }
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
        <button className='edit' onClick={() => handaleEdit(data)}>Edit</button>
      </td>
      <td>
        <button className='Delete' onClick={() => handaleDownload(data)}>Dowload</button>
      </td>
      <td>
        <button className='Delete' onClick={() => handleDelete(data)}>Delete</button>
      </td>
    </tr>
  ))
  return <div>
    <Navbar />
    <section className='Managementpage'>

      <div className='buttonMana'>
        <Link to='/ManageAccount'><button type='button' className='buttonAccount'>Account</button></Link>
        <Link to='/ManageDeadLine'><button type='button' className='buttonDeadline'>DeadLine</button></Link>
        <Link to='/AdminDepartment'><button type='button' className='buttonDeadline'>Department</button></Link>
      </div>

      <div className='manage-header'>
        <div className="text">Management DeadLine</div>
      </div>

      <div className='buttonAddUser'>
        <button className='Add-user-bt' onClick={() => { setModalOpenDeadlineCreate(true); }}>Create DeadLine</button>
        {modalOpenDeadlineCreate && <ModalDeadlineCreate setOpenModalDeadlineCreate={setModalOpenDeadlineCreate} setreloadpage={setreloadpage}/>}
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
            <th>Edit</th>
            <th>Download All File</th>
            <th>Delete</th>
          </tr>
        </thead>
        {loading ?
        <tbody>
          {listTopics}
          {modalOpenDeadlineEdit && <ModalDeadlineEdit setopenModalDeadlineEdit={setModalOpenDeadlineEdit} data={editTopic} setreloadpage={setreloadpage}/>}
          {modalOpenDeadlineDelete && <ModalDeadlineDelete setOpenModalDeadlineDelete={setModalOpenDeadlineDelete} data={deleteTopics} setreloadpage={setreloadpage}/>}
          {modalOpenDeadlineDownload && <ModalDeadlineDownload setOpenModalDeadlineDownload={setModalOpenDeadlineDownload} data={downloadTopic} />}
        </tbody>:
        <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
        }
      </table>

    </section>
  </div>
}
export default ManageDeadLine;