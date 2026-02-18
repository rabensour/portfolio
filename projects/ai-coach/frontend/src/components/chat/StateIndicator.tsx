import type { UserState } from '@/types/chat';

interface StateIndicatorProps {
  state: UserState;
}

export function StateIndicator({ state }: StateIndicatorProps) {
  if (!state) return null;

  const stateConfig = {
    tired: {
      emoji: '💤',
      label: 'Fatigué',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    energetic: {
      emoji: '⚡',
      label: 'Énergique',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    resistance: {
      emoji: '🤔',
      label: 'Résistance',
      className: 'bg-orange-100 text-orange-800 border-orange-200',
    },
  };

  const config = stateConfig[state];
  if (!config) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </div>
  );
}
