const Footer = ({ 
  companyName = "Suitelifer.com", 
  copyrightYear = "2025", 
  className = "",
  bgColor = "bg-cyan-600",
  textColor = "text-white",
  textSize = "text-xs",
  padding = "py-3.5"
}) => {
  return (
    <div className={`${bgColor} ${textColor} text-center ${padding} ${className} w-full`}>
      <p className={textSize}>Copyright {copyrightYear} @ {companyName}</p>
    </div>
  );
};

export default Footer;