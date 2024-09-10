import { useState } from 'react';
import Nav from '/components/Nav';
import styles from '/styles/Notes.module.css';
import Image from 'next/image';

const Notes = () => {
  const [note, setNote] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  })
  const [existingNotes, setExistingNotes] = useState([{id: 0, title: 'Note test'}])
  const insertNote = () => {

  }

    return(
      <>
        <Nav/>
        <main className={styles.Main}>
          <div className={styles.Topbar}>
            <input type='text' placeholder='Enter note title' value={note.title} onChange={(e) => setNote({title: e.target.value})}/>
            {note.title && <button onClick={insertNote}><Image src={'/send.png'} width={30} height={30}/></button>}
          </div>
          <div className={styles.noteContainer}>
            {existingNotes.map((note, index) => {
              return(
                <>
                <Note key={note.id || index} title={note.title}/>
                <EditNote setNote={setNote} title={note.title} description={note.description} date={note.date} time={note.time}/>
                </>
              )
            })}
          </div>
        </main>
      </>
    )
}

export default Notes;

const Note = ({title, description, time, date}) => {
  return(
    <div className={styles.Note}>
      <header>
        <h2>{title}</h2>
      </header>
      <main>
        <p>{description}</p>
      </main>
      <footer>
        <label>{date}, {time}</label>
      </footer>
    </div>
  )
}

const EditNote = ({title, description, time, date, note, setNote}) => {
  return(
    <>
    <div className={styles.Note}>
      <header>
        <input value={title} onChange={(e) => setNote({title: e.target.value})}/>
      </header>
      <main>
        <textarea value={description} onChange={(e) => setNote({description: e.target.value})}/>
      </main>
      <footer>
        <label>{date}, {time}</label>
      </footer>
    </div>
    </>
  )
}