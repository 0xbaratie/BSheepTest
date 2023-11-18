import { useEffect } from "react";
// import { FaEthereum } from "react-icons/fa";
import { LuCopy } from "react-icons/lu";
import { Address, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import truncateString from "./truncateString";

// import getNetworkConfig from "../network/getNetworkConfig";

const GetEth = ({ address }: { address: Address }) => {

  const copyToClipboardFallback = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textarea);
  };
  
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => console.log('Text copied to clipboard'))
        .catch(err => console.error('Could not copy text: ', err));
    } else {
      copyToClipboardFallback(text);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center tracking-tight bg-blue">
      <div className="w-80 flex flex-col gap-12 items-center justify-center">
        <div>
          <div className="flex gap-1 tracking-tight items-center">
            <img src="/images/sheep.svg" alt="Sheep Icon" className="w-18 h-18" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-white">Get some ETH on Base</h1>
          <p className="text-sm text-white">
          You will use ETH, the official currency of Base, to buy tiles and earn
            rewards
          </p>

          <div className="text-xl text-white mt-4">Receive ETH on Base</div>
          <div className="p-4 bg-stone-200 rounded-sm">
            <div className="flex gap-1 justify-between items-center font-bold">
              <div>
                <div>Copy Address</div>
                <div className="text-sm">{truncateString(address, 30)}</div>
              </div>
              <div
                className="active:text-stone-600"
                onClick={() => {
                  copyToClipboard(address);
                }}
              >
                <LuCopy className="text-xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm">
          Once there is GoerliETH in your wallet, you will get started with the rest of
          the app. We recommend at least 0.01 ETH.
        </div>
      </div>
    </div>
  );
};

export default GetEth;
