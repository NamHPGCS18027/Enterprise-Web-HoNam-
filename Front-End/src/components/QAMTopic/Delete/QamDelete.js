import React from "react";
import "./QamDelete.css";
import {Url} from '../../URL'

function QamDelete({ setOpenModalDeadlineDelete , data ,setreloadpage}) {

  const handleDelete = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "topicId": data.topicId
  });
      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(Url+"/api/Topics/RemoveTopic", requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result)
          setOpenModalDeadlineDelete(false);
          setreloadpage(true)
        })
        .catch(error => {console.log('error', error)
        setOpenModalDeadlineDelete(false)
        setreloadpage(!true)
      });
}
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => {setOpenModalDeadlineDelete(false);}} > X </button>
        </div>
        <div className="modaltitle">DO YOU WANT TO DELETE THIS DEADLINE</div>
        
        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => {setOpenModalDeadlineDelete(false);}} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={handleDelete}>Confrim</button>
        </div>
       
      </div>
    </div>
  );
}

export default QamDelete