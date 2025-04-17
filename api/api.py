import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
#from starlette.middleware.cors import CORSMiddleware

from utils import list_files_in_folder, hex_to_path, get_file_chunk

root_folder = "../logs"

fastapi_app = FastAPI()
# app = CORSMiddleware(app=fastapi_app, allow_origins=['*'])

# Add CORS middleware
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@fastapi_app.get("/")
def read_root():
    return {"Hello": "World"}

@fastapi_app.get("/files/{folder_id:path}")
@fastapi_app.get("/files/")
def read_folder(folder_id: str = str(root_folder).encode().hex()):
    folder = hex_to_path(folder_id)
    folder_path = Path(root_folder) / Path(folder).relative_to(root_folder)
    if folder_path.exists() and folder_path.is_dir():
        try:
            return list_files_in_folder(folder_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e), headers={"Access-Control-Allow-Origin": "*"})
    else:
        raise HTTPException(status_code=404, detail="Folder does not exist", headers={"Access-Control-Allow-Origin": "*"})

@fastapi_app.get("/file/{file_id:path}")
def read_file(file_id, position: int = 0, size: int = 50):
    file = hex_to_path(file_id)
    file_path = Path(root_folder) / Path(file).relative_to(root_folder)

    if file_path.exists() and file_path.is_file():
        try:
            return get_file_chunk(file_path, size, position)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e), headers={"Access-Control-Allow-Origin": "*"})
    else:
        raise HTTPException(status_code=404, detail="File does not exist", headers={"Access-Control-Allow-Origin": "*"})