import styles from '/styles/Planner.module.css';
import React, { use, useEffect, useState } from 'react';
import Nav from '/components/Nav';
import { useMediaQuery } from 'react-responsive'

export default function Planner() {
  const isPhone = useMediaQuery({
    query: '(max-width: 768px)'
  });
  const [currentMonth] = useState(new Date().getMonth());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [currentWeek] = useState(getWeek(new Date()));
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [currentDay] = useState(new Date().getDay());
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [sortType, setSortType] = useState(isPhone ? 'Day' : 'Month');

  const decrementSelectedMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const incrementSelectedMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };
  
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
  const Months = [
    { name: 'January', days: 31 },
    { name: 'February', days: 28 },
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 },
  ];

  return (
    <>
    <Nav/>
      <header className={styles.header}>
        <h1>{'Planner'}</h1>
      </header>
      <main className={styles.Main}>
        <div className={styles.MonthSlider}>
          <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
            <option value={'Month'}>{'Month'}</option>
            <option value={'Week'}>{'Week'}</option>
            {isPhone && <option value={'Day'}>{'Day'}</option>}
          </select>
          {sortType === 'Month' && <>
            <button onClick={decrementSelectedMonth}>&larr;</button>
            <label>{Months[selectedMonth].name}</label>
            {selectedMonth !== currentMonth && <label className={styles.setCurrent} onClick={() => setSelectedMonth(currentMonth)}>current month</label>}
            <button onClick={incrementSelectedMonth}>&rarr;</button>
          </>}
          {sortType === 'Week' && <>
            <button onClick={decrementSelectedWeek}>&larr;</button>
            <label>Week {selectedWeek}</label>
            {selectedWeek !== currentWeek && <label className={styles.setCurrent} onClick={() => setSelectedWeek(currentWeek)}>current week</label>}
            <button onClick={incrementSelectedWeek}>&rarr;</button>
          </>}
        </div>
        <div className={styles.Month}>
          {sortType === 'Month' && Array.from({ length: Months[selectedMonth].days }, (_, index) => (
            <div key={index} className={styles.Day}>
              <label>{index + 1}</label>
            </div>
          ))}
          {sortType === 'Week' && Week.map((week, index) => {
            return(
              <>
                <div key={index} className={styles.WeekDay}>
                  <label>{week}</label>
                </div>
              </>
            )
          })}
          {sortType === 'Day' && <>
            <label>{Week[currentDay]}</label>
          </>}
        </div>
      </main>
    </>
  );
}


function getWeek(date) {
  const currentDate = new Date(date.getTime());
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (currentDate - startOfYear) / (24 * 60 * 60 * 1000)
  );

  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);

  return weekNumber;
}