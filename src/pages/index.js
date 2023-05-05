import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../styles/general.module.css'
import Sidebar from '../components/sidebar'
import Chatarea from '../components/chatarea'
import Typebox from '../components/typebox'
import Loading from '../components/loading'
import Welcome from '../components/welcome'
import { useQuery } from 'react-query'
import { getAllRooms } from '../../lib/request'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [ roomid, setRoomid ] = useState(null)
  const { isLoading, isError, data, error} = useQuery("rooms", getAllRooms)

  if (isLoading) return <Loading></Loading>
  if (isError) return <div>Error: {error.message}</div>
  if (!data) return <div>Not found</div>

  function onRoomClick (roomid) {
    data.filter(room => {
      if(room._id === roomid) {
        setRoomid(roomid)
      }
    })
  }
 
  return (
    <>
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Image src='/Profiles.png' alt="profiles" width={85} height={35}/>
          </div>
          <div className= {styles.groupTitle}>
            <div className = {styles.title}>TUBES 3 STIMA</div>
            <div className = {styles.members}>You, Shelma, Febryan, Rifko</div>
          </div>
        </div>
        {
          data && <Sidebar getRooms = {data} handler = {onRoomClick}></Sidebar>
        }

        {
          roomid ? <Chatarea roomid = {roomid}></Chatarea> : <Welcome></Welcome>
        }
        {
          roomid && <Typebox roomid = {roomid}></Typebox>
        }
      </div>
    </>
  )
}
