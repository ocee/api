DROP TABLE IF EXISTS ocee_user;
CREATE TABLE ocee_user
(
  ocee_user_id UUID NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL DEFAULT 0,
  profile json NULL,

  CONSTRAINT ocee_user_id PRIMARY KEY (ocee_user_id)
);
CREATE INDEX ix_ocee_user_email ON ocee_user (email);

DROP TABLE IF EXISTS device;
CREATE TABLE device
(
  device_id TEXT NOT NULL,

  CONSTRAINT device_id PRIMARY KEY (device_id)
);

DROP TABLE IF EXISTS license;
CREATE TABLE license
(
  license_id UUID NOT NULL,
  license_hash TEXT UNIQUE NOT NULL,
  rating INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT license_id PRIMARY KEY (license_id)
);
CREATE INDEX ix_license_license_hash ON license (license_hash);

DROP FUNCTION IF EXISTS upsert(TEXT,UUID,INTEGER);
CREATE FUNCTION upsert(hash TEXT, id UUID, delta INTEGER) RETURNS VOID AS
$$
BEGIN
    LOOP
        -- first try to update the key
        -- note that "a" must be unique
        UPDATE license SET rating = rating + delta WHERE license_hash = hash;
        IF found THEN
            RETURN;
        END IF;
        -- not there, so try to insert the key
        -- if someone else inserts the same key concurrently,
        -- we could get a unique-key failure
        BEGIN
            INSERT INTO license (license_hash, license_id, rating) VALUES (hash, id, delta);
            RETURN;
        EXCEPTION WHEN unique_violation THEN
            -- do nothing, and loop to try the UPDATE again
        END;
    END LOOP;
END;
$$
LANGUAGE plpgsql;


--insert sample data into table
INSERT INTO license (license_id, license_hash, rating) VALUES ('84e3e8ea-9076-496d-aaed-4d90daa27e42','123',5);
--password is 123
INSERT INTO ocee_user (ocee_user_id, email, password, profile) VALUES ('84e3e8ea-9076-496d-aaed-4d90daa27e42','tqn222@yahoo.com','$2a$10$vKzFdD1fhGD/pRvSOyc9JOAlCLXvBgU.K3wBCCv9cqFPAFq9lESh2','{"name": "tuan"}');
