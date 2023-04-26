import { useState } from 'react'
import { BiSend } from 'react-icons/bi'
import { useMutation, useQueryClient } from 'react-query'
import { sendMessage } from '../../lib/request'
import styles from '../styles/typebox.module.css'

export default ({ roomid }) => { 

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
    mutation.mutate({roomid, message: search})
    setSearch('')
  }

  if (mutation.isLoading) return <div>Loading...</div>

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
