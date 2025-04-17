//import { useState } from 'react';
import { 
  AppShell, 
//  Header, 
//  Group, 
//  Text, 
  Box, 
  SimpleGrid, 
  Paper, 
  Title, 
  UnstyledButton, 
  ThemeIcon,
  Flex
} from '@mantine/core';
import { IconCash, IconChartBar, IconBox } from '@tabler/icons-react';

/**
        <Link to="/" className="hover:underline gap-2">Home</Link>
        <Link to="/inventory" className="hover:underline">Készlet</Link>
        <Link to="/pricing" className="hover:underline">Árak</Link>
        <Link to="/stats" className="hover:underline">Statisztika</Link>
 */

const MenuDashboard: React.FC = () => {
  const menuItems = [
    { title: 'Autómaták', icon: <IconBox size={48} />, color: 'blue', path: '/machines' },
    { title: 'Termékek', icon: <IconCash size={48} />, color: 'grape', path: '/products' },
    { title: 'Statisztika', icon: <IconChartBar size={48} />, color: 'cyan', path: '/statistics' },
  ];

  return (
    <AppShell
      header={{ height: '15%' }}
      padding={0}
    >
      <AppShell.Main>
        <Flex style={{ minHeight: 'calc(100vh - 80px)' }}>
          {/* Bal oldali kék sáv */}
          <Box w="10%" bg="cyan.2" />
          
          {/* Középső tartalom */}
          <Box flex={1} py="xl" px="xl" bg="white">
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
              {menuItems.map((item) => (
                <UnstyledButton key={item.title} component="a" href={item.path}>
                  <Paper
                    shadow="md"
                    radius="md"
                    p={40}
                    h={300}
                    ta="center"
                    display="flex"
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <ThemeIcon size={80} radius={40} color={item.color} variant="light" mb="md">
                      {item.icon}
                    </ThemeIcon>
                    <Title order={2}>{item.title}</Title>
                  </Paper>
                </UnstyledButton>
              ))}
            </SimpleGrid>
          </Box>
          
          {/* Jobb oldali kék sáv */}
          <Box w="10%" bg="cyan.2" />
        </Flex>
      </AppShell.Main>
    </AppShell>
  );
};

export default MenuDashboard;