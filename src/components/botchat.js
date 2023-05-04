import styles from '../styles/chatarea.module.css'

export default function Botchat ({m}) {
  return (
    <div className={styles.chatBot} >
      <p className={styles.chatBotContent}>{m}</p>
    </div>
  )
}