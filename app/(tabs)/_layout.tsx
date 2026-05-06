import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
        <Tabs.Screen name="graph" options={{ title: 'Graph' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}