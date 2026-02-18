import type { Planet } from '../../types/astro';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface PlanetsListProps {
  planets: Planet[];
}

const planetSymbols: Record<string, string> = {
  'Soleil': '☉',
  'Lune': '☽',
  'Mercure': '☿',
  'Vénus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturne': '♄',
  'Uranus': '♅',
  'Neptune': '♆',
  'Pluton': '♇',
  'Nœud Nord': '☊',
  'Nœud Sud': '☋',
  'Chiron': '⚷'
};

export function PlanetsList({ planets }: PlanetsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {planets.map((planet) => (
        <Card key={planet.name} hover>
          <CardHeader>
            <CardTitle>
              <span className="text-2xl mr-2">{planetSymbols[planet.name]}</span>
              {planet.name}
              {planet.retrograde && <span className="text-red-400 ml-2 text-sm">(R)</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold text-mystic-light">{planet.sign}</span>
              <span className="text-xs text-gray-400 ml-2">{planet.degree}</span>
              <span className="text-xs text-gray-400 ml-2">• Maison {planet.house}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">{planet.explanation}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
