import { useRouter } from "next/router";
import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { NFTContractAbi } from "../data/NFTContractAbi";
import { NFTContractAddress } from "../data/NFTContractAddress";
import RandomInterval from "../data/RandomInterval";
import FullScreenModal from "./FullScreenModal";
import LotteryModal from "./LotteryModal";
import { Footer } from "./Footer";

import {usePrivy, useWallets} from '@privy-io/react-auth';
import { usePrivyWagmi } from "@privy-io/wagmi-connector";

type NumberSpanProps = {
  children: React.ReactNode;
  marginRight?: boolean;
};

const MonoLabel = ({ label }: { label: string }) => {
  return (
    <span className="rounded-xl bg-slate-200 px-2 py-1 font-mono">{label}</span>
  );
};

type buttonProps = {
  cta: string;
  onClick_: () => void;
  disabled?: boolean;
};

const Button = ({ cta, onClick_, disabled }: buttonProps) => {
  if (disabled) {
  }
  return (
    <button
      className="rounded bg-slate-800 px-10 py-2 text-white transition-all hover:bg-slate-900 active:bg-slate-900 enabled:hover:cursor-pointer enabled:active:scale-75 disabled:opacity-80"
      onClick={onClick_}
      disabled={disabled}
    >
      {cta}
    </button>
  );
};

const Game: NextPage = () => {
  const [randomNumber, setRandomNumber] = useState("1337");
  const [counter, setCounter] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [latestNums, setLatestNums] = useState<string[]>(
    Array(10).fill("....")
  );
  const [yourNum, setYourNum] = useState("");

  const router = useRouter();
  // Privy hooks
  const { ready, authenticated, logout } = usePrivy();
  const {wallets} = useWallets();
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const {wallet: activeWallet, setActiveWallet} = usePrivyWagmi();

  const logout_ = async () => {
    await logout();
    router.reload();
  };

  const closeModal = () => {
    setModalOpen(false);
    setYourNum("");
  };

  const { data: numberData } = useContractRead({
    address: NFTContractAddress,
    abi: NFTContractAbi,
    functionName: "getLotteryNumber",
    watch: true,
  });

  const {config} = usePrepareContractWrite({
    address: NFTContractAddress,
    abi: NFTContractAbi,
    functionName: 'mint',
    enabled: !!NFTContractAddress,
  });
  const {data, isLoading, isError, write: writeA} = useContractWrite(config);

  const {
    data: writeData,
    isLoading: isWriteLoading,
    isSuccess,
    write,
  } = useContractWrite({
    address: NFTContractAddress,
    abi: NFTContractAbi,
    functionName: "mint",
  });

  const hashValue = writeData?.hash;

  useWaitForTransaction({
    hash: hashValue,
    onSettled(data, error) {
      const response = data ? data.logs[0] : [];

      if ("data" in response) {
        const responseData = response.data;
        setYourNum(parseInt(responseData, 16).toString());
        console.log("@@response=", response);
        console.log("@@responseData=", parseInt(responseData, 16).toString());
      }
    },
  });

  const NumberSpan: React.FC<NumberSpanProps> = ({
    children,
    marginRight = true,
  }) => (
    <span
      className={`text-primary-text font-bold mb-2 md:mb-0 ${
        marginRight ? "mr-8" : ""
      } font-mono`}
    >
      {children}
    </span>
  );

  useEffect(() => {
    if (numberData !== undefined) {
      const numberAsString = numberData.toString().padStart(4, "0");

      setLatestNums((prevNums) => {
        if (!prevNums.includes(numberAsString)) {
          const newNums = [numberAsString, ...prevNums];
          return newNums.slice(0, 10);
        }
        return prevNums;
      });
    }

    if (isSuccess && parseInt(yourNum) > 0) {
      setLatestNums((prevNums) => {
        if (!prevNums.includes(yourNum)) {
          const numberAsString = yourNum.toString().padStart(4, "0");
          return [numberAsString, ...prevNums.slice(0, 9)];
        }
        return prevNums;
      });
      setModalOpen(true);
    }
  }, [address, yourNum, numberData]);

  RandomInterval(counter, setCounter, setRandomNumber);

  if (!ready) {
    return;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <FullScreenModal isOpen={modalOpen} onClose={closeModal}>
        <LotteryModal onClose={closeModal} yourNum={yourNum} />
      </FullScreenModal>

      <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
        <h1 className="text-4xl font-bold">Privy</h1>
        {ready && !authenticated && (
          <>
            <p>You are not authenticated with Privy</p>
          </>
        )}

        {ready && authenticated && (
          <>
            <p>
              You are logged in with privy.
              <br />
              Active wallet is <MonoLabel label={activeWallet?.address || ""} />
            </p>
            <ul>
              {wallets.map((wallet) => (
                <li key={wallet.address}>
                  <button onClick={() => setActiveWallet(wallet)}>Activate {wallet.address}</button>
                </li>
              ))}
            </ul>
            <Button onClick_={logout_} cta="Logout from Privy" />
          </>
        )}
      </div>
      <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
        <h1 className="text-4xl font-bold">WAGMI</h1>
        <p>
          Connection status: {isConnecting && <span>🟡 connecting...</span>}
          {isConnected && <span>🟢 connected.</span>}
          {isDisconnected && <span> 🔴 disconnected.</span>}
        </p>
        {isConnected && address && (
          <>
            {isWriteLoading || parseInt(yourNum) > 0 ? (
              <span className="mt-4 loading loading-spinner text-primary"></span>
            ) : (
              <>
                <span>{activeWallet?.address}</span>
                <button
                  className="border-none mt-6 btn bg-primary text-white hover:bg-primary-hover"
                  type="button"
                  onClick={() => writeA?.()}
                >
                  Stop
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
