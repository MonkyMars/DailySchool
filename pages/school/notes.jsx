import { useEffect, useState } from "react";
import Nav from "/components/Nav";
import styles from "/styles/Notes.module.css";
import Image from "next/image";

const Notes = () => {
  const [note, setNote] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Format date as YYYY-MM-DD
    time: new Date().toLocaleTimeString().slice(0, 5),
  });
  const [existingNotes, setExistingNotes] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [contextMenu, setContextMenu] = useState(null); // Use object to manage context menu for specific note
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmitEditNote = async () => {
    if (note.title && note.description) {
      await createNote();
      setEditing(false);
      setExistingNotes((prevNotes) => [
        ...prevNotes,
        {
          title: note.title,
          description: note.description,
          date: note.date,
          time: note.time,
        },
      ]);
      setNote({
        title: "",
        description: "",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString().slice(0, 5),
      });
    } else {
      const button = document.querySelector(".Submit-button");
      if (button) button.style.backgroundColor = "rgb(255, 20, 20)";
    }
  };

  const insertNote = () => {
    setEditing(true);
  };

  const createNote = async () => {
    if (note.title && note.description) {
      try {
        const user = localStorage.getItem("user");
        const response = await fetch("/api/addNote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            user: user,
          },
          body: JSON.stringify(note),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("notes", JSON.stringify(data));
        } else {
          setError("Failed to add note. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while creating the note.");
      }
    }
  };

  const fetchNotes = async () => {
    const user = localStorage.getItem("user");
    const response = await fetch("/api/fetchNotes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        user: user,
      },
    });
    if (!response.ok) {
      throw new Error("HTTP error!");
    }
    const data = await response.json();
    const arrayNotes = data.message.rows;
    setExistingNotes(
      arrayNotes.map((arrayNote) => ({
        title: arrayNote.title,
        description: arrayNote.description,
        date: arrayNote.date,
        time: arrayNote.time,
        id: arrayNote.id,
      }))
    );
  };

  const handleDelete = async (id) => {
    const section = 0;
    try {
      const response = await fetch("/api/deleteMixed", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, id }),
      });
      if (response.ok) {
        setExistingNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== id)
        );
        setContextMenu(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete:", errorData.error || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
    setContextMenu(id);
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
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
            onChange={(e) =>
              setNote((prevNote) => ({ ...prevNote, title: e.target.value }))
            }
          />
          {note.title && (
            <button onClick={insertNote}>
              <Image src="/send.png" width={30} height={30} alt="Send" />
            </button>
          )}
        </div>
        <div className={styles.noteContainer}>
          {editing && (
            <EditNote
              note={note}
              setNote={setNote}
              handleSubmitEditNote={handleSubmitEditNote}
            />
          )}
          {existingNotes.map((existingNote) => (
            <Note
              key={existingNote.id}
              title={existingNote.title}
              description={existingNote.description}
              date={existingNote.date}
              time={existingNote.time}
              id={existingNote.id}
              handleDelete={handleDelete}
              handleContextMenu={handleContextMenu}
              handleContextMenuClose={handleContextMenuClose}
              contextMenu={contextMenu}
              contextMenuPosition={contextMenuPosition}
            />
          ))}
        </div>
        {contextMenu !== null && (
          <div
            className={styles.contextMenu}
            style={{
              top: `${contextMenuPosition.top}px`,
              left: `${contextMenuPosition.left}px`,
            }}
          >
            <label onClick={() => handleEdit(contextMenu)}>Edit</label>
            <label onClick={() => handleDelete(contextMenu)}>Delete</label>
            <label onClick={handleContextMenuClose}>Close</label>
          </div>
        )}
      </main>
    </>
  );
};

const Note = ({ title, description, time, date, id, handleContextMenu }) => (
  <div
    className={styles.Note}
    onContextMenu={(e) => handleContextMenu(e, id)}
    key={id}
  >
    <header>
      <h2>{title}</h2>
      <Image
        src={"/options.png"}
        alt="options"
        width={40}
        height={40}
        onClick={(e) => handleContextMenu(e, id)}
      />
    </header>
    <main>
      <p>{description}</p>
    </main>
    <footer>
      <label>
        {date.slice(0, 10)}, {time}
      </label>
    </footer>
  </div>
);

const EditNote = ({ note, setNote, handleSubmitEditNote }) => (
  <div className={styles.EditNote}>
    <header>
      <input
        value={note.title}
        onChange={(e) =>
          setNote((prevNote) => ({ ...prevNote, title: e.target.value }))
        }
        placeholder="Enter note title"
        maxLength={255}
      />
    </header>
    <main>
      <textarea
        value={note.description}
        onChange={(e) =>
          setNote((prevNote) => ({ ...prevNote, description: e.target.value }))
        }
        placeholder="Enter note description"
        maxLength={1000}
      />
    </main>
    <footer>
      <label>
        {note.date} - {note.time}
      </label>
      <button onClick={handleSubmitEditNote} className="Submit-button">
        Submit
      </button>
    </footer>
  </div>
);

export default Notes;
