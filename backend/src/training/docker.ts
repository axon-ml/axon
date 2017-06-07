import * as Docker from "dockerode";
import * as fs from "fs";

const docker = new Docker();

export type ContainerID = string;

// Name of the image
const IMAGE = "andreweduffy/keras";

/**
 * Start training a model with the given code and dataset.
 *
 * First writes the code out to a temporary file, which is mounted as a volume
 * by the docker container.
 *
 * Returns a Promise fulfilled with the ID of the spawned container
 */

interface DatasetMap {
    [key: string]: Dataset;
}
interface Dataset {
    preamble: string;
    epilogue: string;
}

const DATASETS: DatasetMap = {
    mnist: {
        preamble: `
'''Trains a simple convnet on the MNIST dataset.

Gets to 99.25% test accuracy after 12 epochs
(there is still a lot of margin for parameter tuning).
16 seconds per epoch on a GRID K520 GPU.
'''

from __future__ import print_function
import keras
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K

batch_size = 128
num_classes = 10
epochs = 12

# input image dimensions
img_rows, img_cols = 28, 28

# the data, shuffled and split between train and test sets
(x_train, y_train), (x_test, y_test) = mnist.load_data()

if K.image_data_format() == 'channels_first':
    x_train = x_train.reshape(x_train.shape[0], 1, img_rows, img_cols)
    x_test = x_test.reshape(x_test.shape[0], 1, img_rows, img_cols)
    input_shape = (1, img_rows, img_cols)
else:
    x_train = x_train.reshape(x_train.shape[0], img_rows, img_cols, 1)
    x_test = x_test.reshape(x_test.shape[0], img_rows, img_cols, 1)
    input_shape = (img_rows, img_cols, 1)

x_train = x_train.astype('float32')
x_test = x_test.astype('float32')
x_train /= 255
x_test /= 255
print('x_train shape:', x_train.shape)
print(x_train.shape[0], 'train samples')
print(x_test.shape[0], 'test samples')

# convert class vectors to binary class matrices
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)
`,
        epilogue: `
model.fit(x_train, y_train,
          batch_size=batch_size,
          epochs=epochs,
          verbose=0,
          validation_data=(x_test, y_test))
score = model.evaluate(x_test, y_test, verbose=0)
print('Test loss:', score[0])
print('Test accuracy:', score[1])
`,
    },

    // CIFAR-10 information.
    cifar10: {
        preamble: `
`,
        epilogue: `
`,
    },
};

export function startTraining(code: string, dataset: string): Promise<ContainerID> {
    return new Promise<string>((resolve, reject) => {
		// Write the temp file out.
        fs.mkdtemp("/Users/andrew/tmp/axon-", (err, folder) => {
            if (err) {
                return reject(err);
            }

            // Write the file out to disk.
            const train_name = folder + "/train.py";
            const preamble = DATASETS[dataset].preamble || "MISSING!";
            const epilogue = DATASETS[dataset].epilogue || "MISSING!";

            fs.writeFile(train_name, preamble + code + epilogue, {flag: "0600"}, (err) => {
                if (err) {
                    return reject(err);
                }

                // Start up training, return the container ID
                // Note: name of the dataset is expected as an argument to the training script
                docker.createContainer({
                    Image: IMAGE,
                    Cmd: ["python", "/train.py", dataset],
                    Volumes: {
                        train_name: {},
                    },
                    HostConfig: {
                        Binds: [`${train_name}:/train.py`],
                    },
                })
                .then(res => resolve(res.id))
                .catch(err => reject(err));
            });
        });
    });
}

// Export an interface for watching the output of container.
export function watchContainer(containerId: ContainerID, onfail: (reason: any) => void, ondata: (chunk: string) => void): void {
    const container = docker.getContainer(containerId);
    container.logs({
        stdout: true,
        stderr: true,
        follow: true,
    })
    .then(res => res.on("data", ondata))
    .catch(err => onfail(err));
}
