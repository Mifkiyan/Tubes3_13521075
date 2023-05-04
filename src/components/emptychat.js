import styles from '../styles/chatarea.module.css'

export default function Emptychat()  {
  return (
    <div className={styles.chatArea}>
      <div className={styles.emptychat}>
        <div className={styles.invited}>
          <div className={styles.invtxt}>You have been invited to the group</div>
        </div>
      </div>
    </div>
  )
}

