import React from 'react';
import { useSwipeable } from 'react-swipeable';
import Page from '../components/page';
import Section from '../components/section';

const Index = () => {
  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedUp: () => console.log("Swiped Up"),
    onSwipedLeft: () => console.log("Swiped Left"),
  });

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
          <Section {...handlers}>
            <img src="/images/sheep.svg" alt="Sheep Icon" className="w-18 h-18" />
          </Section>
        </Page>
      </div>
    </>
  );
};

export default Index;
