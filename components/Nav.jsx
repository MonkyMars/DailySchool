import React, { useState, useEffect } from 'react';
import styles from '../styles/components/Nav.module.css';
import { useMediaQuery } from 'react-responsive';
import Image from 'next/image';

export default function Nav({page}) {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/user/login'
  }

  return (
    <>
      {isDesktopOrLaptop ? <NavDesktop /> : <NavPhone />}
      {user && <ProfileCard username={user.email} />}
      {user && <><Logout logout={logout}/><Settings/></>}
      {!user && page !== 'login' && <Login/>}
    </>
  );
}

const NavDesktop = () => {
  return (
    <nav className={styles.Nav}>
      <h1>DailySchool</h1>
    </nav>
  );
}

const NavPhone = () => {
  return (
    <nav className={styles.Nav}>
      <h1>DailySchool</h1>
    </nav>
  );
}

const ProfileCard = ({ username }) => {
  return (
    <div className={styles.ProfileCard}>
      <Image src='/user.png' alt='' width={50} height={50} />
      <label>{username}</label>
    </div>
  );
}


const Logout = ({logout}) => {
  return (
    <>
      <div className={styles.Logout} onClick={logout}>
      <Image src={'/logout.png'} alt='logout' width={50} height={50}/>
    </div>
    </>
  )
}

const Settings = () => {
  return (
    <>
      <div className={styles.Settings} onClick={() => window.location.href = '/user/settings'}>
        <Image src={'/settings.png'} alt='settings' width={50} height={50}/>
    </div>
    </>
  )
}

const Login = () => {
  return (
    <>
      <div className={styles.Logout} onClick={() => window.location.href = '/user/login'}>
      <Image src={'/login.png'} alt='logout' width={50} height={50}/>
    </div>
    </>
  )
}