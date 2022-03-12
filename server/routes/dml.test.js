const { dml, cleanup } = require('@eunmo/mysql');
const request = require('supertest');
const app = require('../app');
const { prepare } = require('../db/mock');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE work');
  await dml('TRUNCATE TABLE agent');
  await dml('TRUNCATE TABLE link');
});

async function get(url) {
  const { body, statusCode } = await request(app).get(url);
  expect(statusCode).toBe(200);
  return body;
}

const baseUrl = '/api/crud';

async function del(url, body) {
  const { statusCode } = await request(app)
    .delete(`${baseUrl}/${url}`)
    .send(body);
  expect(statusCode).toBe(200);
}

async function post(url, body) {
  const { body: res, statusCode } = await request(app)
    .post(`${baseUrl}/${url}`)
    .send(body);
  expect(statusCode).toBe(200);
  return res;
}

async function put(url, body) {
  const { statusCode } = await request(app).put(`${baseUrl}/${url}`).send(body);
  expect(statusCode).toBe(200);
}

function toDate(date) {
  return date.toISOString().substring(0, 10);
}

function toDatetime(date) {
  return date.toISOString().substring(0, 19).replace('T', ' ');
}

const [title, type, stars, released, done, detail] = [
  'title 1',
  'a',
  3,
  new Date(Date.UTC(2020, 3, 5)), // 2020-04-05 00:00:00
  new Date(Date.UTC(2022, 4, 6, 7, 8, 9)), // 2022-05-06 07:08:09
  { x: 'y' },
];

test('create work', async () => {
  const { id } = await post('work', {
    title,
    type,
    stars,
    released: toDate(released),
    done: toDatetime(done),
    detail,
  });
  const body = await get(`/api/work/id/${id}`);
  expect(body.work.id).toBe(id);
  expect(body.work.title).toBe(title);
  expect(body.work.stars).toBe(stars);
  expect(body.work.released).toBe(released.toISOString());
  expect(body.work.done).toBe(done.toISOString());
  expect(body.work.x).toBe(detail.x);
  expect(body.agents).toStrictEqual([]);
});

test('edit work', async () => {
  const { id } = await post('work', {
    title,
    type,
    stars,
    released: toDate(released),
    done: toDatetime(done),
    detail,
  });

  const newTitle = 'title 2';
  const newType = 'b';
  const newStars = 4;
  const newReleased = new Date(Date.UTC(2021, 4, 6)); // 2021-05-06 00:00:00
  const newDone = new Date(Date.UTC(2023, 5, 7, 8, 9, 10)); // 2023-06-07 08:09:10
  const newDetail = { y: 'x' };
  await put('work', {
    id,
    title: newTitle,
    type: newType,
    stars: newStars,
    released: toDate(newReleased),
    done: toDatetime(newDone),
    detail: newDetail,
  });

  const body = await get(`/api/work/id/${id}`);
  expect(body.work.id).toBe(id);
  expect(body.work.title).toBe(newTitle);
  expect(body.work.stars).toBe(newStars);
  expect(body.work.released).toBe(newReleased.toISOString());
  expect(body.work.done).toBe(newDone.toISOString());
  expect(body.work.y).toBe(newDetail.y);
  expect(body.agents).toStrictEqual([]);
});
