import styles from '../styles/general.module.css';
import Image from 'next/image'

export default function Loading()  {
  return (
    <div className={styles.loadingPage}>
      <h1 className={styles.loading}>Loading</h1>
      <Image
        src="/loading.gif"
        alt="Your alternative text"
        width={70}
        height={70}
      />
      <p className={styles.textloading}>Sit Tight: We&apos;re Getting Things Ready for You</p>
      
    </div>
  )
}