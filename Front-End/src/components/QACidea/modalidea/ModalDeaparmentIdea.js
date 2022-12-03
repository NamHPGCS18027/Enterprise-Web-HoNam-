import React,{useState} from "react";
import "./ModalDepartmentIdea.css";
import { Url } from "../../URL";



function ModalDepartmentIdea({ setOpenModalDepartmentIdea ,data ,setreloadpage}) {
  const [feedback,setfeadback]=useState('')

  const Approcepost = () => {
    var myHeaders = new Headers();
    myHeaders.append("access-control-allow-origin" , "*")
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "postId": data.postId,
      "feedback": feedback,
      "isApproved": true
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(Url+"/api/Posts/QACfeedback", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setOpenModalDepartmentIdea(false)
        alert('Approve success')
        setreloadpage(true)
    })
      .catch(error => console.log('error', error));
  }

  const Reject = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "postId": data.postId,
      "feedback": feedback,
      "isApproved": false
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(Url+"/api/Posts/QACfeedback", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        setOpenModalDepartmentIdea(false)
        alert('Approve success')
        setreloadpage(true)
    })
      .catch(error => console.log('error', error));
  }
  return (
    <div className="modalBackground">
      <div className="modalPostContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => {setOpenModalDepartmentIdea(false);}} > X </button>
        </div>
        <header>
        <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet'/>
        <div className="header_posts">
        <i className='bx bx-user-circle icon'></i>
            <div className="userposts_name">
                <span className="name_userposts">{data.username}</span>
                <div className='day'>
                    <div className='day-sumit' type = "date" >{data.createdDate}</div>
                </div>
            </div>   
        </div>
        </header>
        <div className="Category">
        <span className="TopicName">{data.categoryName}</span>
        </div>
        <div className="TitlePost">
        <p className="TopicName">Title : {data.title}</p>
        
        </div>
        {/* <div className="ex1">This is title</div> */}
        <div className="Content">
        <span className="TopicName">Content : {data.content}</span>
        </div>
        <div className="Desc">
        <span className="TopicName">Description : {data.desc}</span>
        </div>

        <div className="Modalfooter">
        <button className="SubmitBtn" onClick={Approcepost}>Approve</button>
          <button className="cancelBtn" onClick={Reject} id="cancelBtn">Reject</button>
        </div>

        {/* <div className="modaltitle">TERMS AND POLICIES</div> */}
        <div className="modalInput">
            <textarea  className="Commentbox" placeholder='Write your comments here...' value={feedback} onChange={e => setfeadback(e.target.value)}></textarea>
        </div> 
      </div>
     </div>
  );
}

export default ModalDepartmentIdea;