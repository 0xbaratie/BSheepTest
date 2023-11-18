import { StaticImageData } from 'next/image';
import { SetStateAction } from 'react';

type TracksData = {
  name: string;
  artist: string;
  img: string;
};

export type SheepData = {
  id: number;
  name: string;
  src: StaticImageData;
  age: number;
  bio: string;
  genre: string[];
  tracks: TracksData[];
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
