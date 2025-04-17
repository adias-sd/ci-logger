# CI Log Viewer

Full stack application to serve log files in a memory efficient way

## What is in this repo?

### Frontend

A [folder](frontend/README.md) containing all the files and installation instructions to run the frontend.

This frontend is built in React, leveraging the `create-react-router` app, using [vite](https://vite.dev/) and [TailwindCSS](https://tailwindcss.com/). There is also leveraging of the `Material-UI` libraries for visual components.

### Backend

A [folder](frontend/README.md) containing all the files and installation instructions to run the API that is required by the frontend.

This backend is built in Python (tested in version 3.11) and leverages the (FastAPI)[https://fastapi.tiangolo.com/] library.

### TODOs

1. Create a shippable docker-compose file to run everything in one click (MUI features are failing on the frontend Docker),
2. Investigate performance increase with better state management - currently at around 5k lines of code performance degrades, 
3. Further specific TODOs are found on each individual package.