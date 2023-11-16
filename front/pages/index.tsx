import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { WalletConnect } from "../components/WalletConnect";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useDisconnect,
} from "wagmi";
import { NFTContractAbi } from "../data/NFTContractAbi";
import { NFTContractAddress } from "../data/NFTContractAddress";
import SocialAccountData from "../data/SocialAccountData";
import RandomInterval from "../data/RandomInterval";
import FullScreenModal from "../components/FullScreenModal";
import LotteryModal from "../components/LotteryModal";
import { Footer } from "../components/Footer";

import {
  type WalletWithMetadata,
  usePrivy,
  useWallets,
} from "@privy-io/react-auth";
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

const Home: NextPage = () => {
  const [randomNumber, setRandomNumber] = useState("1337");
  const [counter, setCounter] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [latestNums, setLatestNums] = useState<string[]>(
    Array(10).fill("....")
  );
  const [yourNum, setYourNum] = useState("");

  // Privy hooks
  const {
    ready,
    user,
    authenticated,
    login,
    connectWallet,
    logout,
    linkWallet,
    unlinkWallet,
  } = usePrivy();
  const { wallets: connectedWallets } = useWallets();

  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

  // WAGMI hooks
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const wallets = user?.linkedAccounts.filter(
    (a) => a.type === "wallet"
  ) as WalletWithMetadata[];

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

      <h1 className="font-mincho text-3xl mt-10 text-primary font-extrabold text-center">
        Are you 1337?
      </h1>
      <p className="font-mincho mt-2 mb-6 text-sm text-primary-text">
        Based on Farcaster & Base
      </p>

      <p className="mt-4 mb-6 text-4xl text-primary-text font-bold">
        {randomNumber}
      </p>

      <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
        <h1 className="text-4xl font-bold">Privy</h1>
        {ready && !authenticated && (
          <>
            <p>You are not authenticated with Privy</p>
            <div className="flex items-center gap-4">
              <Button onClick_={login} cta="Login with Privy" />
              <span>or</span>
              <Button onClick_={connectWallet} cta="Connect only" />
            </div>
          </>
        )}

        {ready && authenticated && (
          <>
            <p>
              You are logged in with privy.
              <br />
              Active wallet is <MonoLabel label={activeWallet?.address || ""} />
            </p>
            {wallets.map((wallet) => {
              return (
                <div
                  key={wallet.address}
                  className="flex min-w-full flex-row flex-wrap items-center justify-between gap-2 bg-slate-50 p-4"
                >
                  <div>
                    <MonoLabel label={wallet.address} />
                  </div>
                  <Button
                    cta="Make active"
                    onClick_={() => {
                      const connectedWallet = connectedWallets.find(
                        (w) => w.address === wallet.address
                      );
                      if (!connectedWallet) connectWallet();
                      else setActiveWallet(connectedWallet);
                    }}
                    disabled={wallet.address === activeWallet?.address}
                  />
                  <Button
                    cta="Unlink"
                    onClick_={() => unlinkWallet(wallet.address)}
                  />
                </div>
              );
            })}
            <Button onClick_={linkWallet} cta="Link another wallet" />

            <br />
            <Button onClick_={logout} cta="Logout from Privy" />
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
                  onClick={() => write()}
                >
                  Stop
                </button>
              </>
            )}
          </>
        )}
      </div>

      <p className="font-mincho mt-16 text-sm text-primary-text">
        Latest 10 numbers
      </p>
      <div className="mt-4">
        <div className="flex flex-wrap justify-between mb-4">
          {latestNums.slice(0, 5).map((num, index) => (
            <NumberSpan key={index} marginRight={index !== 4}>
              {num}
            </NumberSpan>
          ))}
        </div>
        <div className="flex flex-wrap justify-between">
          {latestNums.slice(5).map((num, index) => (
            <NumberSpan key={index + 5} marginRight={index !== 4}>
              {num}
            </NumberSpan>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
