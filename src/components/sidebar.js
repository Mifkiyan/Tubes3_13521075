import styles from '../styles/sidebar.module.css'
import { BiTrash } from "react-icons/bi";
import { useMutation, useQueryClient } from 'react-query'
import { createRoom, deleteRoom } from '../../lib/request'
import { useState } from 'react'

var choosenOption = "KMP"

export default({ getRooms, handler }) => {
  const [selectedValue, setSelectedValue] = useState("KMP");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    choosenOption = event.target.value;
    console.log(choosenOption);
  };

  const queryClient = useQueryClient();
  const createMutate = useMutation(createRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms')
    }
  });

  const deleteMutate = useMutation(deleteRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries('rooms')
    }
  })


  return (
    <sidebar className={styles.sidebar} >
      <div className={styles.newbtnContainer}>
        <button className={styles.newbtn} onClick={() => {
          createMutate.mutate()
        }}>NEW CHAT</button>
      </div>

      <div className={styles.containerhistories}>
        {
          getRooms.map((chat, index) => {
            return (
              <div key={index} className={styles.containerHistory}>
                <button className={styles.history} onClick={() => handler(chat._id)}>
                  <span>
                    {chat.name || "no name"}
                  </span>
                </button>

                <button className={styles.deletebtn} onClick={() => {
                  deleteMutate.mutate(chat._id)
                }}>
                  <BiTrash className={styles.biTrash}/>
                </button>
              </div>
            )
          })
        }
      </div>

      <div className={styles.lowerside}>
        <div>
          <p className={styles.choosetxt}>Choose Algorithm !</p>
        </div>

        <div className={styles.option}>
          <input name="options" type="radio" value="KMP" id="kmp" checked = {selectedValue === "KMP"} onChange={handleChange}/>
          <label for="kmp">KMP</label>
        </div>

        <div className={styles.option}>
          <input name="options" type="radio" value="BM" id="bm" checked = {selectedValue === "BM"} onChange={handleChange}/>
          <label for="bm">BM</label>
        </div>
      </div>
    </sidebar>
  )
}