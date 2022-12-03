import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Navbar.css';
import {Url} from './URL.js'



function Navbar() {
    const [user, setuser] = useState([]);
    const [userrole, setuserrole] = useState([])
    const token = sessionStorage.getItem("accessToken");
    const Navigate = useNavigate();
    useEffect(() => {
        loadDataProfile()
    }, [token])
    const loadDataProfile = () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch( Url+"/api/AuthManagement/GetUser", requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error(response.status)
                }
            })
            .then(result => {
                setuser(result)
                setuserrole(result.role)
                // result.role.map(data => {
                //     arrayauth.push(data)
                // })
                // console.log(arrayauth[0]);
            })
            .catch(error => {
                console.log('error', error)
            });
    }

    const logout = () => {
        Navigate('/')
        sessionStorage.removeItem("accessToken")  
        // props.onLogoutSuccess()
    }

    // console.log(user.role);
    let Navbarrole
    if (userrole[0] === 'admin') {
        Navbarrole = (
            <div className="menu">

                <ul className="menu-links">
                    <li className="nav-link">
                        <Link to='/Home'>
                            <i className='bx bx-home icon' ></i>
                            <span className="text nav-text">Home Page</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/MyProfile'>
                            <i className='bx bx-user-circle icon' ></i>
                            <span className="text nav-text">My Profile</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/ManageAccount'>
                            <i className='bx bx-cog icon'></i>
                            <span className="text nav-text">Manage System </span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/UploadIdea'>
                            <i className='bx bx-upload icon' ></i>
                            <span className="text nav-text">Upload Idea</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/AdminChart'>
                            <i className='bx bx-pie-chart-alt-2 icon'></i>
                            <span className="text nav-text">Statistical</span>
                        </Link>
                    </li>


                    <li className="nav-link">
                        <Link to='/MyPost'>
                            <i className='bx bx-id-card icon' ></i>
                            <span className="text nav-text">My Post</span>
                        </Link>
                    </li>


                    <li className="nav-link">
                        <Link to='/INTRODUCTION'>
                            <i className='bx bx-buildings icon' ></i>
                            <span className="text nav-text">About Company</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }  else if (userrole[0] === 'qac') {
        Navbarrole = (
            <div className="menu">

                <ul className="menu-links">
                    <li className="nav-link">
                        <Link to='/Home'>
                            <i className='bx bx-home icon' ></i>
                            <span className="text nav-text">Home Page</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/MyProfile'>
                            <i className='bx bx-user-circle icon' ></i>
                            <span className="text nav-text">My Profile</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/ManageDepartmentAccount'>
                            <i className='bx bx-network-chart icon'></i>
                            <span className="text nav-text">Manage Department </span>
                        </Link>
                    </li>
                    
                    <li className="nav-link">
                        <Link to='/UploadIdea'>
                            <i className='bx bx-upload icon' ></i>
                            <span className="text nav-text">Upload Idea</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/MyPost'>
                            <i className='bx bx-id-card icon' ></i>
                            <span className="text nav-text">My Post</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/INTRODUCTION'>
                            <i className='bx bx-buildings icon' ></i>
                            <span className="text nav-text">About Company</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    } else if (userrole[0] === 'qam') {
        Navbarrole = (
            <div className="menu">
                <ul className="menu-links">
                    <li className="nav-link">
                        <Link to='/Home'>
                            <i className='bx bx-home icon' ></i>
                            <span className="text nav-text">Home Page</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/MyProfile'>
                            <i className='bx bx-user-circle icon' ></i>
                            <span className="text nav-text">My Profile</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/ManageDepartmentQamDepartment'>
                            <i className='bx bx-cog icon'></i>
                            <span className="text nav-text">Manage Department </span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/ManageCategory'>
                            <i className='bx bx-category icon'></i>
                            <span className="text nav-text">Manage Category </span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/UploadIdea'>
                            <i className='bx bx-upload icon' ></i>
                            <span className="text nav-text">Upload Idea</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/Chart'>
                            <i className='bx bx-pie-chart-alt-2 icon'></i>
                            <span className="text nav-text">Statistical</span>
                        </Link>
                    </li>


                    <li className="nav-link">
                        <Link to='/MyPost'>
                            <i className='bx bx-id-card icon' ></i>
                            <span className="text nav-text">My Post</span>
                        </Link>
                    </li>


                    <li className="nav-link">
                        <Link to='/INTRODUCTION'>
                            <i className='bx bx-buildings icon' ></i>
                            <span className="text nav-text">About Company</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }else if (userrole[0] === 'staff') {
        Navbarrole = (
            <div className="menu">

                <ul className="menu-links">
                    <li className="nav-link">
                        <Link to='/Home'>
                            <i className='bx bx-home icon' ></i>
                            <span className="text nav-text">Home Page</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/MyProfile'>
                            <i className='bx bx-user-circle icon' ></i>
                            <span className="text nav-text">My Profile</span>
                        </Link>
                    </li>
                    
                    <li className="nav-link">
                        <Link to='/UploadIdea'>
                            <i className='bx bx-upload icon' ></i>
                            <span className="text nav-text">Upload Idea</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/MyPost'>
                            <i className='bx bx-id-card icon' ></i>
                            <span className="text nav-text">My Post</span>
                        </Link>
                    </li>

                    <li className="nav-link">
                        <Link to='/INTRODUCTION'>
                            <i className='bx bx-buildings icon' ></i>
                            <span className="text nav-text">About Company</span>
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <div>
            <nav className="sidebar ">
                <header>
                    <link href='https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' rel='stylesheet' />
                    <div className="image-text">
                        <div className="text logo-text" >
                            <span className="name-user">{user.username}</span>
                            <span className="profession">{user.email}</span>
                        </div>
                    </div>
                </header>
                <div className="menu-bar">
                    {Navbarrole}
                    <button className="bottom-content" onClick={logout}>
                        <li>
                            <i className='bx bx-log-out icon' ></i>
                            <span className="text nav-text">Logout</span>
                        </li>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default Navbar