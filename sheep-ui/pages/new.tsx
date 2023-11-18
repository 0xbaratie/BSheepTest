import Card from '@/components/sheep';
import Light from '@/components/Light';
import { SheepData } from '@/types';
import { sheepData } from '@/utils/data';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Dummy() {
  const [sheep, setSheep] = useState<SheepData[]>(sheepData);
  const [rightSwipe, setRightSwipe] = useState(0);
  const [leftSwipe, setLeftSwipe] = useState(0);

  const activeIndex = sheep.length - 1;
  const removeCard = (id: number, action: 'right' | 'left') => {
    setSheep((prev) => prev.filter((card) => card.id !== id));
    if (action === 'right') {
      setRightSwipe((prev) => prev + 1);
    } else {
      setLeftSwipe((prev) => prev + 1);
    }
  };
  return (
    <div className="relative flex h-screen w-full items-end justify-center overflow-hidden bg-black text-textGrey">
      <Light />
      <AnimatePresence>
        {sheep.length ? (
          sheep.map((card) => (
            <Card
              key={card.id}
              data={card}
              active={card.id === activeIndex}
              removeCard={removeCard}
            />
          ))
        ) : (
          <h2 className="absolute z-10 self-center text-center text-2xl font-bold text-textGrey ">
            Excessive swiping can be injurious to health!
            <br />
            Come back tomorrow for more
          </h2>
        )}
      </AnimatePresence>
    </div>
  );
}
