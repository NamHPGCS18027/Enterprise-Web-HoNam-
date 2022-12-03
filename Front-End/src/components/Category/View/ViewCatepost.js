import React , {useState , useEffect} from 'react'
import './viewCatepost.css'
import { Url } from '../../URL'
import PostDetail from '../../Postdetail/PostDetail'

function ViewCatepost({setviewCatepost , data}) {
    const [posts, setposts] = useState([])
    const [detailopen, setdetailopen] = useState(false)
    const [viewpost,setviewpost]=useState('')
  
    useEffect(() => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem("accessToken"));
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
  
      fetch(Url+`/api/Category/GetListPostsOfThisCate?cateId=${data.categoryId}`, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setposts(data)
        })
        .catch(error => console.log('error', error));
    }, [])
    
    console.log(posts);
    
    const viewIdea = (data) =>{
        setdetailopen(true)
        setviewpost(data)
    }

    const listposts = posts.map(data => (
      <tr key={data.id}>
        <td>{data.username}</td>
        <td>{data.title}</td>
        <td>{data.desc}</td>
        <td>
        <button className='View' onClick={() => viewIdea(data)}>View</button>
      </td>
      </tr>
    ))
    
    return (
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="titleCloseBtn">
            <button className="xbtn" onClick={() => { setviewCatepost(false); }} > X </button>
          </div>
          <div className="modaltitle">Idea Detail</div>
  
          <table className='tableuser'>
            <thead>
              <tr>
                <th>Username</th>
                <th>Title</th>
                <th>desc</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {listposts}
              {detailopen && <PostDetail setopendetail={setdetailopen} data={viewpost} />}
            </tbody>
          </table>
          <div className="Modalfooter">
            <button className="cancelBtn" onClick={() => { setviewCatepost(false); }} id="cancelBtn">Cancel</button>
          </div>
        </div>
      </div>
  )
}

export default ViewCatepost