import React, { useState, useEffect } from 'react'
import './AddDepartment.css'
import { Url } from '../../../URL'

function AddDepartment ({ setOpenModalAdduser }) {
    const [users, setusers] = useState([])
    const [departments, setdepartments] = useState([])
    const [usersId, setusersId] = useState('')
    const [departmentsId, setdepartmentsId] = useState('')

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(Url+"/api/Roles/GetAllUsers", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.status)
                }
            })
            .then(data => {
                setusers(data)
            })
            .catch(error => {
                console.log('error', error)
            });
    }, [])
    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(Url+"/api/Department/GetAllDepartment", requestOptions)
            .then(response => response.json())
            .then(data => {
                setdepartments(data)
            })
            .catch(error => console.log('error', error));
    }, [])

    const listusers = users.map(data => (
        <option key={data.id} value={data.id}>{data.email}</option>
    ))
    const listDepartment = departments.map(data => (
        <option key={data.departmentId} value={data.departmentId}>{data.departmentName}</option>
    ))
    const SummitUser = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "userId": usersId,
            "departmentId": departmentsId
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(Url+"/api/Department/AssignUserToDepartment", requestOptions)
            .then(response => response.json())
            .then(() => alert('Add user success'))
            .catch(error => {console.log('error', error)
        alert('Error please try again')});
    }
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                    <button className="xbtn" onClick={() => { setOpenModalAdduser(false); }} > X </button>
                </div>
                <div className="modaltitle">Add user Department</div>
                <div className="modalinput">
                    <span className="inputtitle">User Email</span>
                    <br />
                    <select name="usersId" id="usersId" value={usersId} onChange={e => setusersId(e.target.value)}>
                        <option value=''></option>
                        {listusers}
                    </select>
                    <br />
                    <span className="inputtitle">Department Name</span>
                    <br />
                    <select name="departmentsId" id="departmentsId" value={departmentsId} onChange={e => setdepartmentsId(e.target.value)}>
                        <option value=''></option>
                        {listDepartment}
                    </select>
                </div>
                <div className="Modalfooter">
                    <button className="cancelBtn" onClick={() => { setOpenModalAdduser(false); }} id="cancelBtn">Cancel</button>
                    <button className="SubmitBtn" onClick={SummitUser}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default AddDepartment