-- Seed the database with some fake user data (Fake News!)

-- Password for root is 'root'
INSERT INTO users VALUES (DEFAULT, 'Administrator', 'root', '$2a$10$rVOOqaTxwGrffy.2Z6ur3.dlW.3FeFUndaFfrHTckNn5cbLT56J0W');

-- Password for user1 is 'user1'
INSERT INTO users VALUES (DEFAULT, 'Regular User', 'user1', '$2a$10$0FlfWR4Y7l0KXQAEHwCRNu2lyQOAyp.yJoJiSwYZqDkUN9ahBquJ.');

-- -- Create some models for the users
-- INSERT INTO models (id, name, owner, parent, repr, version) VALUES (0, 'root-net', 0, NULL, NULL, 1);
-- INSERT INTO models (id, name, owner, parent, repr, version) VALUES (1, 'user1-net', 1, NULL, NULL, 1);
-- INSERT INTO models (id, name, owner, parent, repr, version) VALUES (2, 'root-net', 1, 0, '', 1); -- Fork of root/root-net by user1

-- -- Star the models
-- INSERT INTO stars (userid, modelid) VALUES (0, 0);

-- Create some models for the users
INSERT INTO models (id, name, owner, parent, repr, version, markdown) VALUES (DEFAULT, 'mnist_mlp', 1, NULL, '{"layers":[{"name":"layer0","kind":"Flatten","params":{}},{"name":"layer1","kind":"FullyConnected","params":{"activation":"relu","output_units":512}},{"name":"layer2","kind":"FullyConnected","params":{"activation":"relu","output_units":512}},{"name":"layer3","kind":"FullyConnected","params":{"activation":"softmax","output_units":10}}],"input":[28,28,1],"loss":"xent","optimizer":"adam","connections":[{"head":"layer0","tail":"layer3"}]}', 1, '# MNIST MLP Model

MNIST is a handwritten digit recognition problem. There are thus ten possibly classes that we need to distinguish between.


## MLP

MLP stands for **Multi-Layer Perceptron**, which effectively is a simple neural network structure
that contains several activation layers in series followed by a classification output.

On the right, we can see that this is displayed as multiple fully connected layers with [ReLU](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)) activations,
followed by a final [softmax](https://en.wikipedia.org/wiki/Softmax_function) layer to gather output probabilities.

`xent` indicates we are using the categorical cross-entropy as our loss function, and we can also see we''re using the Adam optimizer,
a successor to SGD that has better convergence properties.');


INSERT INTO models (id, name, owner, parent, repr, version, markdown) VALUES (DEFAULT, 'mnist_mlp', 2, 1, '{"layers":[{"name":"layer0","kind":"Flatten","params":{}},{"name":"layer1","kind":"FullyConnected","params":{"activation":"relu","output_units":512}},{"name":"layer2","kind":"FullyConnected","params":{"activation":"relu","output_units":512}},{"name":"layer3","kind":"FullyConnected","params":{"activation":"softmax","output_units":10}}],"input":[28,28,1],"loss":"xent","optimizer":"adam","connections":[{"head":"layer0","tail":"layer3"}]}', 1, '# MNIST MLP Model

MNIST is a handwritten digit recognition problem. There are thus ten possibly classes that we need to distinguish between.


## MLP

MLP stands for **Multi-Layer Perceptron**, which effectively is a simple neural network structure
that contains several activation layers in series followed by a classification output.

On the right, we can see that this is displayed as multiple fully connected layers with [ReLU](https://en.wikipedia.org/wiki/Rectifier_(neural_networks)) activations,
followed by a final [softmax](https://en.wikipedia.org/wiki/Softmax_function) layer to gather output probabilities.

`xent` indicates we are using the categorical cross-entropy as our loss function, and we can also see we''re using the Adam optimizer,
a successor to SGD that has better convergence properties.');


INSERT INTO models (id, name, owner, parent, repr, version, markdown) VALUES (DEFAULT, 'mnist_rnn', 1, NULL, '{"layers":[{"name":"layer0","kind":"RNN","params":{"activation":"relu","output_units":100}},{"name":"layer1","kind":"FullyConnected","params":{"activation":"softmax","output_units":10}}],"input":[784,1],"loss":"xent","optimizer":"adagrad"}', 1, '
# RNN Model

Implementation of an RNN for the MNIST dataset.
');

-- Star the models
INSERT INTO stars (userid, modelid) VALUES (2, 2);
