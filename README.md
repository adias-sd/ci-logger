# CI Log Viewer

Full stack application to serve log files in a memory efficient way

## What is in this repo?

### Frontend

A [folder](frontend/README.md) containing all the files and installation instructions to run the frontend.

This frontend is built in React, leveraging the `create-react-router` app, using [vite](https://vite.dev/) and [TailwindCSS](https://tailwindcss.com/). There is also leveraging of the `Material-UI` libraries for visual components.

### Backend

A [folder](api/README.md) containing all the files and installation instructions to run the API that is required by the frontend.

This backend is built in Python (tested in version 3.11) and leverages the [FastAPI](https://fastapi.tiangolo.com/) library.

### Logs

A logs [folder](logs/README.md) where you can place all your log files to be viewed

## What does this application do?

- Creates a tree list of all log files in the `logs` folder,
  - No indexing system was used, the files are listed from the logs folder exclusively
- By clicking on the filename, the user is shown the contents of the file in a text editor (read-only),
  - The editor is a React version of the [Monaco Editor](https://microsoft.github.io/monaco-editor/)
  - This editor allows syntax highlighting via the [Monarch](https://microsoft.github.io/monaco-editor/monarch.html) language
  - Currently the syntax highlighting is set to be Javascript but very easily a Monarch file can be created and linked to allow for new syntax 
- The user can scroll down the file to access more of it. The file is progressively loaded into the editor,
  - The file is maintained in memory for the local app. The Monaco editor provides a performance mode for large files
- The user can click on the top right settings button to access settings for the editor and the app
  - Currently the user can:
    - Toggle line-wrapping,
    - Change the style from dark, light and system prefernce modes
- The user can click on the top right error button to navigate to the first error line
  - Currently an error is defined by a line that contains the `error` string. This can easily be changed to follow a different strategy.

## TODOs

1. Create a shippable docker-compose file to run everything in one click (MUI features are failing on the frontend Docker),
2. Investigate performance increase with better state management - currently at around 5k lines of code performance degrades, 
3. Further specific TODOs are found on each individual package.