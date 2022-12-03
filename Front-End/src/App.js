import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Homepage/Home';
import Login from './components/Login/Login';
import UploadIdea from './components/UploadIdea/UploadIdea';
import './App.css';
import Category from './components/Category/Category';
import ManageAccount from './components/Admin/Account/ManageAccount';
import MyProfile from './components/Profile/MyProfile';
import AboutUs from './components/AboutUs/AboutUs'
import MyPost from './components/Mypost/MyPost';
import ManageDeadLine from './components/Topic/ManageDeadLine';
import ManageDepartmentIdea from './components/QACidea/ManageDepartmentIdea';
import ManageDepartmentQamDepartment from './components/department/ManageDepartmentQamDepartment';
import ManageDepartmentAccount from './components/QACAccount/ManageDepartmentAccount';
import AboutHis from './components/AboutUs/AboutHis';
import AboutIntro from './components/AboutUs/AboutIntro';
import AboutInvestor from './components/AboutUs/AboutInvestor';
import ManagementDepartmentQamAccount from './components/QAMAccount/Account/ManageDepartmentQamAccount';
import ManageDepartmentQamIdea from './components/QAMIdea/ManageDepartmentQamIdea';
import { ChartPage } from './components/Chart/ChartPage';
import AdminDepartment from './components/Admin/DepartmentAdmin/AdminDepartment';
import PostPopular from './components/Homepage/PostPopular';
import PostLastComment from './components/Homepage/PostLastComment';
import { AdminChartPage } from './components/Admin/AdminChart/AdminChartPage';
import QamDeadLine from './components/QAMTopic/QamDeadLine';



class App extends Component {
	render() {
		return (
			<Router>
				<Routes>
					<Route exact path='/' element={<Login />}></Route>
					<Route exact path='/Home' element={< Home />}></Route>
					<Route exact path='/AboutUs' element={< AboutUs />}></Route>
					<Route exact path='/UploadIdea' element={< UploadIdea />}></Route>
					{/* <Route exact path='/Topic' element={< Topic />}></Route> */}
					<Route exact path='/ManageCategory' element={< Category />}></Route>
					<Route exact path='/ManageAccount' element={< ManageAccount />}></Route>
					<Route exact path='/MyProfile' element={< MyProfile />}></Route>
					<Route exact path='/MyPost' element={< MyPost />}></Route>
					<Route exact path='/ManageDeadLine' element={< ManageDeadLine />}></Route>
					<Route exact path='/ManageDepartmentIdea' element={< ManageDepartmentIdea />}></Route>
					<Route exact path='/ManageDepartmentQamDepartment' element={< ManageDepartmentQamDepartment />}></Route>
					<Route exact path='/ManageDepartmentIdea' element={< ManageDepartmentIdea />}></Route>
					<Route exact path='/ManageDepartmentAccount' element={< ManageDepartmentAccount />}></Route>
					{/* <Route exact path='/Profile' element={< Profile />}></Route> */}
					<Route exact path='/INTRODUCTION' element={< AboutIntro />}></Route>
					<Route exact path='/HISTORY' element={< AboutHis />}></Route>
					<Route exact path='/INVESTORRELATIONS' element={< AboutInvestor />}></Route>
					<Route exact path='/ManageDepartmentQamAccount' element={< ManagementDepartmentQamAccount />}></Route>
					<Route exact path='/ManageDepartmentQamIdea' element={< ManageDepartmentQamIdea />}></Route>
					<Route exact path='/ManageDepartmentQamDepartment' element={< ManageDepartmentQamDepartment />}></Route>
					{/* <Route exact path='/PostDetail' element={< PostDetail/>}></Route> */}
					<Route exact path='/Chart' element={< ChartPage />}></Route>
					<Route exact path='/AdminDepartment' element={< AdminDepartment />}></Route>
					<Route exact path='/Popular' element={< PostPopular />}></Route>
					<Route exact path='/LastComment' element={< PostLastComment />}></Route>
					<Route exact path='/AdminChart' element={< AdminChartPage />}></Route>
					<Route exact path='/QamDeadLine' element={< QamDeadLine />}></Route>
				</Routes>
			</Router>
		);
	}
}

export default App;
