import { useEffect } from 'react';
import { SheepProps } from '@/types';
import {
  easeIn,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  useAnimation
} from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import SwipeButton from './swipeButtons';

const Sheep = ({ data, active, removeSheep }: SheepProps) => {
  const [exitX, setExitX] = useState(0);
  const [level, setLevel] = useState(data.level); 

  const x = useMotionValue(0);
  const input = [-200, 0, 200];
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -125, 0, 125, 200], [0, 1, 1, 1, 0]);

  const dragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x > 100) {
      setExitX(200);
      removeSheep(data.id, 'right');
    } else if (info.offset.x < -100) {
      setExitX(-200);
      removeSheep(data.id, 'left');
    }
  };
  
  const handleTap = () => {
    setLevel((prevNumber) => prevNumber + 1);

    // controls.start({
    //   x: [10, -10, 10],
    //   transition: {
    //     duration: 2.5,
    //     repeat: Infinity,
    //     repeatType: "reverse",
    //     ease: "easeInOut",
    //     delay: Math.random() * 0.5
    //   }
    // });
  };  
  const controls = useAnimation();

  useEffect(() => {
    const delay = Math.random() * 0.5; // 0 to 0.5 second random delay

    controls.start({
      x: [10, -10, 10],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay
      }
    });

    return () => controls.stop();
  }, [controls]);

  return (
    <>
      {active ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          className="h-16 w-16 relative"
          onDragEnd={dragEnd}
          initial={{ scale: 0.95, opacity: 0.5 }}
          animate={controls}
          style={{ x, rotate, opacity }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeIn' }}
          whileDrag={{ cursor: 'grabbing' }}
          exit={{ x: exitX }}
          onTap={handleTap}
        >
          <Image
            src="/images/sheep.svg"
            fill
            alt=""
          />
          <div
            className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl z-10"
          >
            {level}
          </div>
        </motion.div>
      ) : null}
    </>
  );
};

export default Sheep;
