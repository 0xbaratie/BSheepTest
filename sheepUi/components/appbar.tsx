import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
	{ label: 'Story', href: '/story' },
	{ label: 'Recipes', href: '/recipes' },
]
interface AppbarProps {
	furAmount: number;
	tapAmount: number;
	shipAmount: number;
}

const Appbar = ({ furAmount, tapAmount, shipAmount }: AppbarProps) => {
	const router = useRouter()

	return (
		<div className='fixed top-0 left-0 z-20 w-full bg-white-900 pt-safe'>
			<header className='border-b bg-white'>
				<div className="flex justify-center">
					<div className='mx-auto flex h-8 max-w-screen-md items-center justify-between px-2'>
						<p className='text-blue font-bold text-3xl'>
							<span className="pr-1">1000</span> 
							fur
						</p>
					</div>
				</div>
				<p className='text-center text-blue font-bold'>Rest</p>
				<div className="flex justify-center items-center">
					
					<span className='text-blue'>Tap:</span>
					<span className='text-blue mr-1'>10</span>
					<span className='text-blue ml-1'>Ship:</span>
					<span className='text-blue'>3</span>
			</div>

			</header>
		</div>
	)
}

export default Appbar
