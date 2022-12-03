import React, { useState, useEffect } from "react";
import "./ViewDepartment.css";
import { Url } from "../../../URL";

function ViewDepartment({ setOpenDepartmentQamView, data }) {
  const [user, setuser] = useState([])
  
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url+`/api/Department/GetAllUserFromDepartment?departmentId=${data.departmentId}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setuser(data)
      })
      .catch(error => console.log('error', error));
  }, [])

  const listuserdpm = user.map(data => (
    <tr key={data.id}>
      <td>{data.id}</td>
      <td>{data.userName}</td>
      <td>{data.email}</td>
    </tr>
  ))
  
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => { setOpenDepartmentQamView(false); }} > X </button>
        </div>
        <div className="modaltitle">Department Detail</div>

        <table className='tableuser'>
          <thead>
            <tr>
              <th>System Management</th>
              <th>User</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {listuserdpm}
          </tbody>
        </table>
        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => { setOpenDepartmentQamView(false); }} id="cancelBtn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ViewDepartment