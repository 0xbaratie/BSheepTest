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

  if (!ready) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
        {ready && authenticated && (
          <>
            <p>
              Active wallet is <MonoLabel label={activeWallet?.address || ""} />
            </p>
            <Button onClick_={logout_} cta="Logout from Privy" />
          </>
        )}
      </div>
      <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
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
                  className="border-none mt-6 btn bg-blue text-white hover:bg-primary-hover"
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
