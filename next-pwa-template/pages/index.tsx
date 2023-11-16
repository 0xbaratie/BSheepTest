import Page from '@/components/page'
import Section from '@/components/section'
import Sheep from '../public/images/sheep.svg'

const Index = () => (
	<>
	  <div className="hidden sm:block">
			<p>The display here appears on non-smartphones.</p>
		</div>
	  <div className='sm:hidden'>
			<Page >
				<Section>
					<img src="/images/sheep.svg" alt="Sheep Icon" className="w-18 h-18" />
				</Section>
			</Page>
		</div>
	</>
  
	
)

export default Index
