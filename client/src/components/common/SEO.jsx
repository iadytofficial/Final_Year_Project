import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description }) {
  return (
    <Helmet>
      <title>{title ? `${title} · AgroLK` : 'AgroLK'}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title ? `${title} · AgroLK` : 'AgroLK'} />
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  )
}
