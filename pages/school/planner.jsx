// pages/Planner.jsx
import styles from "/styles/Planner.module.css";
import React, { useEffect, useState } from "react";
import Nav from "/components/Nav";
import { getWeek } from "/components/components.jsx";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react"; // Import useSession and signIn

export default function Planner() {
  const { data: session, status } = useSession(); // Get session and status
  const [currentMonth] = useState(new Date().getMonth());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [currentWeek] = useState(getWeek(new Date()));
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);
  const [currentDay] = useState(new Date().getDay());
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [sortType, setSortType] = useState("Month");
  const [plannerAddVisible, setPlannerAddVisible] = useState(false);
  const [viewingPlannerIndex, setViewingPlannerIndex] = useState(null);
  const [planner, setPlanner] = useState({
    title: "",
    description: "",
    date: new Date().toLocaleDateString("en-CA"),
    time: new Date().toLocaleTimeString().slice(0, 5),
  });
  const [existingPlanners, setExistingPlanners] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Wait until session status is determined
    if (!session) signIn(); // Redirect to login if not authenticated
  }, [session, status]);

  // Fetch planners on component mount
  useEffect(() => {
    if (session) fetchPlanner();
  }, [session]);

  // Fetch planner data from server
  const fetchPlanner = async () => {
    try {
      const response = await fetch("/api/fetchPlanner", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user": JSON.stringify(session.user)
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch planner");
      }
      const data = await response.json();
      const planners = data.plannerItems.map((planner) => ({
        ...planner,
        date: new Date(planner.date).toLocaleDateString("en-CA"),
      }));
      setExistingPlanners(planners);
    } catch (error) {
      console.error("Fetch error:", error);
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
      const response = await fetch("/api/addPlanner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': JSON.stringify({ id: session.user.id }), // Use session user ID
        },
        body: JSON.stringify(planner),
      });
      if (!response.ok) {
        throw new Error("Failed to add planner");
      }
    } catch (error) {
      console.error("Error creating planner:", error);
    }
  };

  const handleDelete = async (id) => {
    const section = 2;
    console.log(id, section)
    try {
      const response = await fetch("/api/deleteMixed", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete");
      }
      setExistingPlanners((prevExistingPlanner) =>
        prevExistingPlanner.filter((planner) => planner.id !== id)
      );
      console.log("Deleted successfully");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleContextMenu = (e, plannerId) => {
    e.preventDefault(); // Prevent default context menu from appearing
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
    setContextMenu(plannerId);
    console.log(plannerId)
  };

  const handleEdit = () => {
    // Implement edit functionality
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
    <Head>
      <title>{'Schooltool | planner'}</title>
    </Head>
      <Nav />
      <main className={styles.Main}>
        <div className={styles.MonthSlider}>
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
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
                            onContextMenu={(e) =>
                              handleContextMenu(e, existingPlanner.id)
                            }
                          >
                            {existingPlanner.title} -{" "}
                            {existingPlanner.time.slice(0, 5)}
                          </span>
                          {viewingPlannerIndex === plannerIndex && (
                            <div className={styles.plannerView}>
                              <h2>{existingPlanner.title}</h2>
                              <label>
                                {existingPlanner.date.slice(0, 10)} -{" "}
                                {existingPlanner.time}
                              </label>
                              <label>{existingPlanner.description}</label>
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
            Week.map((dayName, index) => {
              return (
                <div key={index} className={styles.Day}>
                  <label>{dayName}</label>
                  {existingPlanners.map((existingPlanner, plannerIndex) => {
                    const plannerDay = new Date(existingPlanner.date).getDay();
                    return (
                      plannerDay === index && (
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
                            onContextMenu={() =>
                              handleContextMenu(existingPlanner.id)
                            }
                          >
                            {existingPlanner.title} -{" "}
                            {existingPlanner.time.slice(0, 5)}
                          </span>
                          {viewingPlannerIndex === plannerIndex && (
                            <div className={styles.plannerView}>
                              <h2>{existingPlanner.title}</h2>
                              <label>
                                {existingPlanner.date.slice(0, 10)} -{" "}
                                {existingPlanner.time}
                              </label>
                              <label>{existingPlanner.description}</label>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    );
                  })}
                </div>
              );
            })}
          {sortType === "Day" &&
            Week.map((dayName, index) => {
              return (
                <div key={index} className={styles.Day}>
                  <label>{dayName}</label>
                  {existingPlanners.map((existingPlanner, plannerIndex) => {
                    const plannerDay = new Date(existingPlanner.date).getDay();
                    return (
                      plannerDay === index && (
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
                            onContextMenu={(e) =>
                              handleContextMenu(existingPlanner.id)
                            }
                          >
                            {existingPlanner.title} -{" "}
                            {existingPlanner.time.slice(0, 5)}
                          </span>
                          {viewingPlannerIndex === plannerIndex && (
                            <div className={styles.plannerView}>
                              <h2>{existingPlanner.title}</h2>
                              <label>
                                {existingPlanner.date.slice(0, 10)} -{" "}
                                {existingPlanner.time}
                              </label>
                              <label>{existingPlanner.description}</label>
                            </div>
                          )}
                        </React.Fragment>
                      )
                    );
                  })}
                </div>
              );
            })}
        </div>
        {plannerAddVisible && (
          <div className={styles.PlannerForm}>
            <h2>Add New Planner Item</h2>
            <form onSubmit={handleSubmitPlanner}>
              <label>
                Title:
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
              </label>
              <label>
                Description:
                <textarea
                  value={planner.description}
                  onChange={(e) =>
                    setPlanner((prevPlanner) => ({
                      ...prevPlanner,
                      description: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Date:
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
              </label>
              <label>
                Time:
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
              </label>
              <button type="submit">Add Planner Item</button>
            </form>
          </div>
        )}
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
            <label onClick={() => setContextMenu(null)}>Close</label>
          </div>
        )}
      </main>
    </>
  );
}
