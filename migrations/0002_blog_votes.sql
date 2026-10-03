-- Blog votes are separate from course reviews. post_id is the stable EmDash ID,
-- validated against published blog entries by the API before writing.
CREATE TABLE IF NOT EXISTS blog_votes (
  post_id    TEXT NOT NULL,
  voter      TEXT NOT NULL,
  ip_hash    TEXT NOT NULL,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  country    TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  PRIMARY KEY (post_id, voter)
) WITHOUT ROWID;
CREATE INDEX IF NOT EXISTS idx_blog_votes_ip ON blog_votes (post_id, ip_hash);
