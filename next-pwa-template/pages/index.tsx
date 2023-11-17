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
      <div className="hidden sm:block">
        <p>The display here appears on non-smartphones.</p>
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
