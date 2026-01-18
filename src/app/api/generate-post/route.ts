import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title } = body

    if (!body.title && !body.content) {
      return NextResponse.json(
        { error: 'Title or Content is required for generation' },
        { status: 400 }
      )
    }

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.error('N8N_WEBHOOK_URL is not defined')
      return NextResponse.json(
        { error: 'Server configuration error: N8N_WEBHOOK_URL not set' },
        { status: 500 }
      )
    }

    console.log('Sending request to n8n:', { url: n8nWebhookUrl, body })

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      let errorMessage = `n8n responded with status: ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData && errorData.message) {
          errorMessage = errorData.message
        } else if (errorData && typeof errorData.error === 'string') {
          errorMessage = errorData.error
        }
      } catch (e) {
        // If not JSON, try text
        try {
          const errorText = await response.text()
          if (errorText) errorMessage = errorText
        } catch (t_err) {
          // Ignore text parsing errors
        }
      }
      
      console.error(`n8n error detail:`, errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const responseText = await response.text()
    console.log('n8n raw response received:', responseText)

    let data
    try {
      data = responseText ? JSON.parse(responseText) : {}
    } catch (e) {
      console.error('Failed to parse n8n response as JSON:', e)
      return NextResponse.json(
        { error: 'Invalid response from generation service' },
        { status: 502 }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error generating blog post:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate blog post'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
