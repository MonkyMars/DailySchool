import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Nav.module.css';
import Link from 'next/link';
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import Image from 'next/image';
import { handleClientScriptLoad } from 'next/script';
export default function Nav() {
  return (
    <>
    <NavDesktop/>
    </>
  );
}

const NavDesktop = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false)
  const { data: session, status } = useSession();
  
  useEffect(() => {
    setLoaded(true)
  }, [status]);
  
  const pages = [
    {title: 'planner', href: '/school/planner'},
    {title: 'homework', href: '/school/homework'},
    {title: 'notes', href: '/school/notes'},
  ];
  
  const setLocationSettings = () => {
    window.location.href = '/user/settings'
  }

  return (
    <nav className={styles.Nav}>
      <Link href='/overview'><h1>SchoolTool</h1></Link>
      <div>
      {pages.map((page, index) => (
        <button className={styles.button} key={index} onClick={() => window.location.href = page.href}>{page.title}</button>
      ))}
      </div>
      {!session && loaded && <button className={styles.button} onClick={() => window.location.href = '/user/login'}>Log in</button>}
      {session && <button className={styles.button} onClick={handleClientScriptLoad}><Image src={'/settings.png'} width={25} height={25} alt='settings' onClick={setLocationSettings}/></button>}
    </nav>
  );
}