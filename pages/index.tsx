import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import NewsArticles from "../components/News.jsx";
const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SchoolTool | Home</title>
      </Head>
      <nav className={styles.Nav}>
        <h2>SchoolTool</h2>
        <button onClick={() => (window.location.href = "/user/login")}>
          Log in
        </button>
      </nav>
      <header className={styles.header}>
        <h1>SchoolTool</h1>
        <p>A tool for keeping track of notes, homework and much more.</p>
      </header>

      <main className={styles.Main}>
        <NewsArticles />
      </main>
    </>
  );
};

export default Home;
