import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Nav.module.css';
import Link from 'next/link';

export default function Nav({page}) {
  return (
    <>
    <NavDesktop/>
    </>
  );
}

const NavDesktop = () => {
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
    </nav>
  );
}