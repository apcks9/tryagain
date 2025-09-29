import { useState } from 'react';

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    './bora.jpeg',
    './bora2.jpeg',
    './bora3.jpeg',
    './bora4.jpeg',
    './bora5.jpeg'
  ];

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full h-[400px] mb-10">
      <div className="w-full h-full">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Left Arrow */}
      <div 
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
      >
        ❮
      </div>
      
      {/* Right Arrow */}
      <div 
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-4xl cursor-pointer bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
      >
        ❯
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow; 