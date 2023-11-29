import { zeroAddress } from 'viem'
import { useBalance } from 'wagmi'

import { useEffect } from 'react'
import { baseGoerli } from 'wagmi/chains'
import Game from './Game'
import GetEth from './GetEth'
import Login from './Login'

import { useAccount } from 'wagmi'

import { usePrivy } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'

export const LoginGate = () => {
	const { ready } = usePrivy()
	const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
	const { address, isConnected } = useAccount()
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
	})

	const balance = data?.value

	useEffect(() => {
		const interval = setInterval(() => {
			refetch()
		}, 3000)
		return () => clearInterval(interval)
	}, [])

	if (!address) {
		return (
			<div className='absolute top-0 left-0 h-screen w-screen bg-stone-100'>
				<Login />
			</div>
		)
	}
	if (!balance) {
		return (
			<div className='absolute top-0 left-0 h-screen w-screen bg-stone-100'>
				<GetEth address={address} />
			</div>
		)
	}
	console.log('[Login Gate] Wallet connected, rendering game', address)
	return <Game />
}
