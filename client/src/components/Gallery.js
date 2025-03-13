import React, { useState } from 'react';
import '../styles/Gallery.css';

const Gallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleThumbnailClick = (image) => {
    setActiveImage(image);
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    const currentIndex = images.findIndex(img => img.url === activeImage.url);
    const nextIndex = (currentIndex + 1) % images.length;
    setActiveImage(images[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = images.findIndex(img => img.url === activeImage.url);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setActiveImage(images[prevIndex]);
  };

  return (
    <div className="gallery-container">
      <div className="main-image-container">
        <img 
          src={activeImage.url} 
          alt={activeImage.caption || 'Chef gallery image'} 
          className="main-image"
          onClick={openLightbox}
        />
        {activeImage.caption && <p className="image-caption">{activeImage.caption}</p>}
      </div>
      
      <div className="thumbnails-container">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`thumbnail ${image.url === activeImage.url ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(image)}
          >
            <img src={image.url} alt={`Thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <div className="lightbox">
          <div className="lightbox-overlay" onClick={closeLightbox}></div>
          <div className="lightbox-content">
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
            <button className="lightbox-prev" onClick={prevImage}>&lsaquo;</button>
            <img src={activeImage.url} alt={activeImage.caption || 'Chef gallery image'} />
            {activeImage.caption && <p className="lightbox-caption">{activeImage.caption}</p>}
            <button className="lightbox-next" onClick={nextImage}>&rsaquo;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;