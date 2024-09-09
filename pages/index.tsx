import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <>
    <nav></nav>
      <header className={styles.header}>
        <h1>Daily School</h1>
        <p>A tool for keeping track of notes, homework and much more.</p>
      </header>
    </>
  );
};

export default Home;
