import React from 'react';
import { useSwipeable } from 'react-swipeable';
import Page from '../components/page';
import Section from '../components/section';
import Card from '@/components/sheep';
import { SheepData } from '@/types';
import { sheepData } from '@/utils/data';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const Index = () => {
  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedUp: () => console.log("Swiped Up"),
    onSwipedLeft: () => console.log("Swiped Left"),
  });
  const [sheep, setSheep] = useState<SheepData[]>(sheepData);
  const [rightSwipe, setRightSwipe] = useState(0);
  const [leftSwipe, setLeftSwipe] = useState(0);

  const activeIndex = sheep.length - 1;
  const removeCard = (id: number, action: 'right' | 'left') => {
    setSheep((prev) => prev.filter((sheep) => sheep.id !== id));
    if (action === 'right') {
      setRightSwipe((prev) => prev + 1);
    } else {
      setLeftSwipe((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="hidden sm:flex flex-col items-center justify-center bg-blue h-screen">
        <img src="/images/sheep.svg" alt="Sheep Icon" className="w-18 h-18" />
        <p className="p-2 font-bold text-4xl">Sheep It</p>
        <p className="p-2 font-bold text-md">An onchain Sheeping (Sheep * ship it) game</p>
        <div className='bg-gray rounded-md p-4 mt-8'>
          <p className="text-black font-bold">
            Sheep It is only on mobile. Visit on your phone to play.
          </p>
        </div>
      </div>

      <div className='sm:hidden'>
        <Page>
          <div className="relative flex flex-wrap w-ful">
            <AnimatePresence>
              {sheep.length ? (
                sheep.map((sheep) => (
                  <Card
                    key={sheep.id}
                    data={sheep}
                    active={true}
                    removeCard={removeCard}
                  />
                ))
              ) : (
                <h2 className="absolute z-10 text-center text-2xl font-bold">
                  Excessive swiping can be injurious to health!
                  <br />
                  Come back tomorrow for more
                </h2>
              )}
            </AnimatePresence>
          </div>
        </Page>
      </div>
    </>
  );
};

export default Index;
