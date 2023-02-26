import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
// import Home from './pages/Home';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"
import RouteContainer from './RouteContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    
    <BrowserRouter>
      {/*  <Routes>
      <Route path='/' element={<Home />} /> 
      {/* <Route path='/' element={<Login/>} /> */}
      {/* <Route path='/SignUp' element={<SignUp/>} /> 
           <Route path='/home' element={<Home />} /> 
          <Route path='/app' element={<App/>} />
      </Routes> */}

       <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored" />  
      <RouteContainer/>
    </BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
