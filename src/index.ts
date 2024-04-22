import { Api } from './components/base/api';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

const api = new Api(API_URL);
const root = ensureElement<HTMLElement>('main.gallery');
