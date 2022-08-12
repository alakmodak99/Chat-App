import React from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
const Home = ({username, setUsername, room, setRoom, socket}) => {
    const navigate= useNavigate()
    const join_Room = ()=>{
if(room !=="" && username !==""){
  let Arr=JSON.parse(localStorage.getItem("user_room")) || []
  Arr.push({username, room})
  localStorage.setItem("user_room", JSON.stringify(Arr))
  console.log(Arr[0].username)
    socket.emit('join-room', {username, room})
}
//Redirect to chat page
navigate("/chat", {replace:true})
    }
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>AllRooms</>`}</h1>
        <input 
        className={styles.input} 
        placeholder='Username...'
        onChange={e=> setUsername(e.target.value)} />

        <select 
        className={styles.input} 
        onChange={e=>setRoom(e.target.value)}>
          <option>-- Select Room --</option>
          <option value='fun'>Fun</option>
          <option value='learning'>Learning</option>
          <option value='gaming'>Gaming</option>
          <option value='entertainment'>Entertainment</option>
        </select>

        
<button 
className='btn btn-secondary'
 style={{
     width: '100%'
  }}
  onClick={join_Room}>
    Join Room
    </button>
      </div>
      
    </div>
  )
}

export default Home
