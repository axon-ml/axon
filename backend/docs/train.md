Training
=========

Training is done within the confines of a Docker container that contains a Keras installation along with the proper version of Python 3.

Code is shipped to the backend, which when writes the file to a location where it can be read by Docker. The compiled Python is grafted with some bootstrap training code that is then written out to `/train.py` inside of the container. This file is then executed.

The logs of the container are tailed and available over an (unauthenticated) websocket connection. Adding authentication here is simple enough, it just requires shipping a secret token to the Websocket which is then checked against the database before anything gets done. Or perhaps the token is better kept in some form of in-memory storage (I guess this isn't Twitter so who cares).

Steps to make this work:

* Log tailing from Docker container
    * On the frontend, make the output HTML friendly. Not sure how much better this can get.
* Starting Docker training
    * Knowing when the container dies or gets killed, we should be able to clean that up.
