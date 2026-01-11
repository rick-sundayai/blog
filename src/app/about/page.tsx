import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import Header from '@/components/Header'

export default function AboutPage() {
  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com', color: 'hover:text-gray-300' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com', color: 'hover:text-blue-500' },
    { name: 'Email', icon: Mail, href: 'mailto:hello@sundayaiwork.com', color: 'hover:text-green-400' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Large Logo */}
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary mb-8 shadow-2xl">
              <span className="text-5xl font-bold text-primary-foreground">S</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              About <span className="gradient-text">Sunday AI Work</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Passionate about building the future with AI and automation. This is 
              where I share my weekend projects, learnings, and experiments at the 
              intersection of artificial intelligence and practical applications.
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg bg-card border border-border transition-all duration-200 ${social.color} hover:border-primary/50 hover:bg-card/80`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* The Story Section */}
          <div className="prose prose-invert max-w-none">
            <div className="bg-card/50 border border-border rounded-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-foreground">The Story</h2>
              
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  &ldquo;Sunday AI Work&rdquo; was born from a simple idea: dedicating my free time to exploring and building 
                  with emerging technologies. While my weekdays are filled with regular work, Sundays became my 
                  playground for experimentation.
                </p>
                
                <p>
                  I started documenting my projects and learnings, initially just for myself. But as the collection grew, I 
                  realized these insights might help others who are also curious about AI, automation, and modern 
                  technology.
                </p>
                
                <p>
                  Whether it&apos;s building intelligent workflows with n8n, experimenting with the latest LLMs, or finding 
                  creative ways to automate mundane tasks, every project here represents something I&apos;m genuinely 
                  excited about.
                </p>
                
                <p>
                  My approach is practical and hands-on. I believe the best way to understand new technology is to 
                  build something real with it. Each article and project focuses on practical implementations you can 
                  actually use, not just theoretical concepts.
                </p>
                
                <p>
                  The goal isn&apos;t to create the most complex solutions, but to find elegant ways to solve real problems 
                  using AI and automation. Sometimes the most valuable insights come from the simplest implementations.
                </p>
                
                <div className="mt-8 p-6 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-foreground font-medium">
                    &ldquo;Technology should amplify human capability, not replace human creativity. The most interesting 
                    projects happen at the intersection of artificial intelligence and genuine human curiosity.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-card/50 border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Current Focus</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Large Language Model integration</li>
                <li>• Workflow automation with n8n</li>
                <li>• RAG system development</li>
                <li>• Supabase edge functions</li>
                <li>• Real-time data processing</li>
              </ul>
            </div>

            <div className="bg-card/50 border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">Tech Stack</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Python, TypeScript, React</li>
                <li>• OpenAI, Anthropic APIs</li>
                <li>• Supabase, PostgreSQL</li>
                <li>• Next.js, Tailwind CSS</li>
                <li>• Docker, Vercel</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}