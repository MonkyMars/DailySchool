import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Nav.module.css';
import Link from 'next/link';

export default function Nav() {
  return (
    <>
    <NavDesktop/>
    </>
  );
}

const NavDesktop = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user && JSON.parse(user))
  }, [])
  
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
      {!user && <button className={styles.button} onClick={() => window.location.href = '/user/login'}>Log in</button>}
    </nav>
  );
}