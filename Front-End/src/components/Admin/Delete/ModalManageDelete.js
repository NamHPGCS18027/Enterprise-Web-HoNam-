import React from "react";
import "./ModalManageDelete.css";
import { Url } from "../../URL";

function ModalManageDelete({ setOpenModalDelete , data ,setreloadpage }) {
  
  const deleteact = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url+`/api/Accounts/removeUser?email=${data.email}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(result)
        setreloadpage(true)
        setOpenModalDelete(false)
      })
      .catch(error => console.log('error', error));
  }
  return (
    <div className="modalBackground">
      <div className="modalContainer">

        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => { setOpenModalDelete(false); }} > X </button>
        </div>
        <div className="modaltitle">DO YOU WANT TO DELETE THIS ACCOUNT</div>

        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => { setOpenModalDelete(false); }} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={deleteact}>Confrim</button>
        </div>

      </div>
    </div>
  );
}

export default ModalManageDelete