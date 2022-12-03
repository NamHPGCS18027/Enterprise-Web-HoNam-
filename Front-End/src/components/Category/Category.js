import React,{useState , useEffect} from 'react'
import Navbar from '../Navbar'
import './Category.css'
import ModalCategoryCreate from './Create/ModalCategoryCreate';
import ModalCategoryDelete from './Delete/ModalCategoryDelete'
import { Url } from '../URL';
import ViewCatepost from './View/ViewCatepost';

function Category() {
    const[alltag,setalltag]=useState([]);
    const [reloadpage,setreloadpage]= useState(false);
    const [ModalCategoryCreateOpen, setOpenModalCategory] = useState(false);
    const [ModalCategoryDeleteOpen, setModalCategoryDelete] = useState(false);
    const [deleteCate,setdelateCate]=useState('')
    const [viewCatepost,setviewCatepost]=useState(false)
    const [catePosts,setcatePosts]=useState('')
  
    useEffect(() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization" , "Bearer "+ sessionStorage.getItem("accessToken"));
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

    const handaleDelete = (data) => {
      setModalCategoryDelete(true)
      setdelateCate(data)
    }

    const handaleView = (data) =>{
      setviewCatepost(true)
      setcatePosts(data)
    }
    const listCategory = alltag.map( data => (
      <tr key={data.categoryId}>
      <td >{data.categoryName}</td>
      <td >{data.desc}</td>
      <td>{data.postCount}</td>
      <td>
        <button className='submit-user' onClick={() => handaleView(data)}>View</button>
      </td>
      <td>
        <button className='submit-user' onClick={() => handaleDelete(data)}>Delete</button>
      </td>
    </tr>
    ))

    const addCate = (categoryName , desc) =>{
      alltag.push({categoryName , desc})
    }
     
  return (
    <div>
    <Navbar/>
    <section className='Managementpage'>

    
    <div className='manage-header'>
      <div className="text">Category Management</div>
    </div>

    <div className='buttonAddUser'>
      <button className='buttonMana' onClick={() => {setOpenModalCategory(true);}}>Add Categories</button>
      {ModalCategoryCreateOpen && <ModalCategoryCreate setOpenModalCategoryCreate={setOpenModalCategory} addCate={addCate} setreloadpage={setreloadpage}/>}
    </div>
  
    <div className='contentManage'>
        <div className='text'>Categories List</div>
    </div>

      <table className='tableuser'>
        <thead>
        <tr>
          <th>Category Name</th>
          <th>Description</th>
          <th>Post Count</th>
          <th>View Post</th>
          <th>Delate category</th>
        </tr>
        </thead>
        <tbody>
        {listCategory}
        {ModalCategoryDeleteOpen && <ModalCategoryDelete setOpenModalCategoryDelete={setModalCategoryDelete} data={deleteCate} setreloadpage={setreloadpage} />}
        {viewCatepost && <ViewCatepost setviewCatepost={setviewCatepost}  data={catePosts}/>}
      </tbody>
    </table>

  </section>
  </div>
  )
}

export default Category