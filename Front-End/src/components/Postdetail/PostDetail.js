import React, { useEffect, useState } from 'react'
import './PostDetail.css'
import { Url } from '../URL'
import CmtChile from './CmtChile/CmtChile'

function PostDetail({ setopendetail, data }) {
  const [isChild, setChild] = useState(false)
  const [postCmt, setpostCmt] = useState([])
  const [postId, setpostId] = useState('')
  const [voteNumber, setvoteNumber] = useState([])
  const [comment, setcomment] = useState('')
  const [reloadpage, setreloadpage] = useState(false)
  const [Detail, setDetail] = useState([])
  const [getVoteStatus, setgetVoteStatus] = useState([])
  const [IsAnonymous] = useState([false, true]);
  const [getAnonymous, setgetAnonymous] = useState('')
  const [getCmtId, setgetCmtId] = useState('')

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url + `/api/Posts/PostDetail?postId=${data.postId}`, requestOptions)
      .then(response => response.json())
      .then(result => setDetail(result))
      .catch(error => console.log('error', error));
  }, [reloadpage])

  // summit CMT
  const sumitcmnt = () => {
    setpostId(postId)
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "postId": data.postId,
      "content": comment,
      "isAnonymous": getAnonymous,
      "isChild": false

    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(Url + "/api/Comments", requestOptions)
      .then(response => {
        if (response.ok) {
          response.json()
        } else {
          throw new Error(response.status)
        }
      })
      .then(() => {
        setreloadpage(!reloadpage)
        alert('Success')
      })
      .catch(error => {
        console.log('error', error)
        alert("No more comment can be added to this post after final closure date", error)
      });
  }

  //cmt
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch(Url + `/api/Comments/AllComments?PostId=${data.postId}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setpostCmt(data)

      })
      .catch(error => console.log('error', error));
  }, [reloadpage])

  const handelReply = (dataCmt) => {
    setgetCmtId(dataCmt)
    setChild(!isChild)
  }

  const handelReplychild = (data) => {
    setgetCmtId(data)
    setChild(!isChild)
  }
  const Cmts = postCmt.map(dataCmt => (
    <div className="Titlcmt" key={dataCmt.commentId}>
      {dataCmt.isAnonymous === false ?
        <span className='usernamecmt'>{dataCmt.username}</span> :
        <span className='usernamecmt'>Anonymous</span>
      }
      <br />
      <span className='contentcmt'>{dataCmt.content}</span><br />
      <button className='btnrepcmt' onClick={() => handelReply(dataCmt)}>Reply</button>
      <br />
      {dataCmt.childItems.map(data => (
        <div className="Titlchildcmt" key={data.commentId}>
          {data.isAnonymous === false ?
            <span className='usernamecmt'>{data.username}</span> :
            <span className='usernamecmt'>Anonymous</span>
          }<br />
          <span className='contentcmt'>{data.content}</span>
          <button className='btnrepcmt' onClick={() => handelReplychild(data)}>Reply</button>
        </div>
      ))}
    </div>
  ))


  //vote
  const upvote = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "voteInput": true,
      "postId": data.postId
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(Url + "/api/Votes/voteBtnClick", requestOptions)
      .then(response => response.json())
      .then(() => {
        setreloadpage(!reloadpage)
      })
      .catch(error => console.log('error', error));
  }
  const downVote = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "voteInput": false,
      "postId": data.postId
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(Url + "/api/Votes/voteBtnClick", requestOptions)
      .then(response => response.json())
      .then(() => {
        setreloadpage(!reloadpage)
      })
      .catch(error => console.log('error', error));
  }
  //vote
  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url + `/api/Votes/GetVoteStatusOfPost?postId=${data.postId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setvoteNumber(result)
      })
      .catch(error => console.log('error', error));
  }, [reloadpage])

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(Url + `/api/Votes/GetUserVoteStatus?postId=${data.postId}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        setgetVoteStatus(result)
      })
      .catch(error => console.log('error', error));
  }, [reloadpage])

  return (
    <div className="modalBackground">
      <div className="modalPostContainer">
        <div className="titleCloseBtn">
          <button className="xbtn" onClick={() => { setopendetail(false); }} > X </button>
        </div>
        <header>
          <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet' />
          <div className="header_posts">
            <i className='bx bx-user-circle icon'></i>
            <div className="userposts_name">
              <span className="name_userposts">{Detail.username}</span>
              <div className='day'>
                <div className='day-sumit' type="date" >{Detail.createdDate}</div>
              </div>
            </div>
          </div>
        </header>
        <div className="Category">
          <span className="TopicName">{Detail.listCategoryName}</span>
        </div>
        <div className="TitlePost">
          <p className="TopicName">Title : {Detail.title}</p>
        </div>
        <div className="Content">
          <span className="TopicName">Topic : {Detail.topicName}</span>
        </div>
        <div className="Content">
          <span className="TopicName">Content : {Detail.content}</span>
        </div>
        <div className="Desc">
          <span className="TopicName">Description : {Detail.desc}</span>
          <div className='showselectModal'>
            <select name="posttyle" id="posttyle" value={getAnonymous} onChange={e => setgetAnonymous(e.target.value)}>
              <option value=''>Choose your type of comments</option>
              <option value={IsAnonymous[0]}   >publicly</option>
              <option value={IsAnonymous[1]}  >Anonymously</option>
            </select>
          </div>
          <div className="iconsPost"  >
            {getVoteStatus.upVote === true ?
              <button className='bt btn1' onClick={upvote} >
                <i className='bx bx-upvote bx1'>
                  <span className='like' >{voteNumber.upvoteCount}</span>
                </i>
              </button> :
              <button className='bt' onClick={upvote} >
                <i className='bx bx-upvote'>
                  <span className='like' >{voteNumber.upvoteCount}</span>
                </i>
              </button>
            }
            {getVoteStatus.downVote === true ?
              <button className='bt btn1' onClick={downVote}>
                <i className=' bx bx-downvote bx1 bxd'>
                  <span className='dislike'>{voteNumber.downVoteCount}</span>
                </i>
              </button> :
              <button className='bt' onClick={downVote}>
                <i className='bx bx-downvote bxd'>
                  <span className='dislike'>{voteNumber.downVoteCount}</span>
                </i>
              </button>
            }
            <span>
              <i className='bx bx-show-alt'>
                <span className='view'>View : {Detail.viewsCount}</span>
              </i>
            </span>
          </div>
          <div className="modalInput">
            <textarea placeholder='Write your comments here...' className="Commentbox" value={comment} onChange={e => setcomment(e.target.value)}></textarea>
            <button className='btn' onClick={sumitcmnt}>Submit</button>
          </div>
          {Cmts}
          {isChild && <CmtChile setopenChild={setChild} data={getCmtId} setreloadpage={setreloadpage} />}
        </div>
      </div>
    </div>
  )
}

export default PostDetail