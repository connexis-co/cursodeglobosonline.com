-- Votos de estrellas (1-5) de los cursos, estilo kk Star Ratings.
--
-- Un voto por navegador y curso, actualizable: `voter` = HMAC-SHA256(RATING_SALT, UUID
-- aleatorio guardado en el localStorage del navegador). `ip_hash` = HMAC de la IP (prefijo
-- /64 en IPv6) y solo sirve para limitar cuántos votantes distintos puede haber por IP y
-- curso. No se guarda ninguna IP en claro.
CREATE TABLE IF NOT EXISTS course_votes (
  course     TEXT    NOT NULL,
  voter      TEXT    NOT NULL,
  ip_hash    TEXT    NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  country    TEXT,
  created_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  PRIMARY KEY (course, voter)
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS idx_course_votes_ip ON course_votes (course, ip_hash);
