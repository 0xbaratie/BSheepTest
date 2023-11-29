import Mint from '@/components/mint'
import Sheep from '@/components/sheep'
import { SheepData } from '@/types'
import { sheepData } from '@/utils/data'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import NonMobileDisplay from '../components/NonMobileDisplay'
import Appbar from '../components/appbar'
import Page from '../components/page'

import { zeroAddress } from 'viem'

import GetEth from '../components/GetEth'
import Login from '../components/Login'

import { baseGoerli } from 'wagmi/chains'

import { usePrivy } from '@privy-io/react-auth'
import { usePrivyWagmi } from '@privy-io/wagmi-connector'

import {
	useAccount,
	useBalance,
	useContractRead,
	useContractWrite,
	usePrepareContractWrite,
} from 'wagmi'
import { SheepUpContractAbi } from '../data/SheepUpContractAbi'
import { SheepUpContractAddress } from '../data/SheepUpContractAddress'

//graph ql
import { GetAllSheepStatus } from '../graphql/SheepUpGraph'

type SheepenedData = {
	blockNumber: string
	id: string
	level: string
	shippedAt: string
}

const Index = () => {
	const handlers = useSwipeable({
		onSwiped: (eventData) => console.log('User Swiped!', eventData),
		onSwipedUp: () => console.log('Swiped Up'),
		onSwipedLeft: () => console.log('Swiped Left'),
	})
	const [sheep, setSheep] = useState<SheepData[]>(sheepData)
	const [rightSwipe, setRightSwipe] = useState(0)
	const [leftSwipe, setLeftSwipe] = useState(0)
	const [taps, setTaps] = useState<number[]>([])
	const [ship, setShip] = useState(0)

	async function getAllSheepStatus() {
		console.log('sheepend')
		try {
			const data = await GetAllSheepStatus()

			if (data && data.sheepeneds) {
				const formattedSheepData = data.sheepeneds.map((sheep: any) => ({
					...sheep,
					id: parseInt(sheep.id, 10),
				}))
				setSheep(data.sheepeneds)
			}
		} catch (err) {
			if (err instanceof Error) {
				console.error(err.message)
			} else {
				console.error('An unexpected error occurred.')
			}
		}
	}

	const activeIndex = sheep.length - 1
	const removeSheep = (id: number, action: 'right' | 'left') => {
		setSheep((prev) => prev.filter((sheep) => sheep.id !== id))
		if (action === 'right') {
			setRightSwipe((prev) => prev + 1)
		} else {
			setLeftSwipe((prev) => prev + 1)
		}
	}
	const tapCard = (id: number) => {
		setTaps((prev) => [...prev, id])
		// TODO when initial, cannot add taps to the array
		if (taps.length >= 9) {
			writeTaps?.()
			setTaps([])
		}
	}
	const shipCard = (id: number) => {
		setShip(id)
		writeShip?.()
	}

	const { ready } = usePrivy()
	const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi()
	const { address, isConnected } = useAccount()
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

	useEffect(() => {
		GetAllSheepStatus()
	}, [])

	//send tx
	const { config } = usePrepareContractWrite({
		address: SheepUpContractAddress,
		abi: SheepUpContractAbi,
		functionName: 'taps',
		args: [taps],
		enabled: !!SheepUpContractAddress,
	})
	const { write: writeTaps } = useContractWrite(config)

	const { config: configShip } = usePrepareContractWrite({
		address: SheepUpContractAddress,
		abi: SheepUpContractAbi,
		functionName: 'ship',
		args: [ship],
		enabled: !!SheepUpContractAddress,
	})
	const { write: writeShip } = useContractWrite(configShip)
	const { data: shipStamina } = useContractRead({
		address: SheepUpContractAddress,
		abi: SheepUpContractAbi,
		functionName: 'getPlayerShipStamina',
		args: [address],
		watch: true,
	})

	const { data: tapStamina } = useContractRead({
		address: SheepUpContractAddress,
		abi: SheepUpContractAbi,
		functionName: 'getPlayerTapStamina',
		args: [address],
		watch: true,
	})

	const { data: point } = useContractRead({
		address: SheepUpContractAddress,
		abi: SheepUpContractAbi,
		functionName: 'point',
		args: [address],
		watch: true,
	})

	const shipStaminaNumber = shipStamina ? Number(shipStamina) : 0
	const shipTapNumber = tapStamina ? Number(tapStamina) : 0
	const pointNumber = point ? Number(point) : 0

	if (!address) {
		return (
			<>
				<NonMobileDisplay />
				<div className='sm:hidden absolute top-0 left-0 h-screen w-screen bg-stone-100'>
					<Login />
				</div>
			</>
		)
	}
	if (!balance) {
		return (
			<>
				<NonMobileDisplay />
				<div className='sm:hidden absolute top-0 left-0 h-screen w-screen bg-stone-100'>
					<GetEth address={address} />
				</div>
			</>
		)
	}

	return (
		<>
			<NonMobileDisplay />
			<div className='sm:hidden'>
				<Appbar
					furAmount={pointNumber}
					tapAmount={shipTapNumber}
					shipAmount={shipStaminaNumber}
				/>
				<Page>
					<div className='relative flex flex-wrap w-ful'>
						<AnimatePresence>
							{sheep.length ? (
								sheep.map((sheep) => (
									<Sheep
										key={sheep.id}
										data={sheep}
										active={true}
										removeSheep={removeSheep}
										tapCard={tapCard}
										shipCard={shipCard}
									/>
								))
							) : (
								<h2 className='absolute z-10 text-center text-2xl font-bold'>
									Excessive swiping can be injurious to health!
									<br />
									Come back tomorrow for more
								</h2>
							)}
						</AnimatePresence>
						<Mint sheep={sheep} setSheep={setSheep} />
					</div>
				</Page>
			</div>
		</>
	)
}

export default Index
