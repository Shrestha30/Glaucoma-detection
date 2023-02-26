import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import App from './App'
import ClinicalDataBatch from './pages/ClinicalDataBatch';
import ClinicalDataPrediction from './pages/ClinicalDataPrediction';
import ClinicalDataVisualization from './pages/ClinicalDataVisualization';
import CombinedPrediction from './pages/CombinedPrediction';
import Features from './pages/Features';
import FundusImagePrediction from './pages/FundusImagePrediction';
import Home from './pages/Home'

function RouteContainer() {

  const [id,setId] = useState("");

  return (
    <>
        <Routes>
            <Route path='/' element={<Home setId={setId}/>} />
            <Route path='/home' element={<Home setId={setId}/>} />
            <Route path='/app' element={<App/>} />
            <Route path='/features' element={<Features id={id} setId={setId}/>} />
            <Route path='/clinicalDataPrediction' element={<ClinicalDataPrediction id={id} setId={setId}/>} />
            <Route path='/fundusImagePrediction' element={<FundusImagePrediction id={id} setId={setId}/>} />
            <Route path='/combinedPrediction' element={<CombinedPrediction id={id} setId={setId}/>} />
            <Route path='/clinicaldatavisualization' element={<ClinicalDataVisualization id={id} setId={setId}/>} />
            <Route path='/clinicaldatabatch' element={<ClinicalDataBatch id={id} setId={setId}/>} />
        </Routes>
    </>
  )
}

export default RouteContainer