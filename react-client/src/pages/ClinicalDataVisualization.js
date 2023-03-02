import React, { useState } from 'react'
import SNavbar from '../components/SNavbar'
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import './ClinicalDataVisualization.css'
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BarChart from "../components/BarChart";

function ClinicalDataVisualization(props) {

  const [buttonVisible, setButtonVisible] = useState(true);

  const handleButtonClick = () => {
    setButtonVisible(false);
  }

  const iniData={
    labels: [],
    datasets: [
      {
        label: 'No data',
        data: [],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  }
  const [userData, setUserData] = useState({
    labels: ['200','300','4','43','4'],
    datasets: [
      {
        label: false?'yes':'no',
        data: [20,30,20,10,40],
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });
  const [visibility,setVisibility] = useState("hidden");
  const [errorVisibility,setErrrorVisibility] = useState("hidden");
  const [leftDioptre1Data,setLeftDioptre1Data] = useState(iniData);
  const [rightDioptre1Data,setRightDioptre1Data] = useState(iniData);
  const [leftDioptre2Data,setLeftDioptre2Data] = useState(iniData);
  const [rightDioptre2Data,setRightDioptre2Data] = useState(iniData);
  const [leftAstigmatismData,setLeftAstigmatismData] = useState(iniData);
  const [rightAstigmatismData,setRightAstigmatismData] = useState(iniData);
  const [leftPneumaticData, setLeftPneumaticData] = useState(iniData);
  const [rightPneumaticData, setRightPneumaticData] = useState(iniData);
  const [leftPerkinsData,setLeftPerkinsData] = useState(iniData);
  const [rightPerkinsData,setRightPerkinsData] = useState(iniData);
  const [leftPachymetryData,setLeftPachymetryData]= useState(iniData);
  const [rightPachymetryData,setRightPachymetryData]= useState(iniData);
  const [leftAxiallengthData, setLeftAxiallengthData] = useState(iniData);
  const [rightAxiallengthData, setRightAxiallengthData] = useState(iniData);
  const [leftVfmdData, setLeftBVfmdData] = useState(iniData);
  const [rightVfmdData, setRightBVfmdData] = useState(iniData);
  const [leftPrediction, setLeftPrediction] = useState(iniData);
  const [rightPrediction, setRightPrediction] = useState(iniData);
  
  const navigate = useNavigate();
  const warnColor = 'rgba(245, 227, 0, 0.52)'
  const safeColor = 'rgba(0, 227, 0, 0.47)'

  if(false){setUserData(userData);}

  let getGraphData = (labelsAr,dMin,dMax,dataAr)=>{
    if(labelsAr.length===0) return iniData;
    return {
        labels: labelsAr,
        datasets: [
          {
            label: dataAr[0]>=dMin && dataAr[0]<=dMax?'Normal':'Abnormal',
            data: dataAr,
            backgroundColor: dataAr.map((data) => {return data>=dMin && data<=dMax?safeColor:warnColor}),
            borderColor: "black",
            borderWidth: 2
          },
          {label: dataAr[0]>=dMin && dataAr[0]<=dMax?'Abormal':'Normal',
           backgroundColor: (dataAr[0]>=dMin && dataAr[0]<=dMax)?[warnColor]:[safeColor],
           borderColor:"black",borderWidth: 2}
        ],
    }
  }

  let getPredictionGraphData = (labelsAr,dMin,dMax,dataAr)=>{
    if(labelsAr.length===0) return iniData;
    return {
        labels: labelsAr,
        datasets: [
          {
            label: dataAr[0]>=dMin && dataAr[0]<=dMax?'No Glaucoma Predicted':'Glaucoma Predicted',
            data: dataAr,
            backgroundColor: dataAr.map((data) => {return data>=dMin && data<=dMax?safeColor:warnColor}),
            borderColor: "black",
            borderWidth: 2
          },
          {label: dataAr[0]>=dMin && dataAr[0]<=dMax?'Glaucoma Predicted':'No Glaucoma Predicted',
           backgroundColor: (dataAr[0]>=dMin && dataAr[0]<=dMax)?[warnColor]:[safeColor],
           borderColor:"black",borderWidth: 2}
        ],
    }
  }

  let predict = (e)=>{
    e.preventDefault();

    if(props.id===''){
      navigate('/');
      return;
    }

    let leftdioptre2 = []
    let leftdioptre1 = []
    let leftastigmatism = []
    let leftphakic = []
    let leftpneumatic = []
    let leftperkins = []
    let leftpachymetry = []
    let leftaxiallength = []
    let leftvfmd = []
    let leftprediction = []
    let leftdate = []

    let rightdioptre2 = []
    let rightdioptre1 = []
    let rightastigmatism = []
    let rightphakic = []
    let rightpneumatic = []
    let rightperkins = []
    let rightpachymetry = []
    let rightaxiallength = []
    let rightvfmd = []
    let rightprediction = []
    let rightdate = []

    toast.info("Fetching Data from server");
    fetch('/getallclinicaldata',{method:'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({'uid':props.id})}
    ).then(
      res => res.json()
    ).then(
      data => {
        if(data.count===0){
            setErrrorVisibility("");
            toast.warn("Please make an entry first!");
        }else{
            for (let i = 0; i < data.count; i++){
                if(data.eye[i]==='0'){
                    leftdioptre2.push(parseFloat(data.dioptre1[i]))
                    leftdioptre1.push(parseFloat(data.dioptre2[i]))
                    leftastigmatism.push(parseFloat(data.astigmatism[i]))
                    leftphakic.push(parseFloat(data.phakic[i]))
                    leftpneumatic.push(parseFloat(data.pneumatic[i]))
                    leftperkins.push(parseFloat(data.perkins[i]))
                    leftpachymetry.push(parseFloat(data.pachymetry[i]))
                    leftaxiallength.push(parseFloat(data.axiallength[i]))
                    leftvfmd.push(parseFloat(data.vfmd[i]))
                    leftprediction.push(parseFloat(data.prediction[i]))
                    leftdate.push(data.date[i])
                }else{
                    rightdioptre2.push(parseFloat(data.dioptre1[i]))
                    rightdioptre1.push(parseFloat(data.dioptre2[i]))
                    rightastigmatism.push(parseFloat(data.astigmatism[i]))
                    rightphakic.push(parseFloat(data.phakic[i]))
                    rightpneumatic.push(parseFloat(data.pneumatic[i]))
                    rightperkins.push(parseFloat(data.perkins[i]))
                    rightpachymetry.push(parseFloat(data.pachymetry[i]))
                    rightaxiallength.push(parseFloat(data.axiallength[i]))
                    rightvfmd.push(parseFloat(data.vfmd[i]))
                    rightprediction.push(parseFloat(data.prediction[i]))
                    rightdate.push(data.date[i])
                }
            }

            setLeftDioptre1Data(getGraphData(leftdate,-.25,0.25,leftdioptre1));
            setLeftDioptre2Data(getGraphData(leftdate,-.25,0.25,leftdioptre2));
            setLeftAstigmatismData(getGraphData(leftdate,0,30,leftastigmatism));
            setLeftPneumaticData(getGraphData(leftdate,10,21,leftpneumatic));
            setLeftPerkinsData(getGraphData(leftdate,10,21,leftperkins));
            setLeftPachymetryData(getGraphData(leftdate,520,560,leftpachymetry));
            setLeftAxiallengthData(getGraphData(leftdate,22,26,leftaxiallength));
            setLeftBVfmdData(getGraphData(leftdate,-2,0,leftvfmd));
            setLeftPrediction(getPredictionGraphData(leftdate,-0.3,0.3,leftprediction));

            setRightDioptre1Data(getGraphData(rightdate,-.25,0.25,rightdioptre1));
            setRightDioptre2Data(getGraphData(rightdate,-.25,0.25,rightdioptre2));
            setRightAstigmatismData(getGraphData(rightdate,0,30,rightastigmatism));
            setRightPneumaticData(getGraphData(rightdate,10,21,rightpneumatic));
            setRightPerkinsData(getGraphData(rightdate,10,21,rightperkins));
            setRightPachymetryData(getGraphData(rightdate,520,560,rightpachymetry));
            setRightAxiallengthData(getGraphData(rightdate,22,26,rightaxiallength));
            setRightBVfmdData(getGraphData(rightdate,-2,0,rightvfmd));
            setRightPrediction(getPredictionGraphData(rightdate,-0.3,0.3,rightprediction));

            setVisibility("");
            setErrrorVisibility("hidden");
            toast.success("All Informations fetched!");
        }
      }
    )
  }

  return (
    <>
      <SNavbar setId={props.setId}/>
      <h3 className='header'>Visualize Clinical Records</h3>
      <div style={{display:"flex", flexDirection:"column", width:"50%"}}>
      <Button className='btn-visual' variant="success" type="submit" onClick={ predict} size="lg" style={{width:"80%", marginTop: '2%', marginLeft:'auto',marginRight:'auto'}}>
            Get Started!
        </Button>
        <h2 style={{paddingTop:"2%", marginLeft:"auto",marginRight:"auto",visibility:errorVisibility,backgroundColor:warnColor}}>
            No saved data found in the server. Please save a clinical data first.
        </h2>
      </div>
      <div style={{display:"flex", flexDirection:"column", width:"100%", visibility:visibility}}>
        <h2 style={{ marginLeft:"auto",marginRight:"auto"}}>
            Visualization of all Clinical Data. Date Format along x-axis: YYYY-MM-DD.
        </h2>
        <div className='gridDiv'>
          <h3 style={{width:"50%", textAlign:"center"}}>Left Eye</h3> 
          <h3 style={{width:"50%", textAlign:"center"}}>Right Eye</h3> 
        </div>
        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftPrediction} title='Predictions'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightPrediction} title='Predictions'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftDioptre1Data} title='Refractive Error of cornea [unit Dioptre]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightDioptre1Data} title='Refractive Error of cornea [unit Dioptre]'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftDioptre2Data} title='Refractive Error of Eye Lens [unit Dioptre]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightDioptre2Data} title='Refractive Error of Eye Lens [unit Dioptre]'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftAstigmatismData} title='Astigmatism [unit: Degree]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightAstigmatismData} title='Astigmatism [unit: Degree]'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftPneumaticData} title='Intraocular Pressure/ IOP using pneumatic [unit: mmHg]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightPneumaticData} title='Intraocular Pressure/ IOP using pneumatic [unit: mmHg]'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftPerkinsData} title='Intraocular Pressure/ IOP using perkins [unit: mmHg]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightPerkinsData} title='Intraocular Pressure/ IOP using perkins [unit: mmHg]'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftPachymetryData} title='Cornea Thickness [unit: micro meter]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightPachymetryData} title='Cornea Thickness [unit: micro meter]'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftAxiallengthData} title='Axial Length of Eye [unit: mm]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightAxiallengthData} title='Axial Length of Eye [unit: mm]'/>
          </div> 
        </div>

        <div className='gridDiv'>
          <div className='chart'>
            <BarChart chartData={leftVfmdData} title='Mean Defect of EYE [unit: dB]'/>
          </div>
          <div className='chart'>
            <BarChart chartData={rightVfmdData} title='Mean Defect of EYE [unit: dB]'/>
          </div> 
        </div>
        
      </div>
    </>
  )
}

export default ClinicalDataVisualization