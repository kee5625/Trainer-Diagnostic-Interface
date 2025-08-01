import { TRAINERS } from '../../utils/trainerRegistry';
import Card from './Card';

export default function TrainersList() {
  return (
    <div className="grid gap-6 md:grid-cols-4 p-8">
      {TRAINERS.map(t => (
        <Card
          key={t.id}
          route={`/trainers/${t.id}`}
          imageUrl={t.cardImg}
          title={t.name}
          description={`Interact with the ${t.name} trainer`}
        />
      ))}
    </div>
  );
}
