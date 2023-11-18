import React, { useEffect } from "react";
import { useSwipeable } from 'react-swipeable';
import Page from '../components/page';
import Section from '../components/section';
import Card from '@/components/sheep';
import { SheepData } from '@/types';
import { sheepData } from '@/utils/data';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { zeroAddress } from "viem";
import { useBalance } from "wagmi";

import Game from "../components/Game";
import GetEth from "../components/GetEth";
import Login from "../components/Login";

import { baseGoerli } from "wagmi/chains";

import { useAccount } from "wagmi";

import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";


//graph ql
import { Sheepend } from "../graphql/SheepUpGraph";

type SheepenedData = {
  blockNumber: string;
  id: string;
  level: string;
  shippedAt: string;
};


const Index = () => {
  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedUp: () => console.log("Swiped Up"),
    onSwipedLeft: () => console.log("Swiped Left"),
  });
  const [sheep, setSheep] = useState<SheepData[]>(sheepData);
  const [rightSwipe, setRightSwipe] = useState(0);
  const [leftSwipe, setLeftSwipe] = useState(0);
  const [sheepenedData, setSheepenedData] = useState<SheepenedData[]>([]);

  async function sheepend() {
    console.log("sheepend");
    try {
      const data = await Sheepend();
  
      if (data && data.sheepeneds) {
        console.log("@@@data.sheepeneds=", data.sheepeneds);
        setSheepenedData(data.sheepeneds);
      }
      console.log("@@@sheepeneds1=", sheepenedData)
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  }

  const activeIndex = sheep.length - 1;
  const removeCard = (id: number, action: 'right' | 'left') => {
    setSheep((prev) => prev.filter((sheep) => sheep.id !== id));
    if (action === 'right') {
      setRightSwipe((prev) => prev + 1);
    } else {
      setLeftSwipe((prev) => prev + 1);
    }
  };
  const { ready } = usePrivy();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { address, isConnected } = useAccount();
  // console.log("active wallet", activeWallet);
  // console.log("address", address);

  const {
    data,
    isLoading: isBalanceLoading,
    refetch,
  } = useBalance({
    address: address ?? zeroAddress,
    //TODO
    chainId: baseGoerli.id,
  });

  const balance = data?.value;

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    sheepend();
  }, []);

  const NotSpDisplay = () => {
    return (
      <div className="hidden sm:flex flex-col items-center justify-center bg-blue h-screen">
        <img src="/images/sheep.svg" alt="Sheep Icon" className="w-18 h-18" />
        <p className="p-2 font-bold text-4xl text-white">Sheep It</p>
        <p className="p-2 font-bold text-md text-white">An onchain Sheeping (Sheep * ship it) game</p>
        <div className='bg-gray rounded-md p-4 mt-8'>
          <p className="text-black font-bold">
            Sheep It is only on mobile. Visit on your phone to play.
          </p>
        </div>
      </div>
    );
  };

  if (!address) {
    return (
      <>
        <NotSpDisplay />
        <div className="sm:hidden absolute top-0 left-0 h-screen w-screen bg-stone-100">
          <Login />
        </div>
      </>
    );
  }
  if (!balance) {
    return (
      <>
        <NotSpDisplay />
        <div className="sm:hidden absolute top-0 left-0 h-screen w-screen bg-stone-100">
          <GetEth address={address} />
        </div>
      </>
    );
  }

  return (
    <>
      <NotSpDisplay />
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
