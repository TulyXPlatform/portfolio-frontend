import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>© {year} Tamima Mollick Tuly. All rights reserved.</p>
    </footer>
  );
};

export default Footer;