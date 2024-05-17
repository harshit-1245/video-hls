import React from 'react';
import logo from '../../assets/pngwing.com.png';
import "./Header.css";

const Header = () => {
  return (
    <div className='container'>
      <nav>
        <div className='logo-container'>
          <img src={logo} alt='logo'/>
          <p className='logo'>Youtofy</p>
        </div>
        <ul>
          <li><a href="#">Youtube to mp3</a></li>
          <li><a href="#">Youtube to mp3</a></li>
          <li><a href="#">Youtube to mp3</a></li>
          <li><a href="#">Donate 💖</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;
