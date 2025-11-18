import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "../src/pages/Home"
import Blog_Listing_Page from './pages/Blog_Listing_Page'
import Blog_details from './pages/Blog_details'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/bloglisting' element={<Blog_Listing_Page />} />
          <Route path='/blogdetails' element={<Blog_details />} />
         
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App