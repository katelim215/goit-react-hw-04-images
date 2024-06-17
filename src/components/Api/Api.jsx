import axios from 'axios';

const API_KEY = '42488056-39cd93b2543a722d8f6625aa2';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page) => {
  if (!query || query.trim() === '') {
    throw new Error('Query cannot be empty');
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        page: page,
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: 12,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response code: ${response.status}`);
    }

    return response.data.hits.map((hit) => ({
      id: hit.id,
      webformatURL: hit.webformatURL,
      largeImageURL: hit.largeImageURL,
    }));
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw new Error(`API Error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      throw new Error('No response received from the API');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};