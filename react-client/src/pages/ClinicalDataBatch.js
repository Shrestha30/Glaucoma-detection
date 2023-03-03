import React, { useEffect, useState } from 'react'
import SNavbar from '../components/SNavbar'
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import './ClinicalDataBatch.css';
import { useNavigate } from 'react-router-dom';

function ClinicalDataBatch(props) {

  const [file,setFile] = useState(null)
  const [fileNameVis, setFileNameVis] = useState(false);
  const [fileName, setFileName] = useState("None");
  const [dwnldBtnVis, setDwnldBtnVis] = useState('hidden');

  const navigate = useNavigate();

  useEffect(() => {
    if (!file){
        return;
    }else{
        setFileNameVis(true);
        setFileName(file['name']);
    }
  }, [file]);

  let batchPredict = (e)=>{
    e.preventDefault();

    if(props.id===''){
      navigate('/');
      return;
    }

    if(!file){
      toast.info('Please Upload an Image first');
      return;
    }
    
    toast.info('Upload and Prediction in progress');

    const data = new FormData();

    data.append('file', file);
    data.append('id', props.id);

    fetch('/uploadBatchClinicalData', {
        method: 'POST',
        body: data,
      }).then((response) => {
        response.json().then((body) => {
          if(body.success==='1'){
            toast.success("Bacth processed file can now be downloaded");
            setDwnldBtnVis('');
          }
        });
      });
  }

  let download = ()=>{
    let hurlink=`http://localhost:5000/downloadBatchPredictionCD?s=${props.id}`;
    const aTag = document.createElement('a');
    aTag.href = hurlink;
    aTag.setAttribute('download','.csv');
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }
  return (
    <>
      <SNavbar setId={props.setId}/>
      <div className="upload-btn" style={{width:"100%"}}>
        <div className="uploadimage">
            <label className='label-c'style={{width:"500px", height:"30px"}} htmlFor="imgs">Select CSV File</label>
        </div>
        <input id="imgs" type="file" accept=".csv" onChange={(e)=>{setFile(e.target.files[0]);console.log(e.target.files[0])} } />
      </div>
      <div style={{display:"flex", flexDirection:"column", width:"100%"}}>
      <h4 style={{marginLeft:"10%"}}>Must have columns:</h4>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>Other columns are optional and wont be removed from the output csv file. Required column names:</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'Age' for patient's age. Unit: years</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'Gender' for patient's gender. value 0: male, 1: female</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'dioptre_1' for cornea's refractive index. unit: Diopter</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'dioptre_2' for patient's refractive index of lens. unit: Dioper</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'astigmatism' for patient's astigmatism. Unit: Degree</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'Phakic/Pseudophakic' value 1: if patient's eye has crystalline lens, 0: otherwise</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'Pneumatic' for patient's Intra Ocular Pressure using pneumatic method. Unit: mmHg</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'Perkins' for patient's Intra Ocular Pressure using perkins method. Unit: mmHg</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'Pachymetry' for patient's corneal thickness. Unit: micro meter</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'Axial_length' for patient's axial length of eye. Unit: mm</div>
      <div style={{marginLeft:"10%", marginRight:'10%'}}>'VF_MD' for patient's Mean deviation of eye</div>
      <img src={require('../images/must-csv.png')} alt='' style={{width:'80%',height:'100px',marginLeft:'auto',marginRight:'auto'}}></img>
      <input id="csvs" type="file" accept=".csv" onChange={(e)=>setFile(e.target.files[0])}></input>
        <Button className='btn-batch' variant="success" type="submit" onClick={batchPredict} size="lg" style={{width:"80%", marginTop: '2%', marginLeft:'auto',marginRight:'auto'}}>
            Process CSV File
        </Button>
        <h2 style={{marginLeft:"auto",marginRight:"auto",visibility:fileNameVis,backgroundColor:'rgba(0, 227, 0, 0.47)',marginTop:"2%"}}>
            {'File Selected: '+fileName}
        </h2>
        <Button className='btn-batch' variant="success" type="submit" onClick={download} size="lg" style={{visibility:dwnldBtnVis,width:"80%", marginTop: '2%', marginLeft:'auto',marginRight:'auto'}}>
            Download Processed CSV
        </Button>
      </div>
    </>
  )
}

export default ClinicalDataBatch