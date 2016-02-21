import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import assert from 'power-assert';
import superagent from 'superagent';

import Hello from '../app/webpack/component/Hello.jsx';

describe('main', () => {

  let server;

  before(() => {
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

    const rendered = TestUtils.renderIntoDocument(<Hello />);
    const elem = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'div');
    assert(elem.length === 1);
    assert(elem[0].textContent === 'おまちください');

    server.respond();

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const elem = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'div');
          assert(elem.length === 1);
          assert(elem[0].textContent === 'こんにちは、世界！');
        } catch (e) {
          reject(e);
        }

        resolve();
      }, 0);
    });
  });
  it('あいさつをあきらめる', () => {
    const rendered = TestUtils.renderIntoDocument(<Hello />);

    const spy = sinon.spy(rendered.promise, "cancel");
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(rendered).parentNode);  

    assert(spy.calledOnce);
  });
});
