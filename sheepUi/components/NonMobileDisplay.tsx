const NotSpDisplay = () => {
	return (
		<div className='hidden sm:flex flex-col items-center justify-center bg-blue h-screen'>
			<img src='/images/sheep.svg' alt='Sheep Icon' className='w-18 h-18' />
			<p className='p-2 font-bold text-4xl text-white'>Sheep Up</p>
			<p className='p-2 font-bold text-md text-white'>
				An onchain Sheeping (Sheep * ship it) game
			</p>
			<div className='bg-gray rounded-md p-4 mt-8'>
				<p className='text-black font-bold'>
					Sheep Up is only on mobile. Visit on your phone to play.
				</p>
			</div>
		</div>
	)
}

export default NotSpDisplay
