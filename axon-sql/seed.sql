-- Seed the database with some fake user data (Fake News!)

-- Password for root is 'root'
INSERT INTO users VALUES (0, 'Administrator', 'root', '$2a$10$rVOOqaTxwGrffy.2Z6ur3.dlW.3FeFUndaFfrHTckNn5cbLT56J0W');

-- Password for user1 is 'user1'
INSERT INTO users VALUES (1, 'Regular User', 'user1', '$2a$10$0FlfWR4Y7l0KXQAEHwCRNu2lyQOAyp.yJoJiSwYZqDkUN9ahBquJ.');

-- Create some models for the users
INSERT INTO models VALUES (0, 'root-net', 0, NULL);
INSERT INTO models VALUES (1, 'user1-net', 1, NULL);
INSERT INTO models VALUES (2, 'root-net', 1, 0); -- Fork of root/root-net by user1

-- Star the models
INSERT INTO stars (userid, modelid) VALUES (0, 0);
INSERT INTO stars (userid, modelid) VALUES (0, 1);
INSERT INTO stars (userid, modelid) VALUES (1, 1);
INSERT INTO stars (userid, modelid) VALUES (1, 2);
