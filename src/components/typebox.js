import { useState } from 'react'
import { BiSend } from 'react-icons/bi'
import { useMutation, useQueryClient } from 'react-query'
import { sendMessage } from '../../lib/request'
import { useSelector } from 'react-redux'
import styles from '../styles/typebox.module.css'

export default ({ roomid }) => { 
  const chosenOption = useSelector((state) => state.app.client.chosenOption);
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient();

  const mutation = useMutation((args) => {
    return sendMessage(args)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('messages')
    }
  })

  function onSubmit(event) {
    event.preventDefault()
    mutation.mutate({roomid, message: search, option: chosenOption})
    setSearch('')
  }

  if (mutation.isLoading) {
    return (
      <form className={styles.chatbox} onSubmit={onSubmit}>
        <input  className={styles.inputchat} type="text" placeholder="TYPE A MESSAGE..."/>
        <button className={styles.sendbtn} type="submit" ><BiSend/></button>
      </form>
    )
  }

  return (
    <form className={styles.chatbox} onSubmit={onSubmit}>
      <input  className={styles.inputchat} type="text" placeholder="TYPE A MESSAGE..." 
        value = {search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className={styles.sendbtn} type="submit" ><BiSend/></button>
    </form>
  )
}
