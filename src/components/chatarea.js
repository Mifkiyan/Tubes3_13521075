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



// export default () => {
//   const [inputValue, setInputValue] = useState('')
//   const [chatLog, setChatLog] = useState([])
  
//   const handleSubmit = (event) => {
//     event.preventDefault()
//     if (inputValue === '') return
//     setChatLog((prevChatLog) => [...prevChatLog, inputValue])
//     setInputValue('')
//   }

//   <div className={styles.chatArea}>
//     {
//       chatLog.map((message, index) => (
//         <div className={styles.chatUser}key = {index} >
//           <p className={styles.chatUserContent}>{message}</p>
//         </div>
//       ))
//     }
//   </div>
// }