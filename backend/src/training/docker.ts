import * as Docker from "dockerode";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";

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
'''
Stolen shamelessly from https://github.com/fchollet/keras/blob/master/examples/mnist_cnn.py
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
epochs = 10

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

# convert class vectors to binary class matrices
y_train = keras.utils.to_categorical(y_train, num_classes)
y_test = keras.utils.to_categorical(y_test, num_classes)
`,
        epilogue: `
# Callback for printing out stats after epochs
from keras.callbacks import Callback
import sys

class LoggingCallback(Callback):
    def on_train_begin(self, logs={}):
        print("Begin Training Model")
        sys.stdout.flush()

    def on_epoch_begin(self, epoch, logs={}):
        print("Training Epoch {}/{}:   ".format(1+epoch, epochs))
        sys.stdout.flush()

    def on_epoch_end(self, epoch, logs={}):
        print("    |-- loss={:.4g}".format(logs['loss']))
        print("    |-- accu={:.4g}".format(logs['acc']))
        sys.stdout.flush()

log_callback = LoggingCallback()

model.fit(x_train, y_train,
          batch_size=batch_size,
          epochs=epochs,
          verbose=0,
          validation_data=(x_test, y_test),
          callbacks=[log_callback])
score = model.evaluate(x_test, y_test, verbose=0)
print("")
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

export function ensureImage(image: string): Promise<{}> {
    return new Promise<{}>((resolve, reject) => {
        docker.pull(image, {})
            .then(_ => resolve())
            .catch(error => reject(error));
    });
}

export function startTraining(code: string, dataset: string): Promise<ContainerID> {
    return new Promise<string>((resolve, reject) => {
        // Write the temp file out inside of the user's home directory, make sure that this thing exists.
        const tmpDir = path.join(os.homedir(), "tmp");
        fs.mkdirpSync(tmpDir); // Ensure the directory exists.

        const prefix = path.join(tmpDir, "axon-");
        fs.mkdtemp(prefix, (err, folder) => {
            if (err) {
                return reject(err);
            }

            // Write the file out to disk.
            const train_name = folder + "/train.py";
            const preamble = DATASETS[dataset].preamble || "MISSING!";
            const epilogue = DATASETS[dataset].epilogue || "MISSING!";

            fs.writeFile(train_name, preamble + code + epilogue, (err) => {
                if (err) {
                    return reject(err);
                }

                // Start up training, return the container ID
                // Note: name of the dataset is expected as an argument to the training script
                const volumes: any = {};
                volumes[folder] = {};

                const hostConfig = {
                    Binds: [`${folder}:/axon`],
                };

                docker.createContainer({
                    Image: IMAGE,
                    Cmd: ["python", "/axon/train.py", dataset],
                    Volumes: volumes,
                    HostConfig: hostConfig,
                }, function(err, container) {
                    if (err || !container) {
                        reject(err);
                    } else {
                        container.start({}, function(err, data) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(container.id);
                            }
                        });
                    }
                });
            });
        });
    });
}

// Export an interface for watching the output of container.
export function watchContainer(
        containerId: ContainerID,
        onfail: (reason: any) => void,
        ondata: (chunk: string) => void,
        onclose?: () => void): void {
    const container = docker.getContainer(containerId);
    container.logs({
        stdout: true,
        stderr: false,
        follow: true,
    })
    .then(res => {
        res.on("data", ondata);
        res.on("end", () => {
            if (onclose) {
                onclose();
            }
        });
    }).catch(err => onfail(err));
}
