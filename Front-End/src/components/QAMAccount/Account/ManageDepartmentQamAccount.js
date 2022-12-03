import React, { useState ,useEffect} from 'react';
import './ManageDepartmentQamAccount.css';
import ModalDepartmentQamDetail from '../detail/ModalDepartmentQamDetail';
import Navbar from '../../Navbar';
import { Link } from 'react-router-dom';
import { Url } from '../../URL';




function ManagementDepartmentQamAccount() {
  const [ModalDepartmentQamDetailOpen, setModalDepartmentQamDetail] = useState(false);
  const [userAccounts, setuserAccounts] = useState([]);
  const [reloadpage] = useState(false);
  const [userDetail,setuserDetail]=useState({})

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };


    fetch(Url + "/api/Accounts/GetAllUser", requestOptions)
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
      })
      .catch(error => {
        console.log('error', error)
        // setreloadpage(!reloadpage)
      });
  }, [reloadpage])

  const handleviewDetail = (data) => {
    setModalDepartmentQamDetail(true)
    setuserDetail(data)
  }
  console.log(userAccounts);
  const listAccounts = userAccounts.map(data => (
    <tr key={data.id}>
      <td >{data.email}</td>
      <td >{data.username}</td>
      <td>
        <button className='Detail' onClick={() => handleviewDetail(data)}>Detail</button>
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
        <div className="text">Department Management</div>
      </div>

      <div className='contentManage'>
        <div className='text'>List Account</div>
      </div>
      <table className='tableuser'>
        <thead>
        <tr>
          <th>Email</th>
          <th>Username</th>
          <th>Deatail</th>
        </tr>
        </thead>
        <tbody>
            {listAccounts}
            {ModalDepartmentQamDetailOpen && <ModalDepartmentQamDetail setOpenModalDepartmentQamDetail={setModalDepartmentQamDetail} data={userDetail}/>}
        </tbody>
      </table>

    </section>
  </div>
}
export default ManagementDepartmentQamAccount;