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
export function startTraining(code: string, dataset: string): Promise<ContainerID> {
    return new Promise<string>((resolve, reject) => {
		// Write the temp file out.
        fs.mkdtemp("/Users/andrew/tmp/axon-", (err, folder) => {
            if (err) {
                return reject(err);
            }

            // Write the file out to disk.
            const train_name = folder + "/train.py";
            fs.open(train_name, "0600", (err, fd) => {
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
