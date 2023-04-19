import styles from '../styles/chatarea.module.css'

export default ({m}) => {
  return (
    <div className={styles.chatBot} >
      <p className={styles.chatBotContent}>{m}</p>
    </div>
  )
}