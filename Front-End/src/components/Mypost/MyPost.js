import React, { useState, useEffect } from 'react';
import './MyPost.css';
// import ModalPost from './ModalPost';
import ModalReason from './Reason/ModalReason';
import Navbar from '../Navbar';
import { Url } from '../URL';
import PostDetail from '../Postdetail/PostDetail';



function MyPost() {
    const [modalOpen, setModalOpen] = useState(false);
    const [allmypost, setallmypost] = useState([])
    const [detailopen, setdetailopen] = useState(false)
    const [Post, setPost] = useState({})
    const [errorMes,seterrorMes]= useState('No Posts Avalaible')
    const [feedback,setfeadback]= useState('')
    const [loading , setloading]=useState(false)

    // view post
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(Url + "/api/Posts/MyPost", requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.length !== 0){
                    setallmypost(data)
                }else{
                    seterrorMes(data)
                }
                setloading(true)
            })
            .catch(error => console.log('error', error));
    }, [])

    // const deletepost = (data) => {
    //     var myHeaders = new Headers();
    //     myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
    //     myHeaders.append("Content-Type", "application/json");

    //     var raw = JSON.stringify({
    //         "postId": data.postId,
    //         "topicId": data.topicId
    //     });

    //     var requestOptions = {
    //         method: 'DELETE',
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: 'follow'
    //     };

    //     fetch("https://localhost:5001/api/Posts/Deletepost", requestOptions)
    //         .then(response => response.json())
    //         .then(result => console.log(result))
    //         .catch(error => console.log('error', error));
    // }
    // console.log(allmypost);

    const handelView = (data) => {
        setdetailopen(true)
        setPost(data)
    }
    const handelfeedback = (data) => {
        setModalOpen(true)
        setfeadback(data)
    }
    
    const listmypost = allmypost.map(data => (
        <div className="PostContainer" key={data.postId}>
            <div className="titleCloseBtn">
            </div>
            <header id='header'>
                <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet' />
                <div className="header_posts">
                    <i className='bx bx-user-circle icon'></i>
                    <div className="userposts_name">
                        <span className="name_userposts">{data.username}</span>
                        <div className='day'>
                            <div className='day-sumit'>{data.createdDate}</div>
                        </div>
                    </div>
                </div>
            {data.statusMessage === 'Approved' ?
            <div className='Status'>
                <button className='APbutton' onClick={() => handelfeedback(data)}>{data.statusMessage}</button>
            </div>
            :
            data.statusMessage === 'Rejected' ?
            <div className='Status'>
                <button className='RJbutton' onClick={() => handelfeedback(data)}>{data.statusMessage}</button>
            </div>
            :
            <div className='Status'>
                <button className='PDbutton' onClick={() => handelfeedback(data)}>{data.statusMessage}</button>
            </div>
            }
            </header>
            <div className="Category">
                <span className="TopicName">{data.listCategoryName}</span>
            </div>
            <div className="TitlePost">
                <p className="TopicName">Title : {data.title}</p>
            </div>
            <div className="Content">
                <span className="TopicName">Content : {data.content}</span>
            </div>
            <div className="Desc">
                <span className="TopicName">Description : {data.desc}</span>

                <div className="iconsPost">
                    <button className='btn' onClick={() => handelView(data)} >Detail</button>

                    <span>
                        <i className='bx bx-show-alt'>
                            <span className='view'>{data.viewsCount}</span>
                        </i>
                    </span>
                    {/* <button className='btn delete' onClick={deletepost(data)}>Delete</button> */}
                </div>
            </div>
        </div>
    ))

    return <div>
        <Navbar />
        <section className="home">
            <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet' />
            {loading ? 
            <div>
                {errorMes && listmypost}
                {detailopen && <PostDetail setopendetail={setdetailopen} data={Post} />}
                {modalOpen && <ModalReason setOpenModal={setModalOpen} data={feedback}/>}
            </div>:
            <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
            }
        </section>
    </div>
}

export default MyPost;
