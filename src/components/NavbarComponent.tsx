import { Link } from 'react-router-dom'
import { useState } from 'react';
import { 
  AppShell, 
  Group, 
  Text, 
  Box, 
  Title,
  Button,
/*  Header, 
  SimpleGrid, 
  Paper, 
  UnstyledButton, 
  ThemeIcon,
  Flex*/
} from '@mantine/core';
import {IconUser, IconHome/*, IconTemperature, IconCash, IconChartBar, IconBox*/ } from '@tabler/icons-react';

/*type NavbarProps = {
  username: string
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  return (
    <nav>
      <p>Hello, {username}!</p>
    </nav>
  )
}*/ 

/**
        <Link to="/" className="hover:underline gap-2">Home</Link>
        <Link to="/inventory" className="hover:underline">Készlet</Link>
        <Link to="/pricing" className="hover:underline">Árak</Link>
        <Link to="/stats" className="hover:underline">Statisztika</Link>
*/

/**
  const menuItems = [
    { title: 'Autómaták', icon: <IconBox size={48} />, color: 'blue', path: '/machines' },

 */

const Navbar: React.FC = () => {

//  const [temperature] = useState(23); // Ezt majd valós adattal helyettesíteni kell
  const [user] = useState("Felhasználó") // Ezt is

  return (
    <nav className="fixed top-0 w-full z-10 bg-primary-500 text-white p-4 flex justify-between items-center shadow-md">
      <AppShell
      header={{ height: 80 }}
      padding={0}
      >
      <AppShell.Header bg="indigo.7" c="white">
        <Group h="100%" px="md" justify="space-between">
          <Box py={10} px={20} bg="gray.3" c="black">
            <Title order={2}>Logó</Title>
          </Box>
          
          <Group gap="xs">
            <Button 
              component={Link} 
              to="/" 
              leftSection={<IconHome size={18} />}
            >
              Dashboard
            </Button>
          </Group>

          <Group gap="xs">
            <IconUser size={24} />
            <Text fw={500}>Üdv {user}</Text>
          </Group>
        </Group>
      </AppShell.Header>
      
    </AppShell>
    </nav>
  )
}

export default Navbar