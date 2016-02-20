import assert from 'power-assert';

describe('main', () => {

  let server;

  before(() => {
    document.body.innerHTML = window.__html__["test/fixtures/base.html"];
    server = sinon.fakeServer.create();
  });
    
  after(() => {
    server.restore();
    server = null;
  });

  it('あいさつをする', () => {
    const head = {
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
      greeting: 'こんにちは、世界！'
    });

    server.respondWith('GET', /\/0\/greeting$/, [ 200, head, body ]);
    
    const result = require('../app/main');

    server.respond();

    return result.default.then(() => {
      const elem = document.getElementById('greeting');
      assert(elem.innerHTML === 'こんにちは、世界！');
    });
  });
});
