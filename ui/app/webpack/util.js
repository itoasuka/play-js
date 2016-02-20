import superagent from 'superagent';
import superagentPromisePlugin from 'superagent-promise-plugin';

export function greeting() {
  return superagent
    .get('/0/greeting')
    .use(superagentPromisePlugin)
    .end()
    .then((response) => {
      return JSON.parse(response.text);
    });
}
