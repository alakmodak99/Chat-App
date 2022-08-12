import React from 'react'
import Messages from './messages'
import RoomAndUsers from './Room-and-Users'
import Sendmessage from './send_messages'
import styles from "./styles.module.css"
const Chat = ({username, room, socket}) => {
  let A=JSON.parse(localStorage.getItem("user_room"))
 const Username= A[A.length-1].username;
 const Room= A[A.length-1].room;
  console.log(username? username : Username, room)
  return (
    <div className={styles.chatContainer}>
      <RoomAndUsers socket={socket} username={username? username: Username} room={room? room : Room}/>
      <div>
        <Messages socket={socket}/> 
        <Sendmessage socket={socket} username={username ? username : Username} room={room ? room : Room}/>
      </div>
    </div>
  )
}
export default Chat
