import React from "react";
import styles from '/styles/Home.module.css';
import Image from 'next/image'; 

export default function NewsArticles() {
    const News = [
        {id: 1, title: 'Official Beta Launch!', description: 'After a few month of development, the beta version of SchoolTool has finally gone live.', date: '2024-10-1', img: '/Logo/SchoolTool-Logo.png', url: ''},
        {id: 2, title: 'New Features!', description: 'A features have been implemented in SchoolTool,the navigation system has had a overhaul, navigating has never been so easy', date: '2024-09-17', img: '/News/NavigatorsRefresh.png', url: ''},
        {id: 3, title: 'Join the community!', description: 'The discord community is a place where you can ask questions, answer others.', date: '2024-09-17', img: '/News/discord.png', url: 'https://discord.gg/vN66sNbSSC'}
    ];
  
    return (
        <>
            {News.map((newsItem) => (
                <NewsArticle key={newsItem.id} {...newsItem} />
            ))}
        </>
    );
}

const NewsArticle = ({ title, description, date, img, url }) => {
    return (
        <section className={styles.NewsArticle}>
            <h2>{title}</h2>
            <p>{description}</p>
            <div>
                <Image priority src={img} alt="News" width={1000} height={1000} onClick={() => window.location.href = url}/>
            </div>
            <p>{date}</p>
        </section>
    );
};
