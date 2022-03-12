const request = require('supertest');
const { prepare, cleanup } = require('../db/mock');
const app = require('../app');

let workId1;
let workId2;
let workId3;
let agentId1;
let agentId2;
let agentId3;

beforeAll(async () => {
  ({ workId1, workId2, workId3, agentId1, agentId2, agentId3 } =
    await prepare());
});

afterAll(async () => {
  await cleanup();
});

async function get(url) {
  const { body, statusCode } = await request(app).get(url);
  expect(statusCode).toBe(200);
  return body;
}

function arrayMatches(array1, array2) {
  expect(array1).toEqual(expect.arrayContaining(array2));
  expect(array2).toEqual(expect.arrayContaining(array1));
}

test('get all works by type', async () => {
  let works = await get('/api/work/type/a');
  expect(works.length).toBe(2);
  arrayMatches(
    works.map(({ id }) => id),
    [workId1, workId2]
  );

  works = await get('/api/work/type/b');
  expect(works.length).toBe(1);
  arrayMatches(
    works.map(({ id }) => id),
    [workId3]
  );
});

test('get work by id', async () => {
  let work = await get(`/api/work/id/${workId1}`);
  expect(work.work.id).toBe(workId1);
  arrayMatches(
    work.agents.map(({ id }) => id),
    [agentId1, agentId3]
  );

  work = await get(`/api/work/id/${workId2}`);
  expect(work.work.id).toBe(workId2);
  arrayMatches(
    work.agents.map(({ id }) => id),
    [agentId2]
  );

  work = await get(`/api/work/id/${workId3}`);
  expect(work.work.id).toBe(workId3);
  arrayMatches(
    work.agents.map(({ id }) => id),
    [agentId3]
  );
});
