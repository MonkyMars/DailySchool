import styles from "/styles/Planner.module.css";
import React, { useEffect, useState } from "react";
import Nav from "/components/Nav";
import { getWeek } from "/components/components.jsx";
import Image from 'next/image'

export default function Planner() {
  const [currentMonth] = useState(new Date().getMonth());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [currentWeek] = useState(getWeek(new Date()));
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [currentDay] = useState(new Date().getDay());
  const [selectedDay] = useState(currentDay);
  const [sortType, setSortType] = useState("Month");
  const [plannerAddVisible, setPlannerAddVisible] = useState(false);
  const [plannerViewVisible, setPlannerViewVisible] = useState(false);
  const [viewingPlannerIndex, setViewingPlannerIndex] = useState(null);
  const [planner, setPlanner] = useState({
    title: "",
    description: "",
    date: new Date().toLocaleDateString("en-CA"),
    time: new Date().toLocaleTimeString().slice(0, 5),
  });
  const [existingPlanners, setExistingPlanners] = useState([]);

  // Fetch planners on component mount
  useEffect(() => {
    fetchPlanner();
  }, []);

  // Fetch planner data from server
  const fetchPlanner = async () => {
    try {
      const user = localStorage.getItem("user");
      const response = await fetch("/api/fetchPlanner", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          user: user,
        },
      });
      if (!response.ok) {
        console.error("Failed to fetch planner");
      }
      const data = await response.json();
      const planners = data.message.rows.map((planner) => ({
        ...planner,
        date: new Date(planner.date).toLocaleDateString("en-CA"),
      }));
      setExistingPlanners(planners);
    } catch (error) {
      console.error(error);
    }
  };

  // Submit new planner
  const handleSubmitPlanner = async (e) => {
    e.preventDefault();
    await createPlanner();
    setExistingPlanners((prevPlanners) => [...prevPlanners, planner]);
    setPlanner({
      title: "",
      description: "",
      date: new Date().toLocaleDateString("en-CA"),
      time: new Date().toLocaleTimeString().slice(0, 5),
    });
    setPlannerAddVisible(false);
  };

  const createPlanner = async () => {
    try {
      const user = localStorage.getItem("user");
      const response = await fetch("/api/addPlanner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user: user,
        },
        body: JSON.stringify(planner),
      });
      if (!response.ok) {
        window.alert("Failed to add planner");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Functions for navigating months and weeks
  const decrementSelectedMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const incrementSelectedMonth = () => {
    setSelectedMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  const decrementSelectedWeek = () => {
    setSelectedWeek((prevWeek) => (prevWeek === 1 ? 52 : prevWeek - 1));
  };

  const incrementSelectedWeek = () => {
    setSelectedWeek((prevWeek) => (prevWeek === 52 ? 1 : prevWeek + 1));
  };

  // Static data for weeks and months
  const Week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const Months = [
    { name: "January", days: 31 },
    { name: "February", days: 28 },
    { name: "March", days: 31 },
    { name: "April", days: 30 },
    { name: "May", days: 31 },
    { name: "June", days: 30 },
    { name: "July", days: 31 },
    { name: "August", days: 31 },
    { name: "September", days: 30 },
    { name: "October", days: 31 },
    { name: "November", days: 30 },
    { name: "December", days: 31 },
  ];

  return (
    <>
      <Nav />
      <main className={styles.Main}>
        <div className={styles.MonthSlider}>
          <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
            <option value="Month">Month</option>
            <option value="Week">Week</option>
            <option value="Day">Day</option>
          </select>
          {sortType === "Month" && (
            <>
              <button onClick={decrementSelectedMonth}>&larr;</button>
              <label>{Months[selectedMonth].name}</label>
              {selectedMonth !== currentMonth && (
                <label
                  className={styles.setCurrent}
                  onClick={() => setSelectedMonth(currentMonth)}
                >
                  current month
                </label>
              )}
              <button onClick={incrementSelectedMonth}>&rarr;</button>
            </>
          )}
          {sortType === "Week" && (
            <>
              <button onClick={decrementSelectedWeek}>&larr;</button>
              <label>Week {selectedWeek}</label>
              {selectedWeek !== currentWeek && (
                <label
                  className={styles.setCurrent}
                  onClick={() => setSelectedWeek(currentWeek)}
                >
                  current week
                </label>
              )}
              <button onClick={incrementSelectedWeek}>&rarr;</button>
            </>
          )}
          <button onClick={() => setPlannerAddVisible(!plannerAddVisible)}>
            Add
          </button>
        </div>
        <div className={styles.Month}>
          {sortType === "Month" &&
            Array.from({ length: Months[selectedMonth].days }, (_, index) => {
              const day = index + 1; // Current day of the month
              return (
                <div key={index} className={styles.Day}>
                  <label>{day}</label>
                  {existingPlanners.map((existingPlanner, plannerIndex) => {
                    const plannerDay = parseInt(
                      existingPlanner.date.slice(8, 10),
                      10
                    ); // Extract and parse the day from the date
                    return (
                      plannerDay === day && (
                        <React.Fragment key={plannerIndex}>
                          <span
                            className={styles.SpanPlan}
                            onClick={() =>
                              setViewingPlannerIndex(
                                viewingPlannerIndex === plannerIndex
                                  ? null
                                  : plannerIndex
                              )
                            }
                          >
                            {existingPlanner.title} - {existingPlanner.time.slice(0, 5)}
                          </span>
                          {viewingPlannerIndex === plannerIndex && (
                            <div className={styles.plannerView}>
                              <h2>{existingPlanner.title}</h2>
                              <label>
                                {existingPlanner.date.slice(0, 10)} -{" "}
                                {existingPlanner.time.slice(0, 5)}
                              </label>
                              <p>{existingPlanner.description}</p>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    );
                  })}
                </div>
              );
            })}
          {sortType === "Week" &&
            Week.map((week, index) => (
              <div key={index} className={styles.WeekDay}>
                <label>{week}</label>
              </div>
            ))}
          {sortType === "Day" && <label>{Week[currentDay]}</label>}
        </div>
      </main>
      {plannerAddVisible && (
        <form className={styles.plannerAdd} onSubmit={handleSubmitPlanner}>
          <h2>Add plan</h2>
          <label>Title</label>
          <input
            type="text"
            value={planner.title}
            onChange={(e) =>
              setPlanner((prevPlanner) => ({
                ...prevPlanner,
                title: e.target.value,
              }))
            }
          />
          <div>
            <label>When</label>
            <input
              type="date"
              value={planner.date}
              onChange={(e) =>
                setPlanner((prevPlanner) => ({
                  ...prevPlanner,
                  date: e.target.value,
                }))
              }
            />
            <input
              type="time"
              value={planner.time}
              onChange={(e) =>
                setPlanner((prevPlanner) => ({
                  ...prevPlanner,
                  time: e.target.value,
                }))
              }
            />
          </div>
          <label>Description</label>
          <textarea
            type="text"
            value={planner.description}
            onChange={(e) =>
              setPlanner((prevPlanner) => ({
                ...prevPlanner,
                description: e.target.value,
              }))
            }
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </>
  );
}
