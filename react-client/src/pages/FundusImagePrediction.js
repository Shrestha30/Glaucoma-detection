import React, { useEffect, useState } from 'react'
import SNavbar from '../components/SNavbar'
import Form from 'react-bootstrap/Form';
import './FundusImagePrediction.css'
import ImageIcon from "../images/image-upld.jpg";
import Image from 'react-bootstrap/Image'
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';

function FundusImagePrediction(props) {

  const [upldmsg,setUpldmsg] = useState("Predict");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isSave, setIsSave] = useState(true);
  const [eye,setEye] = useState('0');
  const [prdmsg,setPrdmsg] = useState('Not yet Predicted');
  const [date,setDate] = useState("");
  const [ivDate, setIvDate] = useState(false);
  const [prdmsgvar, setprdmsgvar] = useState('primary');

  const navigate = useNavigate();

  useEffect(() => {
    if (!image) return;
    setImageUrl(URL.createObjectURL(image));
  }, [image]);

  let predict = e =>{
    e.preventDefault();

    if(props.id===''){
      navigate('/');
      return;
    }

    if(!image){
      toast.info('Please Upload an Image first');
      return;
    }

    setUpldmsg('Predicting')
    toast.info('Prediction in progress');

    const data = new FormData();

    data.append('file', image);//
    data.append('id', props.id);//

    if(isSave===true){
      if(date===""){
        toast.info('Date not selected');
        setIvDate(true);
        return;
      }
      data.append('save', "yes");//
      data.append('date', date);//
    }
    else data.append('save', "no");

    if(eye==='0') data.append('eye', eye);
    else data.append('eye', eye);//

    fetch('/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        if(body.prediction==='Glaucoma') {setPrdmsg('Glaucoma Detected'); setprdmsgvar('warning');}
        else {setPrdmsg('Glaucoma not Detected'); setprdmsgvar('success');};
      });
    });

    setUpldmsg('Predict')
    toast.info('prediction complete');

  }

  return (
    <>
        <SNavbar setId={props.setId}/>
        <div className='wrap-main'>
            <h3 className='header'>Predict Based on Fundus Image</h3>
            <Image className='imgpad'
                    src={image ? imageUrl : ImageIcon}
            />
            <Form className='pad'>

                <div className="upload-btn">
                    <div className="uploadimage">
                        <label className='label-c' htmlFor="imgs">Select Image</label>
                    </div>
                    <input id="imgs" type="file" accept="image/*" onChange={(e)=>setImage(e.target.files[0])} />
                </div>

                <Form.Group className="mb-3 pad" controlId="date" style={{width:"100%"}}>
                  <Form.Label>Date of Image taken</Form.Label>
                  <Form.Control type='date' placeholder='Date of Image taken' isInvalid={ivDate} onChange={(e)=>{setDate(e.target.value);setIvDate(false);}}/>
                  <Form.Text className="text-muted">
                    Will be ignored If chosen not to save in database. If image data exists on the same date, then previous data will be updated with current one.
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    Please select a Date.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 pad" controlId="issave" style={{width:"100%"}}>
                  <Form.Label>Save to Database Online</Form.Label>
                  <Form.Select aria-label="Default select example" onChange={(e)=>{e.target.value==='0'?setIsSave(true):setIsSave(false)}}>
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3 pad" controlId="eye" style={{width:"100%"}}>
                  <Form.Label>Select Left/Right Eye</Form.Label>
                  <Form.Select aria-label="Default select example" onChange={(e)=>{setEye(e.target.value)}}>
                    <option value="0">Left</option>
                    <option value="1">Right</option>
                  </Form.Select>
                </Form.Group>

                <Alert key='prdmsg' variant={prdmsgvar}>
                  Prediction: {prdmsg}
                </Alert>
                
                <Button className='btn-fundus' variant="success" type="submit" onClick={predict} size="lg" style={{width:"100%", marginTop: '5%'}}>
                  {upldmsg}
                </Button>
            </Form>
        </div>
    </>
  )
}

export default FundusImagePrediction