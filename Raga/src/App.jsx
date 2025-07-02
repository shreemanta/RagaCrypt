import React from "react"
import { Routes, Route } from 'react-router-dom';
import Navbar from "./Components/Navbar"
import Home from "./Pages/Home"
import About from "./Pages/About"
import Contact from "./Pages/Contact"
import History from "./Pages/History"
import Footer from "./Components/Footer"


function App() {

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/about" element={<About />}/>
      <Route path="/contact" element={<Contact />}/>
      <Route path="/history" element={<History />}/>
    </Routes>
    <Footer/>

    </>
  )
}

export default App
