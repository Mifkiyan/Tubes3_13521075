import styles from '../styles/chatarea.module.css'

export default () => {
  return (
    <div className={styles.chatArea}>
      <div className={styles.welcome}>
        <p>Ask Anything, Anytime!</p>
        <p className={styles.paragraph}>Let's create a new chat.</p>
      </div>
    </div>
  )
}

