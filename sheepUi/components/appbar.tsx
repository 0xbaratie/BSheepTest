import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
	{ label: 'Story', href: '/story' },
	{ label: 'Recipes', href: '/recipes' },
]

const Appbar = () => {
	const router = useRouter()

	return (
		<div className='fixed top-0 left-0 z-20 w-full bg-white-900 pt-safe'>
			<header className='border-b bg-white'>
				<div className="flex justify-center">
					<div className='mx-auto flex h-20 max-w-screen-md items-center justify-between px-6'>
						<Link href='/'>
							<p className='text-blue font-bold text-3xl'>
								<span className="pr-1">1000</span> 
								fur
							</p>
						</Link>
					</div>
				</div>
			</header>
		</div>
	)
}

export default Appbar
