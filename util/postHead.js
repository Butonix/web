import { urlName } from '@/util/urlName'

export const postHead = (post) => {
  if (!post) return { title: 'Post' }
  else
    return {
      title: post.title,
      link: [
        {
          rel: 'canonical',
          href: `https://www.getcomet.net/p/${post.id}/${urlName(post.title)}`
        }
      ],
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${post.title}`
        },
        {
          hid: 'og:site_name',
          property: 'og:site_name',
          content: `Comet - ${post.commentCount} Comment${
            post.commentCount === 1 ? '' : 's'
          } / ${post.endorsementCount} Rocket${
            post.endorsementCount === 1 ? '' : 's'
          }`
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content:
            post.type === 'TEXT'
              ? post.textContent
                ? `${post.textContent.substring(0, 100)}${
                    post.textContent.length >= 100 ? '...' : ''
                  }`
                : post.title
              : post.link
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content:
            post.type === 'IMAGE'
              ? post.link
              : post.thumbnailUrl
              ? post.thumbnailUrl
              : ''
        }
      ]
    }
}
