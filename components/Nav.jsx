import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Nav.module.css';
import Link from 'next/link';
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export default function Nav() {
  return (
    <>
    <NavDesktop/>
    </>
  );
}

const NavDesktop = () => {
  const router = useRouter();
  const [session, setSession] = useState();
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        } else {
          console.error("Failed to fetch session");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);
  
  const pages = [
    {title: 'planner', href: '/school/planner'},
    {title: 'homework', href: '/school/homework'},
    {title: 'notes', href: '/school/notes'},
    {title: 'settings', href: '/user/settings'}
  ];
  
  return (
    <nav className={styles.Nav}>
      <Link href='/overview'><h1>SchoolTool</h1></Link>
      <div>
      {pages.map((page, index) => (
        <button className={styles.button} key={index} onClick={() => window.location.href = page.href}>{page.title}</button>
      ))}
      </div>
      {!session && <button className={styles.button} onClick={() => window.location.href = '/user/login'}>Log in</button>}
    </nav>
  );
}