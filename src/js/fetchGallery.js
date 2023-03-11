import axios from 'axios';

export async function fetchGallery(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '34193099-075808226620db616b3773f0f';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(`${url}${filter}`).then(response => response.data);
}
