const { dml, query, cleanup } = require('@eunmo/mysql');
const {
  addWork,
  editWork,
  addAgent,
  editAgent,
  removeAgent,
  addLinks,
  removeLink,
} = require('./dml');

afterAll(async () => {
  await cleanup();
});

beforeEach(async () => {
  await dml('TRUNCATE TABLE work');
  await dml('TRUNCATE TABLE agent');
  await dml('TRUNCATE TABLE link');
});

const title = 'title';
const type = 'a';
const released = new Date(Date.UTC(2020, 3, 5)); // 2020-04-05 00:00:00
const done = new Date(Date.UTC(2022, 4, 6, 7, 8, 9)); // 2022-05-06 07:08:09
const detail = { x: 'y' };
const name = 'name';

test('add one work', async () => {
  await addWork(title, type, released, done, detail);
  const rows = await query('SELECT * FROM work');
  expect(rows.length).toBe(1);
  const [row] = rows;
  expect(row.title).toStrictEqual(title);
  expect(row.type).toStrictEqual(type);
  expect(row.released.toISOString()).toStrictEqual('2020-04-05T00:00:00.000Z');
  expect(row.done.toISOString()).toStrictEqual('2022-05-06T07:08:09.000Z');
  expect(JSON.parse(row.detail)).toStrictEqual(detail);
});

test('edit one work', async () => {
  await addWork(title, type, released, done, detail);
  let rows = await query('SELECT * FROM work');
  expect(rows.length).toBe(1);
  let [row] = rows;
  expect(row.title).toStrictEqual(title);
  expect(row.type).toStrictEqual(type);
  expect(row.released.toISOString()).toStrictEqual('2020-04-05T00:00:00.000Z');
  expect(row.done.toISOString()).toStrictEqual('2022-05-06T07:08:09.000Z');
  expect(JSON.parse(row.detail)).toStrictEqual(detail);

  const { id } = row;
  const newTitle = 'title 2';
  const newType = 'b';
  const newReleased = new Date(Date.UTC(2021, 4, 6)); // 2021-05-06 00:00:00
  const newDone = new Date(Date.UTC(2023, 5, 7, 8, 9, 10)); // 2023-06-07 08:09:10
  const newDetail = { y: 'x' };
  await editWork(id, newTitle, newType, newReleased, newDone, newDetail);
  rows = await query('SELECT * FROM work');
  expect(rows.length).toBe(1);
  [row] = rows;
  expect(row.title).toStrictEqual(newTitle);
  expect(row.type).toStrictEqual(newType);
  expect(row.released.toISOString()).toStrictEqual('2021-05-06T00:00:00.000Z');
  expect(row.done.toISOString()).toStrictEqual('2023-06-07T08:09:10.000Z');
  expect(JSON.parse(row.detail)).toStrictEqual(newDetail);

  await editWork(id, title, type, released, done, null);
  [row] = await query('SELECT * FROM work');
  expect(JSON.parse(row.detail)).toStrictEqual(null);
});

test('add one agent', async () => {
  await addAgent(name, type, detail);
  const rows = await query('SELECT * FROM agent');
  expect(rows.length).toBe(1);
  const [row] = rows;
  expect(row.name).toStrictEqual(name);
  expect(row.type).toStrictEqual(type);
  expect(JSON.parse(row.detail)).toStrictEqual(detail);
});

test('edit one agent', async () => {
  await addAgent(name, type, detail);
  let rows = await query('SELECT * FROM agent');
  expect(rows.length).toBe(1);
  let [row] = rows;
  expect(row.name).toStrictEqual(name);
  expect(row.type).toStrictEqual(type);
  expect(JSON.parse(row.detail)).toStrictEqual(detail);

  const { id } = row;
  const newName = 'name 2';
  const newType = 'b';
  const newDetail = { y: 'x' };
  await editAgent(id, newName, newType, newDetail);
  rows = await query('SELECT * FROM agent');
  expect(rows.length).toBe(1);
  [row] = rows;
  expect(row.name).toStrictEqual(newName);
  expect(row.type).toStrictEqual(newType);
  expect(JSON.parse(row.detail)).toStrictEqual(newDetail);
});

test('remove one agent', async () => {
  await addAgent(name, type, detail);
  let rows = await query('SELECT * FROM agent');
  expect(rows.length).toBe(1);

  const [{ id }] = rows;
  await removeAgent(id);
  rows = await query('SELECT * FROM agent');
  expect(rows.length).toBe(0);
});

test('add links', async () => {
  const { insertId: workId } = await addWork(title, type, released, done, null);
  const { insertId: agentId1 } = await addAgent(name, type, detail);
  const { insertId: agentId2 } = await addAgent(name, type, detail);
  const agentIds = [{ agentId: agentId1, detail }, { agentId: agentId2 }];
  await addLinks(workId, agentIds);
  const rows = await query('SELECT * FROM link');
  expect(rows.length).toBe(2);
});

test('remove link', async () => {
  const { insertId: workId } = await addWork(title, type, released, done, null);
  const { insertId: agentId1 } = await addAgent(name, type, detail);
  const { insertId: agentId2 } = await addAgent(name, type, detail);
  const agentIds = [{ agentId: agentId1, detail }, { agentId: agentId2 }];
  await addLinks(workId, agentIds);
  let rows = await query('SELECT * FROM link');
  expect(rows.length).toBe(2);

  await removeLink(workId, agentId1);
  rows = await query('SELECT * FROM link');
  expect(rows.length).toBe(1);

  await removeLink(workId, agentId2);
  rows = await query('SELECT * FROM link');
  expect(rows.length).toBe(0);
});
