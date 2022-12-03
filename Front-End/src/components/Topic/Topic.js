import React,{useState, useEffect} from 'react'
import './Topic.css'
import Navbar from '../Navbar'
import ModalEditTopic from './Edit/ModalEditTopic';


function Topic() {
  const[topicName,settopicName]= useState('');
  const[closureDate,setclosureDate]= useState('');
  const[finalClosureDate,setfinalClosureDate]= useState('');
  const[Topics,setTopics]=useState([])
  const [modaltopicOpen, setModaltopicOpen] = useState(false);
  const [reloadpage,setreloadpage]= useState(false)
  
  

  const Summittopic = () =>{
    var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          "topicName": topicName,
          "closureDate": closureDate,
          "finalClosureDate": finalClosureDate
        });

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("https://localhost:5001/api/Topics/CreateTopic", requestOptions)
          .then(response => response.json())
          .then(result =>{
            console.log(result);  
            setreloadpage(!reloadpage)
          })
          .catch(error => {console.log('error', error)
          setreloadpage(!reloadpage)
        });
        }
        // get all topic
        useEffect(() => {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow'
            };

            fetch("https://localhost:5001/api/Topics/GetAllTopic", requestOptions)
              .then(response => response.json())
              .then(data => {
                setTopics(data)
              })
              .catch(error => console.log('error', error))
        }, [reloadpage])

        // delete topic
        const handleDelete = (topicId) => {
            var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var raw = JSON.stringify({
            "topicId": topicId
          });
              var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };

              fetch("https://localhost:5001/api/Topics/RemoveTopic", requestOptions)
                .then(response => response.json())
                .then(result => {
                  console.log(result)
                  setreloadpage(!reloadpage)
                })
                .catch(error => {console.log('error', error)
                setreloadpage(!reloadpage)
              });
        }
        
        const handleUpdate = () => {
          // console.log(topicId);
          // Navigate('/ModalEditTopic/'+ topicId.topicId)
          setModaltopicOpen(true);
        }
        const listTopics = Topics.map(data => (
        <tr key={data.topicId}>
        <td >{data.topicName}</td>
        <td >{data.closureDate}</td>
        <td >{data.finalClosureDate}</td>
        <td>
        <button className='submit-user' onClick={()=> handleUpdate(data)}>Edit</button>
        {modaltopicOpen && <ModalEditTopic setOpenModaltopic={setModaltopicOpen} data={data}/>}
        </td>
        <td>
          <button onClick={()=> handleDelete(data.topicId)} >Delete</button>
        </td>
        </tr>
        ))
  return (
    <div>
        <Navbar/>
        <section className='Topic'>
            <div className='text'>Topic</div>
            <div className='topicSimmitform'>
              <div>
                <span>Topic Name</span>
                <input value={topicName} onChange={e => settopicName(e.target.value)}/>
              </div>
              <div>
                <span>Closure Date</span>
                <input type="datetime-local" value={closureDate} onChange={e => setclosureDate(e.target.value)}/>
              </div>
              <div>
                <span>Final Closure Date</span>
                <input type="datetime-local" value={finalClosureDate} onChange={e => setfinalClosureDate(e.target.value)}/>
              </div>
              <button onClick={Summittopic}>Summit</button>
            </div>
        </section>
        <section className='tableTopics' >
        <table >
        <thead>
          <tr>
            <th>Topic</th>
            <th>Closure Date</th>
            <th>Final Closure Date</th>
            <th>Edit Topic</th>
            <th>Delete Topic</th>
          </tr>
        </thead>
          <tbody>
            {listTopics}
          </tbody>
      </table>
        </section>
    </div>
  )
}

export default Topic