import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ContentsTab.css'



const ContentsTab = ({tabs}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const tabRefs = useRef([]);
  
  
    const handleTabClick = (index) => {
      setSelectedTab(index);
    };
  
    useEffect(() => {
      if (tabRefs.current[selectedTab]) {
        const { offsetWidth, offsetLeft } = tabRefs.current[selectedTab];
        setIndicatorStyle({
          width: `${offsetWidth}px`,
          left: `${offsetLeft}px`
        });
      }
    }, [selectedTab]);
  
    return (
      <div className="contents_tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            className={selectedTab === index ? 'active' : ''}
            onClick={() => handleTabClick(index)}
          >
            <span>{tab}</span>
          </button>
        ))}
        <div className="tab_indicator" style={indicatorStyle} />
      </div>
    );
};


export default ContentsTab;
