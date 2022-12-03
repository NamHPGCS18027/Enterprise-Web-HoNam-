import React, {useState ,useEffect} from "react";
import "./ModalManageEdit.css";
import { Url } from "../../URL";

function ModalManageEdit({ setopenModalManageEdit , data ,setreloadpage}) {
  const[userName,setuserName]=useState('')
  const[fullname,setfullname]=useState('')
  const[userEmail,setuserEmail]=useState('')
  const [employeeId, setemployeeId] = useState('')
  useEffect(() => {
    setuserEmail(data.email);
    setuserName(data.username);
    setfullname(data.fullname);
    setemployeeId(data.employeeId)
  }, [])
  const updateAccout = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "userId": data.id,
      "Email":userEmail,
      "userName": userName,
      "fullname": fullname,
      "EmployeeId": employeeId
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(Url+"/api/Accounts/updateUser", requestOptions)
      .then(response => response.text())
      .then(result => {
        alert(result)
        setreloadpage(true)
      })
      .catch(error => alert(error));
  }
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => { setopenModalManageEdit(false); }} > X </button>
        </div>
        <div className="modaltitle">Edit User</div>

        <div className="modalinput">
          <span className="inputtitle">User Email</span>
          <br />
          <input className="inputvl" value={userEmail} onChange={e=>setuserEmail(e.target.value)}></input>
        </div>

        <div className="modalinput">
          <span className="inputtitle">userName</span>
          <br />
          <input className="inputvl" value={userName} onChange={e=>setuserName(e.target.value)}></input>
        </div>
        <div className="modalinput">
          <span className="inputtitle">EmployeeId</span>
          <br />
          <input className="inputvl" value={employeeId} onChange={e=>setemployeeId(e.target.value)}></input>
        </div>
        {/* <div className="modalinput">
          <span className="inputtitle">age</span>
          <br />
          <input className="inputvl" type="number" value={age} onChange={e=>setage(e.target.value)}></input>
        </div> */}
        <div className="modalinput">
          <span className="inputtitle">fullname</span>
          <br />
          <input className="inputvl" value={fullname} onChange={e => setfullname(e.target.value)}></input>
        </div>
        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => { setopenModalManageEdit(false); }} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={updateAccout}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default ModalManageEdit