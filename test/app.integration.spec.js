const request = require('supertest');
const app = require('../app');
const connection = require('../connection');


describe('Test routes', () => {

    describe('GET /bookmarks/:id', () => {
        const testBookmark = { url: 'https://nodejs.org/', title: 'Node.js' };
        beforeEach((done) => connection.query(
          'TRUNCATE bookmark', () => connection.query(
            'INSERT INTO bookmark SET ?', testBookmark, done
          )
        ));
        it('GET / Bookmark not found', (done) => {
            request(app)
            .get('/bookmarks/9')
            .expect(404)
            .expect('Content-Type', /json/)
            .then(response => {
                const expected = { error: 'Bookmark not found' };
                expect(response.body).toEqual(expected);
                done();
            })
        });
        it('GET / get bookmark as json', done => {
            request(app)
            .get('/bookmarks/1')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(response => {
                const expected = { id: 1, title: "Node.js", url:"https://nodejs.org/" };
                expect(response.body).toEqual(expected);
                done();
            })
        })
      
        
      });

    beforeEach(done => connection.query('TRUNCATE bookmark', done));
  it('GET / sends "Hello World" as json', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { message: 'Hello World!'};
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks - error (fields missing) ', (done) => {
    request(app)
      .post('/bookmarks')
      .send({})
      .expect(422)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { error: 'required field(s) missing' };
        expect(response.body).toEqual(expected);
        done();
      });
  });

  it('POST /bookmarks - OK (fields provided) ', (done) => {
    request(app)
      .post('/bookmarks')
      .send({ url: 'https://jestjs.io', title: 'Jest' })
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        const expected = { id: 1, url: 'https://jestjs.io', title: 'Jest' };
        expect(response.body).toEqual(expected);
        done();
      })
      .catch(done);
  });
});