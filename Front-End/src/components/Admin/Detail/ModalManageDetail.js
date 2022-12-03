import React from "react";
import "./ModalManageDetail.css";

function ModalManageDetail({ setOpenModalDetail ,data}) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => {setOpenModalDetail(false);}} > X </button>
        </div>
        <div className="modaltitle">Detail User</div>
        
        <div className="modalinput">
            <span className="inputtitle">Full Name : {data.fullname}</span>
        </div>
        <div className="modalinput">
            <span className="inputtitle">Employee ID : {data.employeeId}</span>
            <br/>
        </div>
        <div className="modalinput">
            <span className="inputtitle">Email : {data.email}</span>
            <br/>
        </div>
        <div className="modalinput">
            <span className="inputtitle">User name : {data.username}</span>
            <br/>
        </div>
        <div className="modalinput">
            <span className="inputtitle">Role : {data.role}</span>
            <br/>
        </div>
        <div className="modalinput">
            <span className="inputtitle">Department : {data.department}</span>
            <br/>
        </div>
      </div>
    </div>
  );
}

export default ModalManageDetail