import React, { useState } from "react";
import "./CmtChile.css";
import { Url } from "../../URL";

function CmtChile ({ setopenChild ,data ,setreloadpage}) {
    const [IsAnonymous] = useState([false,true]);
    const [getAnonymous,setgetAnonymous]=useState('')
    const [comment, setcomment] = useState('')
    const sumitcmnt = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
          "postId": data.postId,
          "content": comment,
          "isAnonymous": getAnonymous,
          "isChild": true,
          "parentId": data.commentId
        });
    
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
    
        fetch(Url + "/api/Comments", requestOptions)
          .then(response => {
            if(response.ok){
              response.json()
            }else{
              throw new Error(response.status)
            }
            
          })
          .then(() => {
            alert('Success')
            setreloadpage(true)
            setopenChild(false)
          })
          .catch(error => {
            console.log('error', error)
            alert("No more comment can be added to this post after final closure date",error)
          });
      }
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn"  onClick={() => { setopenChild(false); }} > X </button>
        </div>
        <div className="modaltitle">Cmt child</div>
        <div className="modalinput">
          <span className="inputtitle">Cmt child</span>
          <br />
          <input className="inputvl"  value={comment} onChange={e => setcomment(e.target.value)}></input>
        </div>
        <div className='showselectModal'>
            <select name="posttyle" id="posttyle" value={getAnonymous} onChange={e => setgetAnonymous(e.target.value)}>
                <option value=''>Choose your type of comments</option>
                <option value={IsAnonymous[0]}   >publicly</option>
                <option  value={IsAnonymous[1]}  >Anonymously</option>
            </select>
          </div>
        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => { setopenChild(false); }} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={sumitcmnt} >Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default CmtChile