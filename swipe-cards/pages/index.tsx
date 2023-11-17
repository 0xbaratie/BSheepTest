import Card from '@/components/sheep';
import { CardData } from '@/types';
import { cardData } from '@/utils/data';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SetStateAction, useState } from 'react';
import Lights from '../public/lights.png';

export default function Home() {
  const [cards, setCards] = useState<CardData[]>(cardData);
  const [rightSwipe, setRightSwipe] = useState(0);
  const [leftSwipe, setLeftSwipe] = useState(0);

  const activeIndex = cards.length - 1;
  const removeCard = (id: number, action: 'right' | 'left') => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    if (action === 'right') {
      setRightSwipe((prev) => prev + 1);
    } else {
      setLeftSwipe((prev) => prev + 1);
    }
  };


  return (
    <div className="relative flex flex-wrap w-full text-textGrey">
      <AnimatePresence>
        {cards.length ? (
          cards.map((card) => (
            <Card
              key={card.id}
              data={card}
              active={true}
              removeCard={removeCard}
            />
          ))
        ) : (
          <h2 className="absolute z-10 text-center text-2xl font-bold text-textGrey ">
            Excessive swiping can be injurious to health!
            <br />
            Come back tomorrow for more
          </h2>
        )}
      </AnimatePresence>
    </div>
  );  
}
