import type { Aspect } from '../../types/astro';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface AspectsListProps {
  aspects: Aspect[];
}

const aspectSymbols: Record<string, string> = {
  'Conjonction': '☌',
  'Opposition': '☍',
  'Trigone': '△',
  'Carré': '□',
  'Sextile': '⚹',
  'Quinconce': '⚻'
};

export function AspectsList({ aspects }: AspectsListProps) {
  const sortedAspects = [...aspects].sort((a, b) => a.orb - b.orb);

  const getTypeColor = (type: Aspect['type']) => {
    switch (type) {
      case 'harmonious':
        return 'border-l-green-500';
      case 'difficult':
        return 'border-l-red-500';
      case 'neutral':
        return 'border-l-yellow-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {sortedAspects.map((aspect, idx) => (
        <Card key={idx} hover className={`border-l-4 ${getTypeColor(aspect.type)}`}>
          <CardHeader>
            <CardTitle className="text-base">
              {aspect.planet1} {aspectSymbols[aspect.aspect] || aspect.aspect} {aspect.planet2}
              <span className="text-xs text-gray-400 ml-2 font-normal">
                (orbe: {aspect.orb.toFixed(2)}°)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{aspect.explanation}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
