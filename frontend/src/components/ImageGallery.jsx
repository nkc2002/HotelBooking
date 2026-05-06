import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';

const ImageGallery = ({ images = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974',
  ];

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      {/* Gallery Grid - Airbnb Style */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[400px] lg:h-[500px]">
          {/* Main Image */}
          <div 
            className="md:col-span-2 md:row-span-2 cursor-pointer"
            onClick={() => openModal(0)}
          >
            <img
              src={displayImages[0]}
              alt="Ảnh chính khách sạn"
              className="w-full h-full object-cover hover:opacity-95 transition-opacity"
            />
          </div>

          {/* Secondary Images */}
          {displayImages.slice(1, 5).map((image, index) => (
            <div 
              key={index}
              className={`hidden md:block cursor-pointer ${index >= 2 ? 'hidden lg:block' : ''}`}
              onClick={() => openModal(index + 1)}
            >
              <img
                src={image}
                alt={`Khách sạn ${index + 2}`}
                className="w-full h-full object-cover hover:opacity-95 transition-opacity"
              />
            </div>
          ))}
        </div>

        {/* Show All Photos Button */}
        <button
          onClick={() => openModal(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Grid3X3 size={16} />
          Show all photos
        </button>
      </div>

      {/* Fullscreen Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 left-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer z-10"
          >
            <X size={24} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <ChevronLeft size={32} className="text-white" />
          </button>

          {/* Current Image */}
          <img
            src={displayImages[currentIndex]}
            alt={`Khách sạn ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <ChevronRight size={32} className="text-white" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden cursor-pointer ${
                  index === currentIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
