import os
from pathlib import Path

def path_to_hex(path: Path):
    return str(path).encode().hex()

def hex_to_path(hex: str):
    return Path(
        bytes.fromhex(hex).decode() 
    )


def list_files_in_folder(folder: Path):
    """
    List all files in the given folder path.
    """
    files = []
    for file in folder.iterdir():
        if file.name.lower() != 'readme.md':
            files.append(
                {
                    "filename": file.name,
                    "size": file.stat().st_size,
                    "modifiedTime": file.stat().st_mtime,
                    "type": "file" if file.is_file() else "folder",
                    "id": path_to_hex(file),
                }
            )
    return files

def get_file_chunk(filepath: Path, size = 50, position = 0):
    with open(filepath, 'r') as file:
        # Must confirm if I'm only reading lines here or not
        file.seek(position)
        contents = []
        current_line = None
        while current_line != '' and len(contents) <size:
            current_line = file.readline()
            contents.append(current_line)
            output_position = file.tell()
        #contents = file.readlines(size)
    return {
        "contents": contents,
        "startPosition": position,
        "endPosition": output_position, 
        "eof": output_position == os.path.getsize(filepath),
        "filename": filepath.parts[-1]
    }
