import React from 'react';
import '../Icons.css';

// 导入您的所有图片
import icon1 from '../images/icon1.png';
import icon2 from '../images/icon2.png';
import icon3 from '../images/icon3.png';
import icon4 from '../images/icon4.png';
import icon5 from '../images/icon5.png';
import icon6 from '../images/icon6.png';
import people from '../images/atr.png'; // 导入中心图片

const icons = [icon1, icon2, icon3, icon4, icon5, icon6];

const Icons = () => {
  return (
    <div className="icon-circle-container">
      <div className="orbit">
        {icons.map((icon, index) => (
          <img src={icon} className="icon" style={{ '--i': index, '--total': icons.length }} alt={`Icon ${index + 1}`} key={index} />
        ))}
      </div>
      <div className="center-icon">
        <img src={people} alt="Center Icon" />
      </div>
    </div>
  );
}

export default Icons;
