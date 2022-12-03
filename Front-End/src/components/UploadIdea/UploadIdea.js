import React, { useState, useEffect } from 'react';
import './UploadIdea.css';
import Navbar from '../Navbar';
import ModalPolicy from './Policy/ModalPolicy';
import {Url} from '../URL'



function UploadIdea() {
  const [title, settitle] = useState('');
  const [content, setcontent] = useState('');
  const [Desc, setDesc] = useState('');
  const [IsAnonymous] = useState([false,true]);
  const [files, setfiles] = useState('');
  const [Topics, setTopics] = useState([]);
  const [alltag, setalltag] = useState([]);
  const [cateselect, setcateselect] = useState('')
  const [topicselect, settopicselect] = useState('')
  const [modalOpen, setModalOpen] = useState(false);
  const [getAnonymous,setgetAnonymous]=useState('')
  const[reloadpage,setreloadpage]=useState(false)

  const sumbmitidea = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
   
    let formdata = new FormData()
    formdata.append("title", title);
    formdata.append("content", content);
    formdata.append("Desc", Desc);
    formdata.append("IsAnonymous", getAnonymous);
    formdata.append("listCategoryId", cateselect);
    formdata.append("TopicId", topicselect);
    formdata.append("files", files, files.name);

    console.log(typeof files);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(Url+"/api/Posts/CreatePost", requestOptions)
    .then(response => {
      if (response.ok) {
          return response.text()
      } else {
          throw new Error(response.status)
      }
  })
      .then(result => 
       {alert(result)
        setModalOpen(false)
        setreloadpage(!reloadpage)
      }
    )
      .catch(error => 
    // console.log(error)
    alert(error)
  )
  }

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch( Url+"/api/topics/ValidTopics", requestOptions)
      .then(response => response.json())
      .then(data => {
        setTopics(data)

      })
      .catch(error => console.log('error', error))
  }, [reloadpage])

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url+"/api/Category/AllTag", requestOptions)
      .then(response => response.json())
      .then(data => {
        setalltag(data)
      })
      .catch(error => console.log('error', error));
  }, [reloadpage])

  const listTopics = Topics.map(data => (
    <option key={data.topicId} value={data.topicId}>{data.topicName}</option>
  ))
    
  const listCategory = alltag.map(data => (
    <option key={data.categoryId} value={data.categoryId}>{data.categoryName}</option>
  ))

  return (
    <div>
    <Navbar/>
    <section className='UploadIdeapage'>
        <div className="text">UPLOAD IDEA</div>
        <div className='IdeaFrom'>
            
            {/* <div className='InputIdea'>Upload your Idea</div> */}
            <div className='Ideainput'>
            
                <span className="inputtitle">Title</span>
                <input className='IdeaTile1' value={title} onChange={e => settitle(e.target.value)}></input>
                <span className="inputtitle">Content</span>
                <input className='IdeaTile2' value={content} onChange={e => setcontent(e.target.value)}></input>
            </div>
            <div className='Ideainput'>
                <span className="inputtitle">Description</span>
                <textarea className='IdeaDct' placeholder="Write something..." value={Desc} onChange={e => setDesc(e.target.value)}></textarea>
            </div>
            <div className='styleofpost'>
              <span>Anonymity : </span>
            <select name="posttyle" id="posttyle" value={getAnonymous} onChange={e => setgetAnonymous(e.target.value)}>
                <option value=''></option>
                <option value={IsAnonymous[0]}   >public</option>
                <option  value={IsAnonymous[1]}  >private</option>
            </select>
            </div>
            <div className='styleofcategory'>
              <span>Topic : </span>
            <select name="category" id="category" value={topicselect} onChange={e => settopicselect(e.target.value)}>
             <option value=''></option>
            {listTopics}
            </select>
            </div>
            <div className='styleofcategory'>
              <span>Category : </span>
            <select name="category" id="category" value={cateselect} onChange={e => setcateselect(e.target.value)}> 
            <option value=''></option>
               {listCategory}
            </select>
            </div>
            <div className='InputTitle'>
                <span className="inputtitle">Input File: </span>
                <input type="file" id="myfile" name="myfile" files={files} onChange={e => setfiles(e.target.files[0])}></input>
            </div>
            <button className='SubmitIdea1' onClick={() => setModalOpen(true)}>Submit</button>
                {modalOpen && <ModalPolicy setOpenModal={setModalOpen} sumbmitidea={sumbmitidea}/>}
        </div>
    </section>
</div>
  )
}

export default UploadIdea