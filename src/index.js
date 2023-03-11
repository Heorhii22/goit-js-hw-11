import { fetchGallery } from './js/fetchGallery';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('form');
const inputEl = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');
const galleryList = document.querySelector('.gallery');

let currentPage = 1;
let lightbox;
let inputValue = '';
const perPage = 40;

loadMoreBtn.classList.remove('load-more');

searchForm.addEventListener('submit', onImgSearch);
loadMoreBtn.addEventListener('click', onLoadMoreImg);

async function onImgSearch(e) {
  e.preventDefault();
  currentPage = 1;
  inputValue = e.currentTarget.searchQuery.value.trim();

  if (inputValue === '') {
    Notiflix.Notify.failure('Type something!');
    galleryList.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');
    loadMoreBtn.classList.remove('load-more');
    return;
  }

  galleryList.innerHTML = '';

  const images = await fetchGallery(inputValue, currentPage);
  console.log(images);

  if (images.totalHits === 0) {
    galleryList.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');
    loadMoreBtn.classList.remove('load-more');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (images.totalHits !== 0) {
    loadMoreBtn.classList.remove('is-hidden');
    loadMoreBtn.classList.add('load-more');
  }

  if (images.totalHits !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  }

  galleryList.insertAdjacentHTML('beforeend', getImageMarkup(images.hits));
  createLightbox();
}

function createLightbox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  }).refresh();
}

async function onLoadMoreImg() {
  currentPage += 1;

  lightbox.destroy();

  const images = await fetchGallery(inputValue, currentPage);
  console.log(images);
  const totalPages = Math.ceil(images.totalHits / perPage);
  console.log(totalPages);
  console.log(currentPage);
  if (images.totalHits === 0) {
    galleryList.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (currentPage >= totalPages) {
    loadMoreBtn.classList.add('is-hidden');
    loadMoreBtn.classList.remove('load-more');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  galleryList.insertAdjacentHTML('beforeend', getImageMarkup(images.hits));
  createLightbox();
}

function getImageMarkup(image) {
  const markup = image
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views:</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments:</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>
      ${downloads}
    </p>
  </div>
</div>
</a>`;
      }
    )
    .join('');
  return markup;
}
