import styles from '../styles/chatarea.module.css'

export default () => {
  return (
    <div className={styles.chatArea}>
      <div className={styles.emptychat}>
        <h1>Empty chat, let's ask some questions!</h1>
      </div>
    </div>
  )
}

