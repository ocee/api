DROP TABLE IF EXISTS license;
CREATE TABLE license
(
  license_id UUID NOT NULL,
  license_hash TEXT UNIQUE NOT NULL,
  rating INTEGER DEFAULT 0,

  CONSTRAINT license_id PRIMARY KEY (license_id)
);

CREATE INDEX ix_license_hash ON license (license_hash);


--insert sample data into table
INSERT INTO license ('license_id', 'license_hash', 'rating') VALUES ('123','84e3e8ea-9076-496d-aaed-4d90daa27e42',5)
