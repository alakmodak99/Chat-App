import React, { useEffect, useState, useRef } from 'react'
import styles from "./styles.module.css"
const Messages = ({socket}) => {
const [messagesReceived, setMessagesReceived] = useState([]);
const messageColumnRef = useRef(null);
useEffect(()=>{
    socket.on('receive_message', data =>{
        console.log(data);
        setMessagesReceived(state => [...state, {
            message: data.message,
            username: data.username,
            __createdtime__: data.createdTime
        },
    ])
    })
    // Remove event listener on component unmount
    return ()=> socket.off('receive_message')
},[socket])

useEffect(()=>{
      // Last 100 messages sent in the chat room (fetched from the db in backend)
      socket.on('last_100_messages', last100Messages =>{
        console.log('Last 100 messages:', JSON.parse(last100Messages));
        last100Messages=JSON.parse(last100Messages)
        // Sort these messages by createdTime
        last100Messages
         = (last100Messages)
         .sort((a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__) )
        setMessagesReceived(e=>[...last100Messages, ...e])
      })
      return () => socket.off('last100Messages')
},[socket])
  // Scroll to the most recent message
  useEffect(() => {
    messageColumnRef.current.scrollTop =
    messageColumnRef.current.scrollHeight;
  }, [messagesReceived]);
function TimeStamp(timestamp){
    const date = new Date(timestamp);
    return date.toLocaleString();
}
  return (
    <div className={styles.messagesColumn} ref={messageColumnRef}>
      {messagesReceived.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {TimeStamp(msg.__createdtime__ )}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  )
}

export default Messages
