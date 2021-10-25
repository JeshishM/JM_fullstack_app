import { useColorMode, Button } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const DarkModeSwitch = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const iconColor = {
        light: 'black',
        dark: 'white'
    }
    return(
        <Button
            isFullWidth="true"
            aria-label="Toggle dark mode"
            rightIcon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon /> }
            onClick={toggleColorMode}
            color={iconColor[colorMode]}
        >
            Toggle Dark Mode
        </Button>
    )
}

export default DarkModeSwitch