import React, { useState } from 'react'
import styles from './styles.module.css';
const Sendmessage = ({socket, username, room}) => {
  const [message, setMessage] = useState("");
  const sendMessage = () =>{
  if(message !== ""){
    const createdTime =Date.now();
    socket.emit("send_message", {username, room, message, createdTime})
    setMessage("")
  }
  }
  return (
    <div className={styles.sendMessageContainer}>
    <input
      className={styles.messageInput}
      placeholder='Message...'
      onChange={(e) => setMessage(e.target.value)}
      value={message}
    />
    <button className='btn btn-primary' onClick={sendMessage}>
      Send Message
    </button>
  </div>
  )
}

export default Sendmessage
