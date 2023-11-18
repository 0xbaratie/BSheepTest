import { StaticImageData } from 'next/image';
import { SetStateAction } from 'react';

export type SheepData = {
  id: number;
  number: number;
  src: StaticImageData;
};

export type SheepProps = {
  data: SheepData;
  active: boolean;
  removeSheep: (id: number, action: 'right' | 'left') => void;
};

export type SwipeButtonProps = {
  exit: (value: SetStateAction<number>) => void;
  removeSheep: (id: number, action: 'right' | 'left') => void;
  id: number;
};
