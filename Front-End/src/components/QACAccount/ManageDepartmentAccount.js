import React,{ useState ,useEffect } from 'react';
import './ManageDepartmentAccount.css';
import ModalDepartmentDetail from './detail/ModalDepartmentDetail';
import Navbar from '../Navbar';
import { Url } from '../URL';
import { Link } from 'react-router-dom';



function ManagementDepartmentAccount () {
 const [ModalDepartmentDetailOpen, setModalDepartmentDetail] = useState(false);
 const [userAccounts, setuserAccounts] = useState([]);
  const [reloadpage] = useState(false);
  const [userDetail,setuserDetail]=useState({})
  const [departmentName, setdepartmentName] = useState('')
  const [loadingQac , setloadingQac]=useState(false)

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
      .then(response => response.json())
      .then(data => {
        setuserAccounts(data.returnListUserDto)
        setdepartmentName(data.departmentName)
        // setreloadpage(!reloadpage)
        setloadingQac(true)
      })
      .catch(error => {
        console.log('error', error)
        // setreloadpage(!reloadpage)
      });
  }, [reloadpage])

  const handleviewDetail = (data) => {
    setModalDepartmentDetail(true)
    setuserDetail(data)
  }
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
    <Navbar/>
    <section className='Managementpage'>

    <div className='buttonMana'>
      <Link  to='/ManageDepartmentAccount'><button type='button' className='buttonAccount'>Account</button></Link >
      <Link  to='/ManageDepartmentIdea'><button type='button' className='buttonDeadline'>Idea</button></Link >
    </div>

    <div className='manage-header'>
      <div className="text">Department Management</div>
      </div>

      <div className='contentManage'>
        <div className='text'>list Accounts of Department : {departmentName}</div>
    </div>
      <table className='tableuser'>
        <thead>
        <tr>
          <th>Email</th>
          <th>Username</th>
          <th>Deatail</th>
        </tr>
        </thead>
        {loadingQac ?
        <tbody>
          {listAccounts}
          {ModalDepartmentDetailOpen && <ModalDepartmentDetail setOpenModalDepartmentDetail={setModalDepartmentDetail} data={userDetail}/>}
        </tbody>:
        <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
        }
    </table>

  </section>
  </div>
}
export default ManagementDepartmentAccount;