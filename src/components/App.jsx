import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import { fetchImages } from './Api/Api';
import styles from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!query) return;

    const loadImages = async () => {
      setLoading(true);
      try {
        const newImages = await fetchImages(query, page);
        setImages((prevImages) => [...prevImages, ...newImages]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [query, page]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleImageClick = (largeImageURL) => {
    setSelectedImage(largeImageURL);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleSearch} />
      {error && <p>{error}</p>}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {images.length > 0 && !loading && <Button onClick={handleLoadMore}>Load more</Button>}
      {selectedImage && <Modal largeImageURL={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default App;
