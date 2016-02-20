import "babel-polyfill";
import { greeting } from './util';
import './main.scss';

const result = greeting()
  .then((response) => {
    const elem = document.getElementById('greeting');
    elem.innerHTML = response.greeting;
  });
export default result;

