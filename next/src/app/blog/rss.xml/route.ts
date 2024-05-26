import { fetchSanity, groq } from '@/lib/sanity/fetch'
import processUrl, { BASE_URL } from '@/lib/processUrl'
import { Feed } from 'feed'
import { escapeHTML, toHTML } from '@portabletext/to-html'
import { urlFor } from '@/lib/sanity/urlFor'

export async function GET() {
	const { blog, posts, site } = await fetchSanity<{
		blog: Sanity.Page
		posts: Array<Sanity.BlogPost & { image?: string }>
		site: { copyright: string }
	}>(
		groq`{
			'blog': *[_type == 'page' && metadata.slug.current == 'blog'][0]{
				_type,
				title,
				metadata,
				'image': metadata.image.asset->url
			},
			'posts': *[_type == 'blog.post']{
				_type,
				body,
				publishDate,
				metadata
			},
			'site': *[_type == 'site'][0]{
				'copyright': pt::text(copyright)
			}
		}`,
		{ tags: ['blog-rss'] },
	)

	const url = processUrl(blog)

	const feed = new Feed({
		title: blog?.title || blog.metadata.title,
		description: blog.metadata.description,
		link: url,
		id: url,
		copyright: site.copyright,
		favicon: BASE_URL + 'favicon.ico',
		language: 'en',
		generator: 'https://github.com/nuotsu/next-sanity-template',
	})

	posts.map((post) =>
		feed.addItem({
			title: post.metadata.title,
			description: post.metadata.description,
			id: processUrl(post),
			link: processUrl(post),
			date: new Date(post.publishDate),
			content: toHTML(post.body, {
				components: {
					types: {
						image: ({ value }) =>
							`<img src="${urlFor(value).url()}" alt="${value.alt}" />`,
						'code-block': ({ value }) =>
							`<pre><code>${escapeHTML(value.code)}</code></pre>`,
					},
				},
			}),
			image: post.image,
		}),
	)

	return new Response(feed.atom1(), {
		headers: {
			'Content-Type': 'application/atom+xml',
		},
	})
}
