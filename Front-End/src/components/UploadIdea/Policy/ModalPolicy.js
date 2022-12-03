import React from "react";
import "./ModalPolicy.css";

function ModalPolicy({ setOpenModal ,sumbmitidea }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => {setOpenModal(false);}} > X </button>
        </div>
        <div className="modaltitle">TERMS AND POLICIES</div>
        <div className="modalinput">
            <textarea readOnly className="inputvl1">This box will contains content of Terms and Policies</textarea>
        </div>
        <div className="checkbox">
        <input type="checkbox" id="1" classname="1"/>
        <label > I UNDERSTAND AND AGREE WITH TERMS AND POLICIES</label>
        </div>
        
          <button className="SubmitBtn1" onClick={sumbmitidea} id="SubmitBtn1">Submit</button>
        
      </div>
     </div>
  );
}

export default ModalPolicy;