import React,{useState} from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

function SNavbar(props) {
   const [click, setClick] = useState(false);

   const navigate = useNavigate();

  return (
    <>
        <nav className='navbar'>
            <div className='navbar-container'>
                <img src={require('../images/logo71.png')} alt='' className='navbar-Logo'></img>
                <label className='glaucoma-label'>Glaucoma</label>
                <div className='menu-icon' onClick = {() => setClick(!click)}>
                    <i className= {click ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item' onClick={e=>{navigate('/features')}}>
                        Home
                    </li>
                    {/* <li className='nav-item'>
                        Profile
                    </li> */}
                    <li className='nav-item' onClick={e=>{props.setId("");navigate('/home');}}>
                        Logout
                    </li>
                </ul>
            </div>
        </nav>
        
    </>
  )
}

export default SNavbar