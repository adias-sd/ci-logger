# CI Log File Viewer API

This folder contains all the files required to run the API for the CI Log Viewer App. You will find instructions on developing and updating it here.

## Features

1. Lists files under the `logs` directory in the repository root
2. Efficiently reads files from the aforementioned directory
3. Using FastAPI - fully OpenAPI compliant out of the box (check out the http://localhost:8000/docs endpoint for a Swagger doc)

## Getting Started

### Requirements

1. Python 3.11+ (potentially 3.8 should work)

###  Installation

Install the dependencies (consider creating a virtual environment first, cleaner but not mandatory):

```bash
pip install -r requirements.txt
```

### Running the application

Start a `uvicorn` instance that serves the app

```bash
uvicorn api:fastapi_app --port 8000
```

This should block your console and serve the API, which you should be able to reach with commands to the local port

### Docker

This application was tested in Linux using Docker and local deployment could still fail. As such a Dockerfile is provided for Docker deployment along with instructions:

1. Build the image: `docker build -t <image_tag> .`
2. Run the image in a container: `docker run -p 8000:8000 -v <absolute_path_to_logs_folder>:/logs ci-log-viewer`

This approach can also be used if a different `logs` folder is required. 

## TODOs

1. Use an environment variable for the logs folder
2. Allow for a dynamic port allocation - to sync with frontend
3. Create a `docker compose` ready image to be used with the frontend