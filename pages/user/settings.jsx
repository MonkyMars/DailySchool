import styles from "/styles/Settings.module.css";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Nav from "/components/Nav";
import { useSession, signIn } from "next-auth/react";

const Settings = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState({
    email: "",
    password: "",
    school: "",
    grade: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = session.user.id;
    try {
      const { email, password, school, grade, id } = user;
      const response = await fetch("/api/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, school, grade, userId}),
      });

      if (!response.ok) {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("An error occurred while updating settings");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/user/login";
  };

  return (
    <>
      <Nav />
      <Head>
        <title>{'Schooltool | settings'}</title>
      </Head>
      <main className={styles.Main}>
        <section className={styles.Section}>
          <form onSubmit={handleSubmit}>
            <h2>Update information</h2>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={user.email}
              placeholder="Enter new email"
              onChange={handleInputChange}
              disabled
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={user.password}
              placeholder="Enter new password"
              onChange={handleInputChange}
              required
            />
            <label htmlFor="school">School</label>
            <input
              id="school"
              name="school"
              type="text"
              value={user.school}
              placeholder="Enter new school"
              onChange={handleInputChange}
              required
            />
            <label htmlFor="grade">Grade</label>
            <input
              id="grade"
              name="grade"
              type="text"
              value={user.grade}
              placeholder="Enter new grade"
              onChange={handleInputChange}
              required
            />
            <button type="submit">Save Changes</button>
          </form>
        </section>
        <section className={styles.Section}>
          {user ? (
            <div
              style={{ backgroundColor: "rgb(255, 20, 20)" }}
              onClick={logout}
            >
              <h2>Log out</h2>
            </div>
          ) : (
            <div onClick={() => (window.location.href = "/user/login")}>
              <h2>Log in</h2>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Settings;
