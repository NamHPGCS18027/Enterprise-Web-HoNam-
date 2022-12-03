
import React,{ useState,useEffect } from 'react';
import './MyProfile.css';
// import ModalPost from './ModalPost';
import Navbar from '../Navbar';
import { Url } from '../URL';



function MyProfile (){
    const[User,setUser]=useState([])
    const [loading , setloading]=useState(false)
    
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(Url+"/api/AuthManagement/GetUser", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.status)
                }
            })
            .then(result => {
                setUser(result)
                setloading(true)
            })
            .catch(error => {
                console.log('error', error)
            });
    }, [])
    console.log(User);
	return <div>
        <Navbar/>
        <section className="homeMyIn4">
            <link href='https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css' rel='stylesheet'/>
    
    <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet'/>
        <div className="ContainIcon">
        <i className='bx bx-user-circle icon' style={{fontSize: "200px"}}></i>
        </div>
    {/* copy từ đây */}
    {/* <div className="modalBackground"> */}
    {loading ? 
      <div className="PostContainerMyIn4">
        
        <div className="In4">
        <span className="TopicName">Full Name: {User.fullname} </span>
        </div>
        <div className="In4">
        <span className="TopicName">Username : {User.username} </span>
        </div>
        <div className="In4">
        <span className="TopicName">EmployeeId : {User.employeeId} </span>
        </div>
        <div className="In4">
        <span className="TopicName">Email : {User.email} </span>
        </div>
        <div className="In4">
        <span className="TopicName">Role : {User.role} </span>
        </div>
        <div className="In4">
        <span className="TopicName">Department: {User.department}</span>
        {/* đây là div chứa files */}
        </div>
    </div>:
    <div loading={true} text={"loading..."} className="loading">LOADING . . .</div>
    }
</section>
    </div>
}

export default MyProfile;
