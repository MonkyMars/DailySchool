import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <>
    <nav className={styles.Nav}>
      <h2>SchoolTool</h2>
      <button onClick={() => window.location.href = '/user/login'}>Log in</button>
    </nav>
      <header className={styles.header}>
        <h1>SchoolTool</h1>
        <p>A tool for keeping track of notes, homework and much more.</p>
      </header>
    </>
  );
};

export default Home;
