import React from 'react';
import logo from './logo.svg';
import Navbar from './components/Navbar/navbar';
import Weekview from './pages/WeekView/weekview';
import Detailview from './pages/DetailView/detailview';
import Form from './pages/HabitForm/habitForm';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
function App() {
  const [currentPage, setCurrentPage] = useState("Detail View");
  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <Navbar currentPage={currentPage} />,
      children: [
        { index:true, element: <Detailview setCurrentPage={setCurrentPage}/> },
        { path: "/week", element: <Weekview setCurrentPage={setCurrentPage}/> },
        { path: "/add", element: <Form setCurrentPage={setCurrentPage}/> },
      ]
    }
  ])
  return (
    <RouterProvider router={browserRouter}/>
    
  );
}

export default App;
