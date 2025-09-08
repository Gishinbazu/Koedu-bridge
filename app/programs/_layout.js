// app/programs/_layout.js
import { Stack } from 'expo-router';

export default function ProgramsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: { fontWeight: '800' },
      }}
    />
  );
}
