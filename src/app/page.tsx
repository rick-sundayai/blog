import Link from 'next/link'
import Header from '@/components/Header'

export default function HomePage() {
  const techBadges = [
    'n8n',
    'Supabase', 
    'OpenAI',
    'LangChain',
    'Python',
    'React'
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <main className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-glow opacity-50" />
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Tagline */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm">
              <span className="text-primary text-sm mr-2">🚀</span>
              <span className="text-sm text-muted-foreground">Building the future, one Sunday at a time</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center max-w-5xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Exploring{' '}
              <span className="gradient-text">AI, Automation,</span>
              <br />
              and Modern Tech
            </h1>
          </div>

          {/* Subtitle */}
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Practical guides and deep dives into artificial intelligence, workflow 
              automation, LLMs, and cutting-edge technologies. Real projects built in 
              my free time.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Read the Blog
              <span className="ml-2">→</span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-muted/50 text-foreground font-semibold rounded-lg border border-border transition-colors duration-200"
            >
              About Me
            </Link>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
            {techBadges.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted/50 text-muted-foreground border border-border/50 hover:border-primary/50 hover:text-foreground transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}