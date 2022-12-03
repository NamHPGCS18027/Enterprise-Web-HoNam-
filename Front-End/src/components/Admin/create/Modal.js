import React, { useState } from "react";
import "./Modal.css";
import { Url } from "../../URL";

function Modal({ setOpenModal ,setreloadpage }) {
  const [Email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setfullname] = useState('');
  const [employeeId, setemployeeId] = useState('')
  const registration = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "fullname": fullname,
      "employeeId": employeeId,
      "username": username,
      "email": Email,
      "password": password
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(Url+"/api/AuthManagement/Register", requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(result)
        setreloadpage(true)
        setOpenModal(false)
      })
      .catch(error => alert( error));

  }

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => { setOpenModal(false); }} > X </button>
        </div>
        <div className="modaltitle">Add User</div>
        <div className="modalinput">
          <span className="inputtitle">fullname</span>
          <br />
          <input className="inputvl" value={fullname} onChange={e => setfullname(e.target.value)}></input>
        </div>
        <div className="modalinput">
          <span className="inputtitle">employeeId</span>
          <br />
          <input className="inputvl" value={employeeId} onChange={e => setemployeeId(e.target.value)}></input>
        </div>
        <div className="modalinput">
          <span className="inputtitle">Email</span>
          <br />
          <input className="inputvl" value={Email} onChange={e => setEmail(e.target.value)}></input>
        </div>
        <div className="modalinput">
          <span className="inputtitle">User name</span>
          <br />
          <input className="inputvl" value={username} onChange={e => setUsername(e.target.value)} ></input>
        </div>
        <div className="modalinput">
          <span className="inputtitle">Password</span>
          <br />
          <input className="inputvl" value={password} onChange={e => setPassword(e.target.value)} ></input>
        </div>
        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => { setOpenModal(false); }} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={registration}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Modal