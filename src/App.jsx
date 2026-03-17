import './App.css'
import Navbar from './navigation/navbar'
import { Outlet } from 'react-router-dom'

function App() {
  const navItems = [
    { id: 1, link: "#", title: "Help me debug my React app" },
    { id: 2, link: "#", title: "Explain async/await in JavaScript" },
    { id: 3, link: "#", title: "Write a Python sorting algorithm" },
    { id: 4, link: "#", title: "Design a REST API for e-commerce" },
    { id: 5, link: "#", title: "How to deploy on Vercel" },
    { id: 6, link: "#", title: "CSS Grid vs Flexbox comparison" },
    { id: 7, link: "#", title: "Create a Node.js Express server" },
    { id: 8, link: "#", title: "Database schema design tips" },
    { id: 9, link: "#", title: "Implement JWT authentication" },
    { id: 10, link: "#", title: "Docker container best practices" },
  ]

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden">
      
      <Navbar navItems={navItems} />

      <main className="flex-1 flex flex-col bg-white rounded-tl-2xl rounded-2xl overflow-hidden m-5">
        
        <div className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </div>

      </main>

    </div>
  )
}

export default App