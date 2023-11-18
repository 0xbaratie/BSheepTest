import Head from 'next/head'
interface Props {
	title?: string
	children: React.ReactNode
}

const Page = ({ title, children }: Props) => (
	<>
		{title ? (
			<Head>
				<title>Sheep It | {title}</title>
			</Head>
		) : null}
			
		{/* Change content */}
		<main className='mx-auto max-w-screen-md pt-20 pb-16 px-safe sm:pb-0 h-screen bg-gradient-to-br from-blue to-white'>
			<div className='p-6'>{children}</div>
		</main>


	</>
)

export default Page
