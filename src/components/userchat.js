import styles from '../styles/chatarea.module.css'

export default function Userchat({ m })  {
  return (
    <div className={styles.chatUser} >
      <p className={styles.chatUserContent}>{m}</p>
    </div>
  )
}
