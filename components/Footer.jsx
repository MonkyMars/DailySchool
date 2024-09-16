import React, { useState, useEffect } from 'react';

export default function Footer() {
  return(
    <>
      <footer>
        <h1>SchoolTool</h1>
        <button>{'<'}</button>
        <ul>
          <li>Home</li>
          <li>Notes</li>
          <li>Planner</li>
          <li>Homework</li>
        </ul>
        <button>{'>'}</button>
      </footer>
    </>
  )
}
