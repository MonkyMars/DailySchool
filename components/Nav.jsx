import React from 'react';
import styles from '../styles/components/Nav.module.css';
import { useMediaQuery } from 'react-responsive'

export default function Nav() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  });
    return(
      <>
        {isDesktopOrLaptop ? <NavDesktop/> : <NavPhone/>}
      </>
    )
}

export const NavDesktop = () => {
    return(
      <>
        <nav className={styles.Nav}>
          <h1>DailySchool</h1>
        </nav>
      </>
    )
}

export const NavPhone = () => {
    return(
      <>
      <nav className={styles.Nav}>
        <h1>DailySchool</h1>
      </nav>
      </>
    )
}