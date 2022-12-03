import React from "react";
import "./ModalReason.css";

function ModalReason({ setOpenModal ,data}) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => {setOpenModal(false);}} > X </button>
        </div>
        <div className="modaltitle">FEEDBACK</div>
        <div className="modalinput1">
            <textarea readOnly className="inputvl2">{data.feedback}</textarea>
        </div>
      </div>
     </div>
  );
}

export default ModalReason;