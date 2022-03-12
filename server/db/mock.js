const { dml, cleanup } = require('@eunmo/mysql');
const { addWork, addAgent, addLinks } = require('./dml');

const work1 = [
  'title 1',
  'a',
  3,
  new Date(Date.UTC(2020, 3, 5)), // 2020-04-05 00:00:00
  new Date(Date.UTC(2022, 4, 6, 7, 8, 9)), // 2022-05-06 07:08:09
  { x: 'y' },
];
const work2 = [
  'title 2',
  'a',
  5,
  new Date(Date.UTC(2020, 3, 5)), // 2020-04-05 00:00:00
  new Date(Date.UTC(2022, 4, 6, 7, 8, 9)), // 2022-05-06 07:08:09
  { x: 'y' },
];
const work3 = [
  'title 3',
  'b',
  null,
  new Date(Date.UTC(2020, 3, 5)), // 2020-04-05 00:00:00
  new Date(Date.UTC(2022, 4, 6, 7, 8, 9)), // 2022-05-06 07:08:09
  null,
];

const agent1 = ['name 1', '이름 1', 'e', { y: 'z' }];
const agent2 = ['name 2', '이름 2', 'f', { y: 'z' }];
const agent3 = ['name 3', null, 'g', null];

const linkDetail1 = { z: 'a' };

async function prepare() {
  await dml('TRUNCATE TABLE work');
  await dml('TRUNCATE TABLE agent');
  await dml('TRUNCATE TABLE link');

  const { insertId: workId1 } = await addWork(...work1);
  const { insertId: workId2 } = await addWork(...work2);
  const { insertId: workId3 } = await addWork(...work3);

  const { insertId: agentId1 } = await addAgent(...agent1);
  const { insertId: agentId2 } = await addAgent(...agent2);
  const { insertId: agentId3 } = await addAgent(...agent3);

  await addLinks(workId1, [
    { agentId: agentId1, detail: linkDetail1 },
    { agentId: agentId3 },
  ]);
  await addLinks(workId2, [{ agentId: agentId2, detail: linkDetail1 }]);
  await addLinks(workId3, [{ agentId: agentId3 }]);

  return { workId1, workId2, workId3, agentId1, agentId2, agentId3 };
}

module.exports = { prepare, cleanup };
