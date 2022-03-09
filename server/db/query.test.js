const { getWorksByType, getWork, getAgentsByWorkId } = require('./query');
const { prepare, cleanup } = require('./mock');

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

function arrayMatches(array1, array2) {
  expect(array1).toEqual(expect.arrayContaining(array2));
  expect(array2).toEqual(expect.arrayContaining(array1));
}

test('get works by type', async () => {
  let rows = await getWorksByType('a');
  expect(rows.length).toBe(2);
  arrayMatches(
    rows.map(({ id }) => id),
    [workId1, workId2]
  );

  rows = await getWorksByType('b');
  expect(rows.length).toBe(1);
  arrayMatches(
    rows.map(({ id }) => id),
    [workId3]
  );
});

test('get work', async () => {
  let row = await getWork(workId1);
  expect(row.id).toBe(workId1);
  expect(row.x).toStrictEqual('y');

  row = await getWork(workId2);
  expect(row.id).toBe(workId2);
  expect(row.x).toStrictEqual('y');

  row = await getWork(workId3);
  expect(row.id).toBe(workId3);
  expect(row.x).toBe(undefined);
});

test('get agents by work id', async () => {
  let rows = await getAgentsByWorkId(workId1);
  expect(rows.length).toBe(2);
  arrayMatches(
    rows.map(({ id }) => id),
    [agentId1, agentId3]
  );
  let row = rows.find(({ id }) => id === agentId1);
  expect(row.z).toStrictEqual('a');
  row = rows.find(({ id }) => id === agentId3);
  expect(row.z).toBe(undefined);

  rows = await getAgentsByWorkId(workId2);
  expect(rows.length).toBe(1);
  arrayMatches(
    rows.map(({ id }) => id),
    [agentId2]
  );

  rows = await getAgentsByWorkId(workId3);
  expect(rows.length).toBe(1);
  arrayMatches(
    rows.map(({ id }) => id),
    [agentId3]
  );
});
