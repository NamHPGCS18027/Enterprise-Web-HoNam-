import React,{useState , useEffect} from "react";
import './ModalDeadlineDelete.css'
import {Url} from '../../URL'

function ModalDeadlineDownload({ setOpenModalDeadlineDownload , data }) {
  const [getfile, setgetfile] = useState([])

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url + `/api/SumUp/SumUp?TopicId=${data.topicId}`, requestOptions)
    .then(response => response.text())
      .then(data => {
        setgetfile(data)
      })
      .catch(error => console.log('error', error))
  }, [])
  
  const download = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url + `/api/FileAction/GetFile?filePath=${getfile}`, requestOptions)
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // the filename you want
      a.download = getfile[0];
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      alert('your file has downloaded!'); // or you know, something with better UX...
    })
    .catch(() => alert('oh no!'));
  }
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => {setOpenModalDeadlineDownload(false);}} > X </button>
        </div>
        <div className="modaltitle">Download All Topic file</div>
        <div className="modalinput">
            <span className="inputtitle">Topic Name : {data.topicName}</span>
            <br/>
        </div>
        <div className="modalinput">
            <span className="inputtitle">Topic Desc : {data.topicDesc}</span>
            <br/>
        </div>
        <div className="modalinput">
            <span className="inputtitle">Closure Date : {data.closureDate}</span>
            <br/>
        </div>
        <div className="modalinput">
            <span className="inputtitle">Final Closure Date : {data.finalClosureDate}</span>
            <br/>
        </div>

        <div className="Modalfooter">
          <button className="cancelBtn" onClick={() => {setOpenModalDeadlineDownload(false);}} id="cancelBtn">Cancel</button>
          <button className="SubmitBtn" onClick={download} >Download</button>
        </div>
      </div>
    </div>
  );
}

export default ModalDeadlineDownload