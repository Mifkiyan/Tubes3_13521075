import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import styles from '../styles/chat.module.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [inputValue, setInputValue] = useState('')
    const [chatLog, setChatLog] = useState([])
    
    const handleSubmit = (event) => {
      event.preventDefault()
      if (inputValue === '') return
      setChatLog((prevChatLog) => [...prevChatLog, inputValue])
      setInputValue('')
    }
  return (
    <>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Image src='/Profiles.png' width={85} height={35}/>
          </div>
          <div className= {styles.groupTitle}>
            <div className = {styles.title}>
              <p>TUBES 3 STIMA</p>
            </div>
            <div className = {styles.members}>
              <p>Shelma, Febryan, Rifko</p>
            </div>
          </div>
        </div>
        <div className={styles.sidebar} >
          <div className={styles.newchat}>
            <button className={styles.newbtn}>NEW CHAT</button>
          </div>
          <div className={styles.containerhistory}></div>
          <div className={styles.lowerside}>
            <div>
              <p className={styles.choosetxt}>Choose Algorithm !</p>
            </div>
            <div className={styles.option}>
              <input type="radio" value="KMP" id="kmp"/>
              <label for="kmp">KMP</label>
            </div>
            <div className={styles.option}>
              <input type="radio" value="BM" id="bm"/>
              <label for="bm">BM</label>
            </div>
          </div>
        </div>
        <div className={styles.chatArea}>
          {
            chatLog.map((message, index) => (
              <div className={styles.chatUser}key = {index} >
                <p className={styles.chatUserContent}>{message}</p>
              </div>
            ))
          }
        </div>
        <form className={styles.chatbox}>
          <input  className={styles.inputchat} type="text" placeholder="TYPE A MESSAGE..." value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
          <button className={styles.sendbtn} type="submit" onClick={handleSubmit}>SEND</button>
        </form>

      </div>
      

      
    </>
  )
}
