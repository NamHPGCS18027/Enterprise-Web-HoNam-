import React, { useState, useEffect } from 'react';
import './ManageDepartmentIdea.css';
import ModalDepartmentIdea from './modalidea/ModalDeaparmentIdea';
import Navbar from '../Navbar';
import {Link} from 'react-router-dom'
import { Url } from '../URL';


function ManageDepartmentIdea() {
  const [ModalDepartmentIdeaOpen, setModalDepartmentIdea] = useState(false);
  const [QACIdea, setQACIdea] = useState([])
  const [ viewIdeas , setviewIdea]=useState('')
  const [departmentName, setdepartmentName] = useState('')
  const[reloadpage,setreloadpage] = useState(false)
  const [loading , setloading]=useState(false)
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    // myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url+"/api/Posts/QACListPost", requestOptions)
      .then(response => response.json())
      .then(data => {
        setQACIdea(data.listPostsDto)
        setdepartmentName(data.departmentName)
        setloading(true) 
      })
      .catch(error => console.log('error', error));
  }, [reloadpage])
  
  const viewIdea = (data)=>{
    setModalDepartmentIdea(true)
    setviewIdea(data)
  }
  
  const listQACidea = QACIdea.map(data => (
    <tr key={data.postId}>
      <td>{data.title}</td>
      <td>{data.username}</td>
      <td>{data.categoryName}</td>
      {/* <td>{data.message}</td> */}
      <td>
        <button className='View' onClick={() => viewIdea(data)}>View</button>
        
      </td>
    </tr>
  ))


  return <div>
    <Navbar />
    <section className='Managementpage'>
      <div className='buttonMana'>
        <Link to='/ManageDepartmentAccount'><button type='button' className='buttonAccount'>Account</button></Link>
        <Link to='/ManageDepartmentIdea'><button type='button' className='buttonDeadline'>Idea</button></Link>
      </div>

      <div className='manage-header'>
        <div className="text">Department Management</div>
      </div>

      <div className='contentManage'>
        <div className='text'>List Idea of {departmentName}</div>
      </div>
      <table className='tableuser'>
        <thead>
          <tr>
            <th>Idea Title</th>
            <th>Username</th>
            <th>Category</th>
            {/* <th>Status</th> */}
            <th>View</th>
          </tr>
        </thead>
        {loading ? 
        <tbody>
          {listQACidea}
          {ModalDepartmentIdeaOpen && <ModalDepartmentIdea setOpenModalDepartmentIdea={setModalDepartmentIdea} data={viewIdeas} setreloadpage={setreloadpage}/>}
        </tbody>:
        <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
        }
      </table>

    </section>
  </div>
}
export default ManageDepartmentIdea;