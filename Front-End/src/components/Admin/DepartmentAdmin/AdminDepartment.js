import React, { useState, useEffect } from 'react';
import './AdminDepartment.css';
import ViewDepartment from './View/ViewDepartment';
import AddDepartment from './Add/AddDepartment';
import { Url } from '../../URL';
import Navbar from '../../Navbar';
import { Link } from 'react-router-dom';




function AdminDepartment() {
  const [DepartmentQamViewOpen, setDepartmentQamView] = useState(false);
  const [GetAllDepartment, setGetAllDepartment] = useState([])
  // const [deatailBtn, setdeatailBtn] = useState(false)
  const [ModalAddusers,setModalAdduser]=useState(false)
  const [viewDepartment,setviewDepartment]=useState({})
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url+"/api/Department/GetAllDepartment", requestOptions)
      .then(response => response.json())
      .then(data => {
        setGetAllDepartment(data)
      })
      .catch(error => console.log('error', error));
  }, [])
  const handleviewDetail=(data)=>{
    setDepartmentQamView(true)
    setviewDepartment(data)
  }
  const listDepartment = GetAllDepartment.map(data => (
    <tr key={data.departmentId}>
      <td>{data.departmentName}</td>
      <td>
      <div className='buttonAddUser'>
        <button className='Add-user-bt' onClick={() => handleviewDetail(data)}>Detail</button>
      </div>
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
        <div className="text">Department Management</div>
      </div>
      <div className='buttonAddUser'>
        <button className='Add-user-bt' onClick={() => { setModalAdduser(true); }}>ADD user Department</button>
        {ModalAddusers && <AddDepartment setOpenModalAdduser={setModalAdduser} />}
      </div>
      <div className='contentManage'>
        <div className='text'>List Account</div>
      </div>
      <table className='tableuser'>
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
            {listDepartment}
            {DepartmentQamViewOpen && <ViewDepartment setOpenDepartmentQamView={setDepartmentQamView} data={viewDepartment}/>}
        </tbody>
      </table>
    </section>
  </div>
}
export default AdminDepartment;