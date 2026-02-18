import type { House } from '../../types/astro';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface HousesListProps {
  houses: House[];
}

export function HousesList({ houses }: HousesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {houses.map((house) => (
        <Card key={house.number} hover>
          <CardHeader>
            <CardTitle>
              Maison {house.number}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <span className="font-semibold text-mystic-light">{house.sign}</span>
              <span className="text-xs text-gray-400 ml-2">{house.degree}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">{house.explanation}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
