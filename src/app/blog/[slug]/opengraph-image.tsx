import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

// Image metadata
export const alt = 'Sunday AI Work Blog Post'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { slug } = await params
  
  // Fetch post data
  const { data: post } = await (await supabase)
    .from('blog_posts')
    .select('title')
    .eq('slug', slug)
    .single()

  const title = post?.title || 'Sunday AI Work Blog'

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0a0a0a, #1a1c3a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '10px 24px',
            borderRadius: '100px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            SUNDAY AI WORK
          </span>
        </div>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '1000px',
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              background: 'linear-gradient(to bottom, #ffffff, #a5a5a5)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#3b82f6',
            }}
          />
          <span
            style={{
              color: '#94a3b8',
              fontSize: 24,
            }}
          >
            sundayaiwork.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
