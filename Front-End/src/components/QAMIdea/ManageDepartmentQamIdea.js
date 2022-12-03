import React,{ useState , useEffect } from 'react';
import './ManageDepartmentQamIdea.css';
import ModalMngDepQamIdea from './idea/ModalMngDepQamIdea';
import ModalDepartmentIdea from '../QACidea/modalidea/ModalDeaparmentIdea';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';
import { Url } from '../URL';



function ManageDepartmentQamIdea () {
    const [ModalMngDepQamIdeaOpen, setModalMngDepQamIdea] = useState(false);
    const [postHome, setpostHome] = useState([]);
    const [ viewIdeas , setviewIdea]=useState({})
    const [ModalDepartmentIdeaOpen, setModalDepartmentIdea] = useState(false);
    const [QACIdea, setQACIdea] = useState([])
    const [ viewIdeasqac , setviewIdeaqac]=useState('')
    const [loading , setloading]=useState(false)
    const [loadingQac , setloadingQac]=useState(false)
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
        setQACIdea(data)
        setloadingQac(true)
      })
      .catch(error => console.log('error', error));
  }, [])
  
  const viewIdeadetail = (data)=>{
    setModalDepartmentIdea(true)
    setviewIdeaqac(data)
  }
  const listQACidea = QACIdea.map(data => (
    <tr key={data.postId}>
      <td>{data.title}</td>
      <td>{data.username}</td>
      <td>{data.categoryName}</td>
      {/* <td>{data.statusMessage}</td> */}
      <td>
        <button className='View' onClick={() => viewIdeadetail(data)}>View</button>
        
      </td>
    </tr>
  ))
    useEffect(() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

      var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
      };

      fetch(Url+"/api/Posts/PostFeedSortByCreatedDate", requestOptions)
          .then(response => {
              if (response.ok) {
                  return response.json()
              } else {
                  throw new Error(response.status)
              }
          })
          .then(data => {
            setpostHome(data)
            setloading(true)
          })
          .catch(error => console.log('error', error));
  }, [])



  const viewIdea = (data)=>{
    setModalMngDepQamIdea(true)
    setviewIdea(data)
  }
  const listQAmidea = postHome.map(data => (
    <tr key={data.postId}>
      <td>{data.title}</td>
      <td>{data.username}</td>
      <td>{data.title}</td>
      {/* <td>{data.statusMessage}</td> */}
      <td>
        <button className='View' onClick={() => viewIdea(data)}>View</button>
        
      </td>
    </tr>
  ))
	return <div>
    <Navbar/>
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
        <div className='text'>List Idea Approved</div>
    </div>
    <table className='tableuser'>
      <thead>
        <tr>
          <th>Idea Title</th>
          <th>Username</th>
          <th>Title</th>
          {/* <th>Status</th> */}
          <th>View</th>
        </tr>
        </thead>
        {loading ? 
        <tbody>
        {listQAmidea}
        {ModalMngDepQamIdeaOpen && <ModalMngDepQamIdea setOpenModalMngDepQamIdea={setModalMngDepQamIdea} data={viewIdeas}/>}
        </tbody>:
        <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
        }
    </table>
    <div className='contentManage'>
        <div className='text'>List Idea</div>
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
        {loadingQac ? 
        <tbody>
          {listQACidea}
          {ModalDepartmentIdeaOpen && <ModalDepartmentIdea setOpenModalDepartmentIdea={setModalDepartmentIdea} data={viewIdeasqac} />}
        </tbody>:
        <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
        }
      </table>
  </section>
  </div>
}
export default ManageDepartmentQamIdea;