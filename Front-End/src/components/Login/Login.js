import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Url } from '../URL';

function Login() {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const Navigate = useNavigate()
    useEffect(() => {
        if (sessionStorage.getItem("accessToken") != null) {
            Navigate('/Home')
        } else {
            console.log('khong');
        }
    }, [])


    const login = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(Url+"/api/AuthManagement/Login", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(response.status)
            }
            // response.json()
        })
        .then(result => {
            sessionStorage.setItem("accessToken", result.token)
            Navigate('/Home')
        })
        .catch(error => {
            console.log('error', error)
            alert("EMAIL OR PASSWORD ERROR")
            
            
        });
    }
    // const onLogoutSucces = () => {

    // }
    return (
        <div>
            <div>
                <title>Sign in</title>
                <div className="main">
                    <p className="sign" align="center">Sign in</p>
                    <div className="form1">
                        <input className="un " type="text" align="center" placeholder="Username" value={email} onChange={e => setemail(e.target.value)} />
                        <input className="pass" type="password" align="center" placeholder="Your Password" value={password} onChange={e => setpassword(e.target.value)} />
                        <button className="submit" align="center" onClick={login}>Sign in</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login