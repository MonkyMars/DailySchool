import { useEffect, useState } from 'react';
import Nav from '/components/Nav';
import styles from '/styles/Notes.module.css';
import Image from 'next/image';

const Notes = () => {
  const [note, setNote] = useState({
    title: '',
    description: '',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString().slice(0, 5),
  });
  const [existingNotes, setExistingNotes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [])

  const handleSubmitEditNote = async() => {
    if(note.title && note.description) {
      await createNote();
      setEditing(false);
      setExistingNotes([...existingNotes, { title: note.title, description: note.description, date: note.date, time: note.time }]);
      setNote({ title: '', description: '', date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString().slice(0, 5) });
    } else {
      const button = document.getElementsByClassName('Submit-button')[0];
      button.style.backgroundColor = 'rgb(255, 20, 20)';
    }
  };

  const insertNote = () => {
    setEditing(true);
  };

  const createNote = async() => {
    if(note.title && note.description) {
      try {
        const user = localStorage.getItem('user');
        const response = await fetch("/api/addNote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'user': user,
          },
          body: JSON.stringify(note),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("notes", JSON.stringify(data));
        } else {
          setError("Failed to add note. Please try again.");
        };
      } catch (err) {
        console.error(err);
        setError("An error occurred during creating note.");
      };
    }
  };

  const fetchNotes = async() => {
    const user = localStorage.getItem('user')
    const response = await fetch('/api/fetchNotes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'user': user,
      },
    })
    if (!response.ok) {
      throw new Error("HTTP error!");
    }
    const data = await response.json();
    const arrayNotes = data.message.rows;
    arrayNotes.map((arrayNote) => {
      setExistingNotes([{ title: arrayNote.title, description: arrayNote.description, date: arrayNote.date, time: arrayNote.time, id: arrayNote.id }]);
    })
  }

  const handleDelete = async (id) => {
    const section = 0; 
    try {
      console.log(id)
        const response = await fetch('/api/deleteMixed', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ section, id })
        });
        setExistingNotes(prevExistingNotes => 
          prevExistingNotes.filter(note => note.id !== id)
        );        
        if (response.ok) {
            console.log('Deleted successfully');
        } else {
            const errorData = await response.json();
            console.error('Failed to delete:', errorData.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    } 
};

  
  return (
    <>
      <Nav />
      <main className={styles.Main}>
        <div className={styles.Topbar}>
          <input
            type="text"
            placeholder="Enter note title"
            value={note.title}
            onChange={(e) => setNote(prevNote => ({ ...prevNote, title: e.target.value }))}
          />
          {note.title && (
            <button onClick={insertNote}>
              <Image src="/send.png" width={30} height={30} alt="Send" />
            </button>
          )}
        </div>
        <div className={styles.noteContainer}>
          {editing && <EditNote note={note} setNote={setNote} handleSubmitEditNote={handleSubmitEditNote} />}
          {existingNotes.map((existingNote, index) => (
            <Note
              key={index}
              title={existingNote.title}
              description={existingNote.description}
              date={existingNote.date}
              time={existingNote.time}
              id={existingNote.id}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </>
  );
};

const Note = ({ title, description, time, date, id, handleDelete }) => (
  <div className={styles.Note}>
    <header>
      <h2>{title}</h2>
      <Image src={'/options.png'} alt='options' width={40} height={40} onClick={() => handleDelete(id)}/>
    </header>
    <main>
      <p>{description}</p>
    </main>
    <footer>
      <label>{date.slice(0, 10)}, {time}</label>
    </footer>
  </div>
);

const EditNote = ({ note, setNote, handleSubmitEditNote }) => (
  <div className={styles.EditNote}>
    <header>
      <input
        value={note.title}
        onChange={(e) => setNote(prevNote => ({ ...prevNote, title: e.target.value }))}
        placeholder='Enter note title'
        maxLength={255}
      />
    </header>
    <main>
      <textarea
        value={note.description}
        onChange={(e) => setNote(prevNote => ({ ...prevNote, description: e.target.value }))}
        placeholder='Enter note description'
        maxLength={1000}
      />
    </main>
    <footer>
      <label>{note.date} - {note.time}</label>
      <button onClick={handleSubmitEditNote} className='Submit-button'>Submit</button>
    </footer>
  </div>
);

export default Notes;
