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
  removeCard: (id: number, action: 'right' | 'left') => void;
};

export type SwipeButtonProps = {
  exit: (value: SetStateAction<number>) => void;
  removeCard: (id: number, action: 'right' | 'left') => void;
  id: number;
};
