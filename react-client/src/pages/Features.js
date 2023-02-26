import React from 'react'
import { useNavigate } from 'react-router-dom'
import SNavbar from '../components/SNavbar'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Features.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function Features(props) {

  const navigate = useNavigate();

  return (
    <>
      <SNavbar setId={props.setId}/>
        <div style={{display:'flex'}}>
        <div style={{paddingLeft:'30px', paddingRight:'30px',paddingTop:'10px',paddingBottom:'10px', marginTop:'3%', marginLeft:'5%',  borderRadius:'3%'}}>
          <Card bg='dark' text='white' style={{ width: '18rem' }}>
          <Card.Img variant="top" src={require('../images/fundus-logo.jpg')} style={{minHeight:"10rem"}}/>
            <Card.Body>
              <Card.Title className='title'>Predict with Fundus Image</Card.Title>
              <Card.Text className='text'>
              Here you can provide retinal fundus images, and our system will use that data to predict whether you may be at risk for glaucoma. 
              </Card.Text>
              <Button className='card-btn' variant='outline-success' onClick={e=>{navigate('/fundusImagePrediction')}}>Let's Try !</Button>
            </Card.Body>
          </Card>
        </div>

        <div style={{paddingLeft:'30px', paddingRight:'30px',paddingTop:'10px',paddingBottom:'10px',marginTop:'3%', marginLeft:'3%'}}>
          <Card bg='dark' text='white' style={{ width: '18rem',}}>
          <Card.Img variant="top" src={require('../images/clinical-logo.jpg')} style={{minHeight:"10rem"}}/>
            <Card.Body>
              <Card.Title className='title'>Predict with Clinical Data</Card.Title>
              <Card.Text className='text'>
              Here you can provide   your eye history(clinical data), and our system will use that data to predict whether you may be at risk for glaucoma.         
              </Card.Text>
              <Button className='card-btn' variant='outline-success'  onClick={e=>{navigate('/clinicalDataPrediction')}}>Let's Try !</Button>
            </Card.Body>
          </Card>
        </div>

        <div style={{paddingLeft:'30px', paddingRight:'30px',paddingTop:'10px',paddingBottom:'10px',marginTop:'3%', marginLeft:'3%'}}>
          <Card bg='dark' text='white' style={{ width: '18rem',}}>
          <Card.Img variant="top" src={require('../images/combine-img.jpg')} style={{minHeight:"10rem"}}/>
            <Card.Body>
              <Card.Title className='title'>Predict with Combined Data</Card.Title>
              <Card.Text className='text'>
              Here you can provide eye history, fundus images and system will use that data to predict whether you may be at risk for glaucoma. 
              </Card.Text>
              <Button className='card-btn' variant='outline-success' onClick={e=>{navigate('/clinicalDataPrediction')}}>Let's Try !</Button>
            </Card.Body>
          </Card>
        </div>

      </div>
    </>
  )
}

export default Features