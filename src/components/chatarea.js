import styles from '../styles/chatarea.module.css'
import Userchat from './userchat'
import Botchat from './botchat'
import Emptychat from './emptychat'
import { useQuery } from 'react-query'
import { getMessages } from '../../lib/request'

export default function Chatarea({ roomid }) {

  const {isLoading, isError, data: messages, error} = useQuery(["messages", roomid], () => getMessages(roomid));

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>
  if (messages.length === 0) return <Emptychat></Emptychat>

  return (
    <div className={styles.chatArea}>
      {
        messages && messages.map((message, index) => {
          return (
            <div key = {index}>
              <Userchat m={message.question}></Userchat>
              <Botchat m={message.answer}></Botchat>
            </div>
          )
        })
      }
    </div>

  )
}