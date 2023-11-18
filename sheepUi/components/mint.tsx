import { useState } from 'react'
import { SheepUpContractAbi } from '../data/SheepUpContractAbi'
import { SheepUpContractAddress } from '../data/SheepUpContractAddress'
import {
	useContractWrite,
	usePrepareContractWrite,
} from 'wagmi'
import { MintProps, type SheepData } from '@/types'

const Mint = ({ sheep, setSheep }: MintProps) => {
	const [isMinted, setIsMinted] = useState(false)

	const { config: configMint } = usePrepareContractWrite({
		address: SheepUpContractAddress,
		abi: SheepUpContractAbi,
		functionName: 'mint',
		enabled: !!SheepUpContractAddress,
	})
	const { write: writeMint } = useContractWrite(configMint)

	return (
		<>
			{!isMinted && (
				<div className="fixed inset-x-0 bottom-10 flex justify-center p-2.5">
					<button className="bg-blue text-lg text-white hover:bg-primary-hover font-semibold py-4 px-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
						type="button"
						onClick={() => {
							writeMint?.()
							setIsMinted(true)
							setSheep([
								...sheep,
								{
									id: sheep.length,
									level: 0,
								}
							])
						}}>
							Start
					</button>
				</div>
			)}
		</>
	)
}

export default Mint
