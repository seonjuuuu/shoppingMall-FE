import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './HomeBanner.module.scss';

const banners = [
  {
    id: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1729682459691-e18931cf9893?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '우리 사이트에 오신 것을 환영합니다!',
    description: '놀라운 콘텐츠와 기능을 여기에서 확인하세요.',
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1729547846218-bd20bc595fd2?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '새로운 제품을 확인하세요!',
    description: '최신 제품들을 탐험해보세요.',
  },
  {
    id: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1728619054334-841f8b6e87da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: '특별 할인 혜택!',
    description: '회원가입을 통해 할인 혜택을 받아보세요.',
  },
];

const HomeBanner = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_, next) => handleFocusControl(next),
  };
  const handleFocusControl = (activeIndex) => {
    const slides = sliderRef.current?.innerSlider.list?.children;
    if (slides) {
      Array.from(slides).forEach((slide, index) => {
        const focusableElements = slide.querySelectorAll(
          'a, button, input, [tabindex]'
        );
        focusableElements.forEach((el) => {
          el.tabIndex = index === activeIndex ? 0 : -1;
        });
      });
    }
  };

  return (
    <div className={styles.bannerContainer}>
      <Slider ref={sliderRef} {...settings}>
        {banners.map((banner) => (
          <div key={banner.id} className={styles.bannerSlide}>
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className={styles.bannerImage}
            />
            <div className={styles.bannerContent}>
              <h2>{banner.title}</h2>
              <p>{banner.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeBanner;
