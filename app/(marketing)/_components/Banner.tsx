"use client";
import React, { useState } from "react";
import Image from "next/image";

type Slide = {
  url: string;
};

const Banner: React.FC = () => {
  const slides: Slide[] = [
    { url: "/images/1.jpg" },
    { url: "/images/2.jpg" },
    { url: "/images/3.jpg" },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevSlide = (): void => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (): void => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number): void => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div
      className="relative bg-red-50"
      data-twe-carousel-init
      data-twe-ride="carousel"
    >
      <div
        className="absolute bottom-0 left-0 right-0 z-10 mx-[15%] mb-4 flex list-none justify-center p-0"
        data-twe-carousel-indicators
      >
        {slides.map((slide, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`mx-1 h-1 w-8 cursor-pointer bg-white opacity-50 transition-opacity duration-500 ease-out ${
              currentIndex === index ? "opacity-100" : ""
            }`}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="relative w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              currentIndex === index ? "block" : "hidden"
            }`}
          >
            <Image
              src={slide.url}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-x-[15%] bottom-5 hidden py-5 text-center text-white md:block">
              <h5 className="text-xl">Slide label {index + 1}</h5>
              <p>
                Some representative placeholder content for slide {index + 1}.
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="absolute bottom-0 left-0 top-0 z-10 flex w-[15%] items-center justify-center bg-none p-0 text-white opacity-50 transition-opacity duration-150 ease-out hover:opacity-90"
        onClick={prevSlide}
        aria-label="Previous"
      >
        <span className="inline-block h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </span>
      </button>
      <button
        className="absolute bottom-0 right-0 top-0 z-10 flex w-[15%] items-center justify-center bg-none p-0 text-white opacity-50 transition-opacity duration-150 ease-out hover:opacity-90"
        onClick={nextSlide}
        aria-label="Next"
      >
        <span className="inline-block h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default Banner;
