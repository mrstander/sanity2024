import InteractiveDetails from './InteractiveDetails'
import CTA from '@/ui/CTA'
import { CgChevronRight } from 'react-icons/cg'

export default function LinkList({ label, links }: Sanity.LinkList) {
	return (
		<InteractiveDetails className="group relative" closeAfterNavigate>
			<summary className="flex items-center gap-1">
				{label}
				<CgChevronRight className="transition-transform group-open:rotate-90 md:rotate-90" />
			</summary>

			<ul className="anim-fade-to-b md:frosted-glass left-0 top-full space-y-1 px-3 py-2 max-md:border-l md:absolute md:min-w-max md:rounded md:border md:bg-canvas md:shadow-md">
				{links?.map((link, key) => (
					<li key={key}>
						<CTA className="hover:link" link={link} />
					</li>
				))}
			</ul>
		</InteractiveDetails>
	)
}
