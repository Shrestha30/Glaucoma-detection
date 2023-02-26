import React, { useState } from 'react'
import SNavbar from '../components/SNavbar'
import Form from 'react-bootstrap/Form';
import './ClinicalDataPrediction.css';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';


function ClinicalDataPrediction(props) {

  const [date,setDate] = useState("");
  const [ivDate, setIvDate] = useState(false);
  const [eye,setEye] = useState('0');
  const [isSave, setIsSave] = useState("1");
  const [dioptre_1,setDioptre_1] = useState("");
  const [invD1, setInvD1] = useState(false);
  const [dioptre_2,setDioptre_2] = useState("");
  const [invD2, setInvD2] = useState(false);
  const [astigmatism, setAstigmatism] = useState("");
  const [invAstigmatism, setInvAstigmatism] = useState(false);
  const [phakic,setPhakic] = useState("0");
  const [gender, setGender] = useState("0");
  const [age, setAge] = useState('');
  const [invAge, setInvAge] = useState(false);
  const [pneumatic, setPneumatic] = useState("");
  const [invPneumatic, setInvPneumatic] = useState(false);
  const [perkins, setPerkins] = useState("");
  const [invPerkins, setInvPerkins] = useState(false);
  const [pachymetry, setPachymetry] = useState('');
  const [invPachymetry, setInvPachymetry] = useState(false);//cornea thickness
  const [axialLength, setAxialLength] = useState('');
  const [invAxialLength,setInvAxialLength] = useState(false);
  const [vfmd, setvfmd] = useState('');
  const [invVfmd, setInvVfmd] = useState(false);
  const [prdmsg, setPrdmsg] = useState("Not yet predicted");
  const [upldmsg, setUpldmsg] = useState('Predict');
  const [prdmsgvar, setprdmsgvar] = useState('primary');

  const navigate = useNavigate();

  let predict = e =>{
    e.preventDefault();

    if(props.id===''){
      navigate('/');
      return;
    }
    if(isSave==='0' && date===''){
      toast.info('Please set the date');
      setIvDate(true);
      return;
    }
    if(dioptre_1===''){
      toast.info('Please set the refractive error of cornea');
      setInvD1(true);
      return;
    }
    if(dioptre_2===''){
      toast.info('Please set the refractive error of lens');
      setInvD2(true);
      return;
    }
    if(astigmatism===''){
      toast.info('Please set the astigmatism');
      setInvAstigmatism(true);
      return;
    }
    if(age===''){
      toast.info('Please enter your current age');
      setInvAge(true);
      return;
    }
    if(pneumatic===''){
      toast.info('Please set the pneumatic measure');
      setInvPneumatic(true);
      return;
    }
    if(perkins===''){
      toast.info('Please set the perkins value');
      setInvPerkins(true);
      return;
    }
    if(pachymetry===''){
      toast.info('Please set the thickness of cornea');
      setInvPachymetry(true);
      return;
    }
    if(axialLength===''){
      toast.info('Please set the axial length of the eye');
      setInvAxialLength(true);
      return;
    }
    if(vfmd===''){
      toast.info('Please set the mean deviation of eye');
      setInvVfmd(true);
      return;
    }

    setUpldmsg('Predicting')
    toast.info('Prediction in progress');

    const data = {
                  "uid": props.id,
                  "date":date,
                  'eye':eye,
                  'save':isSave,
                  'dioptre1':dioptre_1,
                  'dioptre2':dioptre_2,
                  'astigmatism':astigmatism,
                  'phakic':phakic,
                  'gender':gender,
                  'age':age,
                  'pneumatic':pneumatic,
                  'perkins':perkins,
                  'pachymetry':pachymetry,
                  'axiallength':axialLength,
                  'vfmd':vfmd,
                }

    fetch('/clinicalpredict', {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(data)
    }).then(resp => {
      resp.json().then(data => {
        if(data.error==="none"){
          toast.success('prediction done');
          if(data.prediction==='glaucoma'){
            setprdmsgvar('warning');
            setPrdmsg('Glaucoma Detected');
          }else{
            setprdmsgvar('success');
            setPrdmsg('Glaucoma Not Detected');
          }
          setUpldmsg('Predict');
        }else{
          toast.warning('Something went wrong while predicting');
          setprdmsgvar('warning');
          setPrdmsg('Something went wrong');
          setUpldmsg('Predict');
        }
      })
    })

    setUpldmsg('Predict')
    toast.info('prediction complete');

  }

  return (
    <>
        <SNavbar setId={props.setId}/>
        <div className='wrap-main'>
            <h3 className='header' style={{paddingTop:"10px"}}>Predict Based on Clinical Data</h3>
            <Form className='pad'>
              
              <Form.Group className="mb-3 pad" controlId="eye" style={{width:"100%"}}>
                <Form.Label>Select Left/Right Eye</Form.Label>
                <Form.Select aria-label="Default select example" onChange={(e)=>{setEye(e.target.value)}}>
                  <option value="0">Left</option>
                  <option value="1">Right</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 pad" controlId="date" style={{width:"100%"}}>
                <Form.Label>Date of test for clinical data</Form.Label>
                <Form.Control type='date' placeholder='Date of Image taken' isInvalid={ivDate} onChange={(e)=>{setDate(e.target.value);setIvDate(false);}}/>
                <Form.Text className="text-muted">
                  Will be ignored If chosen not to save in database. If clinical data exists on the same date, then previous data will be updated with current one.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please select a Date.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3 pad" controlId="issave" style={{width:"100%"}}>
                  <Form.Label>Save Clinical Data provided to Database Online</Form.Label>
                  <Form.Select aria-label="Default select example" onChange={(e)=>{setIsSave(e.target.value)}}>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAge" hasValidation>
                <Form.Label>Current Age</Form.Label>
                <Form.Control type="number" placeholder="Age" required isInvalid={invAge} value={age} onChange={e=>setAge(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Invalid Age.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <Form.Select aria-label="Default select example" onChange={(e)=>{setGender(e.target.value)}}>
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 pad" controlId="issave" style={{width:"100%"}}>
                  <Form.Label>Is Crystalline lens present</Form.Label>
                  <Form.Select aria-label="Default select example" onChange={(e)=>{setPhakic(e.target.value)}}>
                    <option value="0">Yes (Phakic)</option>
                    <option value="1">No (Pseudophakic)</option>
                  </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAge" hasValidation>
                <Form.Label>Refractive Error of Cornea (in unit: Dioptre)</Form.Label>
                <Form.Control type="number" placeholder="Refractive Error of Cornea (in unit: Dioptre)" required isInvalid={invD1} value={dioptre_1} onChange={e=>setDioptre_1(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAge" hasValidation>
                <Form.Label>Refractive Error of Eye Lens (in unit: Dioptre)</Form.Label>
                <Form.Control type="number" placeholder="Refractive Error of Eye Lens (in unit: Dioptre)" required isInvalid={invD2} value={dioptre_2} onChange={e=>setDioptre_2(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAge" hasValidation>
                <Form.Label>Astigmatism (in unit: Degree)</Form.Label>
                <Form.Control type="number" placeholder="Astigmatism (in unit: Degree)" required isInvalid={invAstigmatism} value={astigmatism} onChange={e=>setAstigmatism(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Intraocular Pressure/ IOP using pneumatic (in unit: mmHg)</Form.Label>
                <Form.Control type="number" placeholder="Intraocular Pressure/ IOP using pneumatic (in unit: mmHg)" required isInvalid={invPneumatic} value={pneumatic} onChange={e=>setPneumatic(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Intraocular Pressure/ IOP using perkins (in unit: mmHg)</Form.Label>
                <Form.Control type="number" placeholder="Intraocular Pressure/ IOP using perkins (in unit: mmHg)" required isInvalid={invPerkins} value={perkins} onChange={e=>setPerkins(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cornea thickness using pachymetry (in unit: micro meter)</Form.Label>
                <Form.Control type="number" placeholder="Cornea thickness using pachymetry (in unit: micro meter)" required isInvalid={invPachymetry} value={pachymetry} onChange={e=>setPachymetry(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Eye's axial length (in unit: mm)</Form.Label>
                <Form.Control type="number" placeholder="Eye's axial length (in unit: mm)" required isInvalid={invAxialLength} value={axialLength} onChange={e=>setAxialLength(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mean Defect of eye (in unit: dB)</Form.Label>
                <Form.Control type="number" placeholder="Mean Defect of eye (in unit: dB)" required isInvalid={invVfmd} value={vfmd} onChange={e=>setvfmd(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                  Field cannot be left empty.
                </Form.Control.Feedback>
              </Form.Group>

              <Alert key='prdmsg' variant={prdmsgvar}>
                Prediction: {prdmsg}
              </Alert>
                
              <Button className='btn-clinical' variant="success" type="submit" onClick={predict} size="lg" style={{width:"100%", marginTop: '5%'}}>
                {upldmsg}
              </Button>

            </Form>
        </div>
    </>
  )
}

export default ClinicalDataPrediction