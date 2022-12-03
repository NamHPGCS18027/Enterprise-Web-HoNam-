import React, { useState } from "react";
import "./ModalDepartmentQamCreate.css";
import { Url } from "../../URL";

function ModalDepartmentQamCreate({ setOpenModalDepartmentQamCreate ,setreloadpage}) {
  const [department, setdepartment] = useState('')
  const summitdepartment = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url+`/api/Department/createDepartment?DepartmentName=${department}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(result)
        setreloadpage(true)
        setOpenModalDepartmentQamCreate(false)
      })
      .catch(error => console.log('error', error));
  }
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn"  onClick={() => { setOpenModalDepartmentQamCreate(false); }} > X </button>
        </div>
        <div className="modaltitle">Create Department</div>
        <div className="modalinput">
          <span className="inputtitle">Department Name</span>
          <br />
          <input className="inputvl" value={department} onChange={e => setdepartment(e.target.value)}></input>
        </div>



        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => { setOpenModalDepartmentQamCreate(false); }} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={summitdepartment}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ModalDepartmentQamCreate