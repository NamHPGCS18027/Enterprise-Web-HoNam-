import React, { useState, useEffect } from 'react';
import './ManageAccount.css';
import Modal from '../create/Modal';
import ModalManageEdit from '../Edit/ModalManageEdit';
import ModalManageDetail from '../Detail/ModalManageDetail';
import ModalManageDelete from '../Delete/ModalManageDelete';
import Navbar from '../../Navbar';
import ModlaAddrole from '../addrole/ModlaAddrole';
import { Url } from '../../URL';
import { Link } from 'react-router-dom';



function ManageAccount() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ModalManageEditOpen, setModalManageEdit] = useState(false);
  const [ModalManageDetailOpen, setModalManageDetail] = useState(false);
  const [ModalManageDeleteOpen, setModalManageDelete] = useState(false);
  const [ModlaAddroleOpen, setModlaAddroleOpen] = useState(false);
  const [userAccounts, setuserAccounts] = useState([]);
  const [editUser,seteditUser]=useState({})
  const [userDetail,setuserDetail]=useState({})
  const [loading , setloading]=useState(false)
  const[userDelete,setuserDelete]=useState({})
  const [reloadpage,setreloadpage]=useState(false)

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(Url+"/api/Accounts/GetAllUser", requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(response.status)
        }
      })
      .then(data => {
        setuserAccounts(data)
        // setreloadpage(!reloadpage)
        setloading(true)
      })
      .catch(error => {
        console.log('error', error)
        // setreloadpage(!reloadpage)
      });
      
  }, [reloadpage])
  
  const handaleEdit =(data)=>{
    setModalManageEdit(true)
    seteditUser(data)
  }
  const handleviewDetail = (data)=>{
     setModalManageDetail(true)
     setuserDetail(data)
  }
  const handleDelete = (data)=>{
    setModalManageDelete(true)
    setuserDelete(data)
  }
  const listAccounts = userAccounts.map(data => (
    <tr key={data.id}>
      <td >{data.email}</td>
      <td >{data.username}</td>
      <td>
        <button className='edit' onClick={() => handaleEdit(data)}>Edit</button>   
      </td>
      <td>
        <button className='Detail' onClick={() => handleviewDetail(data)}>Detail</button>
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
        <div className="text">Management Account</div>
      </div>
      <div className='Btncreate'>
        <div className='buttonAddUser'>
          <button className='Add-user-bt' onClick={() => { setModalOpen(true); }}>Create User</button>
          {modalOpen && <Modal setOpenModal={setModalOpen} setreloadpage={setreloadpage} />}
        </div>
        <div className='buttonAddUser'>
          <button className='Add-user-bt' onClick={() => { setModlaAddroleOpen(true); }}>ADD ROLE</button>
          {ModlaAddroleOpen && <ModlaAddrole setOpenModlaAddrole={setModlaAddroleOpen} />}
        </div>
      </div>
      <div className='contentManage'>
        <div className='text'>List Account</div>
      </div>
      <table className='tableuser'>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Edit</th>
            <th>Detail</th>
            <th>Delete</th>
          </tr>
        </thead>
        {loading ?
        <tbody>
          {listAccounts}
          {ModalManageEditOpen && <ModalManageEdit setopenModalManageEdit={setModalManageEdit} data={editUser} setreloadpage={setreloadpage} />}
          {ModalManageDetailOpen && <ModalManageDetail setOpenModalDetail={setModalManageDetail} data={userDetail} />}
          {ModalManageDeleteOpen && <ModalManageDelete setOpenModalDelete={setModalManageDelete} data={userDelete} setreloadpage={setreloadpage} />}
        </tbody>:
        <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
      }
      </table>
    </section>
  </div>


}
export default ManageAccount;