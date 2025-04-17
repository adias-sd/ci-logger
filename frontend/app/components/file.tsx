import { useState, useEffect } from 'react';

import { useNavigate } from "react-router";

import {
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import Editor, { useMonaco } from '@monaco-editor/react';

import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import FmdBadIcon from '@mui/icons-material/FmdBad';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Badge from '@mui/material/Badge';

import Settings, { initialSettings } from '~/components/settings';

import { getFile } from '~/utils/apiCalls';
import { throttle } from '~/utils/timing';
import { useWindowDimensions } from '~/utils/dom';

import type { FileProps, Chunk } from '~/interfaces/file';

export function FileComponent(params: FileProps) {
    const { 
        params: {
            fileId,
        }
    } = params;
    
    const navigate = useNavigate();
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [position, setPosition] = useState(0);
    const [text, setText] = useState('');
    const [errors, setErrors] = useState<number[]>([]);
    const [editor, setEditor] = useState<any>(null);
    const [wordWrapColumn, setWordWrapColumn] = useState(
        typeof window !== "undefined" ? Math.floor(window.innerWidth * 1.2 / 10) : 160 // Default to 80 if SSR
    )
    const settings = useState(initialSettings);
    const monaco = useMonaco();

    const { isPending: loading, error } = useQuery({ queryKey: [`files/${fileId}`], queryFn: () => getFile(fileId, position, 100, setChunks, setPosition) })
    const { height = 0 } = useWindowDimensions();

    useEffect(() => {
        function handleResize() {
            setWordWrapColumn(Math.floor(window.innerWidth * 0.9 / 10)); // Update wordWrapColumn dynamically
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handleEditorDidMount(editor: any, monaco: any) {
        const throttled = throttle(
            ()=>{
                queryClient.invalidateQueries({queryKey:[`files/${fileId}`]});
            },
            500,
        );
        setEditor(editor);
        editor.onDidScrollChange(
            (event: any) => {
                const scrollTop = editor.getScrollTop(); // Current vertical scroll position
                const scrollHeight = editor.getScrollHeight(); // Total scrollable height
                const clientHeight = editor.getLayoutInfo().height; // Visible height of the editor
        
                // Check if the scroll bar is at the bottom
                if (scrollTop + clientHeight >= scrollHeight - height * 0.33 && !loading) {
                    throttled(undefined);
                }
            }
        );
    }
    
    function goToLine(lineNumber: number) {
        if (editor) {
            editor.revealLine(lineNumber);
            editor.setPosition({ lineNumber, column: 1 });
            editor.focus();
        }
    }

    function findFirstError(){
        const line = errors[0];
        if (line) {
            goToLine(line + 1);
        }
    }

    useEffect(
        () => {
            const { contents = [], startPosition } = chunks[0] || {};
            const text = contents.join('');
            const errorLines = contents.map((l, i)=>{
                if (l.indexOf("error") >= 0) {
                    return startPosition + i;
                }
            }).filter((l): l is number => l !== undefined);
            if (errorLines.length > 0 ) setErrors(old => [...old, ...errorLines]);
            setText(old=>old+text);
        },
        [chunks]
    )

    const queryClient = useQueryClient();

    if (loading) {
        return <>... Loading</>
    }
    if (error) {
        return <>{error.message}</>
    }

    const filename = chunks[0]?.filename || 'Loading...';
    const setObj = settings[0];
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    let editorThemeSystem = darkThemeMq.matches? 'vs-dark' : 'vs-light';
    let editorTheme = editorThemeSystem;
    const badgeValue = errors.length;

    if (setObj.theme === 'light') editorTheme = 'vs-light';
    if (setObj.theme === 'dark') editorTheme = 'vs-dark';

    return (
        <div className="">
            <div className="grid grid-cols-[50px_5fr_50px_50px] text-center">
                <IconButton color="secondary" onClick={() => navigate('/files')}>
                    <KeyboardReturnIcon/>
                </IconButton>
                <Typography variant="h5" gutterBottom>
                    {filename}
                </Typography>
                <IconButton disabled={!Boolean(badgeValue)} onClick={findFirstError}>
                    <Badge invisible={!Boolean(badgeValue)} badgeContent={badgeValue}>
                        <FmdBadIcon/>
                    </Badge>
                </IconButton>
                <Settings settings={settings}/>
            </div>
            <Editor 
                height="90vh"
                theme={editorTheme}
                language="javascript"
                value={text}
                onMount={handleEditorDidMount}
                options={{
                    minimap: {
                        enabled: false,
                    },
                    selectOnLineNumbers: true,
                    readOnly: true,
                    wordWrap: settings[0].wordWrap ? 'wordWrapColumn': 'off',
                    wordWrapColumn: wordWrapColumn,
                    wrappingStrategy: 'advanced',
                    scrollBeyondLastLine: false,
                    largeFileOptimizations: false,
                }}
                
            />
        </div>
    );
}