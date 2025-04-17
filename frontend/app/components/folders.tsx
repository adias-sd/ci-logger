import { Link } from 'react-router';

import {
    useQuery,
  } from '@tanstack/react-query'

import { 
    FolderOpen,
    Folder as FolderIcon,
} from '@mui/icons-material';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import type { FolderObject, FolderProps } from '~/interfaces/folder';
import type { FileObject } from '~/interfaces/file';

import { getFiles } from '~/utils/apiCalls';

// const { SimpleTreeView } = TreeView;
// const { TreeItem } = Item;

export function Folder(params: FolderObject) {
    const { folder, label } = params;

    const { data: files = [], isPending: loading, error } = useQuery({ queryKey: [`files/${folder}`], queryFn: () => getFiles(folder) })

    const filesObjs = files.map(
        (file: FileObject) => {
            const { filename, /* size, modified_time,*/ type, id } = file;
            if (type === 'folder') {
                return <Folder key={id} label={filename} folder={id}></Folder>
            } else if (type === 'file') {
                const fileLink = `/file/${id}`;
                return (
                    <Link key={id} to={fileLink}>
                        <TreeItem itemId={id} label={filename} />
                    </Link>
                );
            }
        }
    );

    if(loading) {
        return <>... Loading</>
    }
    if(error) {
        return <>{error.message}</>
    }

    return (
        <TreeItem itemId={folder} label={label}>
            {filesObjs}
        </TreeItem>
    );
}

export function FilesComponent(params: FolderProps) {
    const { folder = '', label = 'root' } = params;
    return (
        <SimpleTreeView
            slots={{
                expandIcon: FolderIcon,
                collapseIcon: FolderOpen,
            }}
        >
            <Folder folder={folder} label={label}/>
        </SimpleTreeView>
    );
}