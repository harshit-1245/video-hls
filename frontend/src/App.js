import React, { useRef, useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"

import "./App.css";
import Homepage from "./components/Homepage/Homepage";
import Header from "./components/Header/Header";
import Body from "./components/Body/Body";
import Footer from "./components/footer/Footer";

function App() {

  const router = createBrowserRouter(
     createRoutesFromElements(
      <Route path="/" element={<Homepage/>}>
          
      </Route>
     )
  )
 

  return (
    <>
    <Header/>
   <RouterProvider router={router}/>
   <Body/>
   <Footer/>
    </>
  );
}

export default App;
