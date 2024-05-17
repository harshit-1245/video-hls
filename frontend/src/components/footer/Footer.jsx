import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import "./Footer.css"

const Footer = () => {
  return (
    <footer class="footer">
    <div class="containing">
      <div class="row">
        <div class="footer-col">
          <h4>company</h4>
          <ul>
            <li><a href="#">about us</a></li>
           
            <li><a href="#">privacy policy</a></li>
            
          </ul>
        </div>
        <div class="footer-col">
          <h4>get help</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
           <li><a href="#">payment options</a></li>
          </ul>
        </div>
       
        <div class="footer-col">
          <h4>follow us</h4>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook-f"><FaFacebook /></i></a>
            <a href="#"><i class="fab fa-twitter"><FaSquareXTwitter/></i></a>
            <a href="#"><i class="fab fa-instagram"><FaGithub/></i></a>
            <a href="#"><i class="fab fa-linkedin-in"><FaLinkedin/></i></a>
          </div>
        </div>
      </div>
    </div>
    <div className="message">
      This website is created by solo developer,Please support 💖
    </div>
 </footer>
  )
}

export default Footer
