import React from "react";
import "../styles/styles.css";

// importa somente os icons
import IconFacebook from "../assets/icons/face.png";
import IconTwitter from "../assets/icons/twitter.png";
import IconYoutube from "../assets/icons/youtube.png";
import Logo from "../assets/icons/logo2.png"; 

export default function Footer() {
  return (
    <footer className="footerWrap">
      <div className="footerInner">

        {/* LOGO ESQUERDA */}
        <div className="logoFooter">
          <img src={Logo} alt="Filminis Logo" className="footerLogoImg" />
        </div>

        {/* COPYRIGHT */}
        <p>© 2025 Filminis. Todos os direitos reservados.</p>

        {/* REDES SOCIAIS */}
        <div className="socialIcons">
          <a href="#" className="socialLink">
            <img src={IconFacebook} alt="facebook" />
          </a>

          <a href="#" className="socialLink">
            <img src={IconTwitter} alt="twitter" />
          </a>

          <a href="#" className="socialLink">
            <img src={IconYoutube} alt="youtube" />
          </a>
        </div>

      </div>
    </footer>
  );
}
