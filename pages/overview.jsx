import Nav from '/components/Nav';
import styles from '/styles/Overview.module.css';
import Image from 'next/image';
export default function Overview() {

const tools = [
  {title: 'Planner', href: '/school/planner', icon: '/planner.png', desciption: 'A simple calendar based planner', color: '#72ad42'},
  {title: 'Homework', href: '/school/homework', icon: '/homework.png', desciption: 'Keep track of your homework', color: '#b5505b'},
  {title: 'Notes', href: '/school/notes', icon: '/notes.png', desciption: 'Create notes during class', color: '#5980c2'},
]

return(
  <>
  <Nav/>
    <header className={styles.header}>
      <h1>DailySchool</h1>
      <p>Welcome</p>
    </header>
    <main className={styles.Main}>
      {tools.map((tool, index) => {
        return(
          <ToolCard title={tool.title} href={tool.href} icon={tool.icon} description={tool.desciption} key={index} color={tool.color}/>
        )
      })}
    </main>
        </>
    )
}

const ToolCard = ({title, href, icon, description, color}) => {
  return(
    <section onClick={() => window.location.href = href} className={styles.ToolCard} style={{backgroundColor:color}}>
      <header>
        <Image src={icon} alt={title} width={50} height={50}/>
        <h2>{title}</h2>
      </header>
      <main>
        <p>{description}</p>
      </main>
    </section>
  )
}