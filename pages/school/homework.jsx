import React, { useState, useEffect } from "react";
import Nav from '/components/Nav';
import { getWeek } from "../../components/components.jsx";
import styles from '/styles/Homework.module.css'
const Homework = () => {
  const [currentWeek] = useState(getWeek(new Date()));
  const [currentYear] = useState(new Date().getFullYear());
  const [currentMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [currentDay] = useState(new Date().getDay() + 1);
  const [currentHomeWork] = useState([{title: 'hai', deadline: 'monday%37%2024'}, {assignedTo: 'monky', title: 'kut huiswerk', deadline: 'monday%37%2024', status: 0,
  }]);
  const decrementSelectedWeek = () => {
    setSelectedWeek((prevWeek) => (prevWeek === 1 ? 52 : prevWeek - 1));
  }

  const incrementSelectedWeek = () => {
    setSelectedWeek((prevWeek) => (prevWeek === 52 ? 1 : prevWeek + 1));
  }

  const Week = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ]

  return(
    <>
    <Nav/>
    <main className={styles.Main}>
    <div className={styles.Slider}>
      <button onClick={decrementSelectedWeek}>&larr;</button>
      <label>{selectedWeek}</label>
      {selectedWeek !== currentWeek && <label className={styles.setCurrent} onClick={() => setSelectedWeek(currentWeek)}>current week</label>}
      <button onClick={incrementSelectedWeek}>&rarr;</button>
    </div>
    <div className={styles.homework}>
    {Week.map((week, index) => {
      return(
        <div key={index} className={styles.homeworkItem}>
          <label>{week}</label>
          <div>
            {currentHomeWork.map((homework, index) => {
              const deadLine = homework.deadline;
              const [ homeworkDay, homeworkWeek, homeworkYear] = deadLine.split('%');
              return(
                  <div key={homework.title || index}>
                    {week.toLowerCase() === homeworkDay && selectedWeek == homeworkWeek &&
                      <>
                        <div>
                          <span>{homework.title}</span>
                          <input type="checkbox"></input>
                        </div>
                      </>
                    }
                  </div>
              )
            })}
          </div>
        </div>
      )
    })}
    </div>
    </main>
    </>
  )
}

export default Homework;