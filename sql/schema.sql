CREATE DATABASE IF NOT EXISTS metadb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE metadb;

DROP TABLE IF EXISTS jsontest;
CREATE TABLE jsontest (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  description JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- columnas generadas para rendimiento
  camera_model VARCHAR(120) GENERATED ALWAYS AS (JSON_UNQUOTE(description->'$.camera.model')) STORED,
  width INT GENERATED ALWAYS AS (JSON_EXTRACT(description,'$.dimensions.width')) STORED,
  height INT GENERATED ALWAYS AS (JSON_EXTRACT(description,'$.dimensions.height')) STORED
);

CREATE INDEX ix_camera_model ON jsontest (camera_model);
CREATE INDEX ix_width ON jsontest (width);
CREATE INDEX ix_height ON jsontest (height);
CREATE INDEX ix_created_at ON jsontest (created_at);
