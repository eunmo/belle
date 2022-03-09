USE belle;

CREATE TABLE work (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  released DATE NOT NULL,
  done DATE,
  PRIMARY KEY (id)
);

CREATE TABLE agent (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type CHAR(1) NOT NULL,
  detail JSON NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE link (
  workId INT NOT NULL,
  agentId INT NOT NULL,
  CONSTRAINT link_work_fk FOREIGN KEY (workId) REFERENCES work(id) ON DELETE CASCADE,
  CONSTRAINT link_agent_fk FOREIGN KEY (agentId) REFERENCES agent(id) ON DELETE CASCADE
);