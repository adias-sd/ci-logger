import { useState, useEffect } from 'react';

import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import WrapTextIcon from '@mui/icons-material/WrapText';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';

import { useColorScheme } from '@mui/material/styles';

import type { SettingsParams } from '~/interfaces/settings';

const typeMapping: any = {
    wordWrap: {
        icon: WrapTextIcon,
        label: 'Word Wrapping',
        type: 'checkbox',
    },
    theme: {
        icon: WrapTextIcon,
        buttons: [
            {
                icon: DarkModeIcon,
                label: 'Dark theme',
                value: 'dark',
            },
            {
                icon: LightModeIcon,
                label: 'Light theme',
                value: 'light',
            },
            {
                icon: LaptopChromebookIcon,
                label: 'System theme',
                value: 'system',
            },
        ],
        label: 'Color Theme',
        type: 'toggle',
    }
};

export const initialSettings = {
    wordWrap: true,
    theme: typeof window !== "undefined" && localStorage.getItem("theme") 
        ? localStorage.getItem("theme") 
        : "system", // Default to "system" if SSR or no value in localStorage
};

export default function Settings(params: SettingsParams) {
    const { settings } = params;
    const [ settingsObj, setSettings] = settings;
    const [open, setOpen] = useState(false);
    const { mode, setMode } = useColorScheme();

    // Update theme from localStorage on the client side
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme") || "system";
            setSettings((prev: any) => ({ ...prev, theme: savedTheme }));
        }
    }, []);

    useEffect(
        ()=>{
            setMode(settingsObj.theme);

            // Set Tailwind CSS dark mode
            const htmlElement = document.documentElement;

            if (settingsObj.theme === 'dark') {
                htmlElement.classList.add('dark');
                htmlElement.style.colorScheme = 'dark';
                localStorage.setItem('theme', 'dark');
            } else if (settingsObj.theme === 'light') {
                htmlElement.classList.remove('dark');
                htmlElement.style.colorScheme = 'light';
                localStorage.setItem('theme', 'light');
            } else if (settingsObj.theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    htmlElement.classList.add('dark');
                    htmlElement.style.colorScheme = 'dark';
                } else {
                    htmlElement.classList.remove('dark');
                    htmlElement.style.colorScheme = 'light';
                }
                localStorage.setItem('theme', 'system');
            }
        },
        [settingsObj.theme]
    );

    
    const children = Object.entries(settingsObj).map(
        ([key, value]: [string, any]) => {
            if (typeMapping[key].type === 'checkbox') {
                const onClick = ()=>setSettings((old: SettingsParams) => ({...old, [key]: !Boolean(value)}));
                const { icon: Icon, label } = typeMapping[key];
                return (
                    <ToggleButton 
                        onChange={onClick}
                        value={true}
                        key={key}
                        selected={value}
                        title={label}
                   >
                        <Icon/>
                    </ToggleButton>
                );
            }
            if (typeMapping[key].type === 'toggle') {
                const onChange = (_: any, v: any )=>{
                    let keyVal = v;
                    if(v===null) keyVal = 'system';
                    setSettings((old: SettingsParams) => ({...old, [key]: keyVal}));
                }
                const buttons = typeMapping[key].buttons.map(
                    (button: any) => {
                        const { icon: Icon, label, value: val } = button;
                        return (
                            <ToggleButton key={label} title={label} value={val}>
                                <Icon/>
                            </ToggleButton>
                        );
                    }
                );
                return (
                    <ToggleButtonGroup
                        key={key}
                        onChange={onChange}
                        value={value}
                        exclusive
                    >
                        {buttons}
                    </ToggleButtonGroup>
                );
            }

        }
    )
    return (
        <>
            <IconButton color="secondary" onClick={()=>setOpen(true)}>
                <SettingsIcon/>
            </IconButton>
            <Dialog onClose={()=>setOpen(false)} open={open}>
                <DialogContent>
                    <FormGroup>
                        {children}
                    </FormGroup>
                </DialogContent>
            </Dialog>
        </>
    );
}

