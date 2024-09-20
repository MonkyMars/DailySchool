// pages/overview.jsx

import { useEffect, useState } from "react";
import Nav from "/components/Nav";
import styles from "/styles/Overview.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useSession, signIn } from "next-auth/react";

export default function Overview() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      signIn(); // Redirect to sign-in if not authenticated
    } else {
      setUser(session.user.email)
    }
  }, [status]);

  const tools = [
    {
      title: "Planner",
      href: "/school/planner",
      icon: "/planner.png",
      description: "A simple calendar-based planner",
      color: "#72ad42",
    },
    {
      title: "Homework",
      href: "/school/homework",
      icon: "/homework.png",
      description: "Keep track of your homework",
      color: "#b5505b",
    },
    {
      title: "Notes",
      href: "/school/notes",
      icon: "/notes.png",
      description: "Create notes during class",
      color: "#5980c2",
    },
  ];

  return (
    <>
      <Nav />
      <header className={styles.header}>
        <h1>DailySchool</h1>
        <p>Welcome {user}</p>
      </header>
      <main className={styles.Main}>
        {tools.map((tool, index) => (
          <ToolCard
            title={tool.title}
            href={tool.href}
            icon={tool.icon}
            description={tool.description}
            key={index}
            color={tool.color}
          />
        ))}
      </main>
    </>
  );
}

const ToolCard = ({ title, href, icon, description, color }) => {
  return (
    <section
      onClick={() => (window.location.href = href)}
      className={styles.ToolCard}
      style={{ backgroundColor: color }}
    >
      <header>
        <Image src={icon} alt={title} width={50} height={50} />
        <h2>{title}</h2>
      </header>
      <main>
        <p>{description}</p>
      </main>
    </section>
  );
};
