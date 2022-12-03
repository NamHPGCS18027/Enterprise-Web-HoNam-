import React from "react";
import "./ModalCategoryDelete.css";
import { Url } from "../../URL";

function ModalCategoryDelete({ setOpenModalCategoryDelete , data ,setreloadpage }) {
  
  const Deletetag = () => {
      var myHeaders = new Headers();
          myHeaders.append("Authorization" , "Bearer "+ sessionStorage.getItem("accessToken"));
          myHeaders.append("Content-Type", "application/json");
            
            var requestOptions = {
              method: 'DELETE',
              headers: myHeaders,
              redirect: 'follow'
            };

            fetch(Url+`/api/Category/DeleteCate?cateid=${data.categoryId}`, requestOptions)
              .then(response => response.text())
              .then(result => {
                alert(result)
                setOpenModalCategoryDelete(false)
                setreloadpage(true)
              })
              .catch(error => {
                alert(error)
                setOpenModalCategoryDelete(false)
                setreloadpage(true)
              });
    }
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => {setOpenModalCategoryDelete(false);}} > X </button>
        </div>
        <div className="modaltitle">DO YOU WANT TO DELETE THIS CATEGORY</div>
        
        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => {setOpenModalCategoryDelete(false);}} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={Deletetag}>Confirm</button>
        </div>
       
      </div>
    </div>
  );
}

export default ModalCategoryDelete