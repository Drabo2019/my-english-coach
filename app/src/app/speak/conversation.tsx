import { useLocalSearchParams } from 'expo-router';

import { ConversationView } from '@/features/ConversationView';

export default function Conversation() {
  const { scenario } = useLocalSearchParams<{ scenario: string }>();
  return <ConversationView scenarioId={scenario ?? null} />;
}
