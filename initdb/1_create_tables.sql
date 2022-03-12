USE belle;

CREATE TABLE work (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  type CHAR(1) NOT NULL,
  stars TINYINT,
  released DATE NOT NULL,
  done DATETIME,
  detail JSON,
  PRIMARY KEY (id),
  KEY (type)
);

CREATE TABLE agent (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  korean VARCHAR(255),
  type CHAR(1) NOT NULL,
  detail JSON NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE link (
  workId INT NOT NULL,
  agentId INT NOT NULL,
  detail JSON,
  CONSTRAINT link_work_fk FOREIGN KEY (workId) REFERENCES work(id) ON DELETE CASCADE,
  CONSTRAINT link_agent_fk FOREIGN KEY (agentId) REFERENCES agent(id) ON DELETE CASCADE,
  PRIMARY KEY (workId, agentId)
);
