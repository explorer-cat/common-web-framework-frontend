import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './swiper.css';
// import required modules
import { Pagination, Navigation } from 'swiper/modules';

export default function SwipeToSlide({slideList}) {
  const swiperRef = useRef(null);
  const [leftGradient, setLeftGradient] = useState(false);
  const [rightGradient, setRightGradient] = useState(true);

  //스와이프가 일어날때 발생하는 이벤트
  const handleSwipe = (event) => {
    const swiperElement = swiperRef.current;
    const prev_button = swiperElement.querySelector('.swiper-button-prev.swiper-button-disabled');
    const next_button = swiperElement.querySelector('.swiper-button-next.swiper-button-disabled');

    if(prev_button) {
      setLeftGradient(false);
    } else {
      setLeftGradient(true);
    }
    if(next_button) {
      setRightGradient(false);
    } else {
      setRightGradient(true);
    }
  }
  
  
  return (
    <>
      <div className = {leftGradient ? "gradient-left" : ""}/>
      <Swiper
        ref={swiperRef}
        slidesPerView={'auto'}
        slideToClickedSlide
        onSlideChange={handleSwipe}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
          {slideList.map((slideContent, index) => (
          <SwiperSlide key={index}>
            {slideContent}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className = {rightGradient ? "gradient-right" : ""}/>
    </>
  );
}
