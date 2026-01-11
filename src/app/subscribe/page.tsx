'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import Header from '@/components/Header'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsSubmitting(false)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {!isSubscribed ? (
              <>
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                    Stay <span className="gradient-text">Connected</span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                    Join the newsletter to get the latest insights on AI, automation, and modern technology. 
                    No spam, just quality content delivered to your inbox.
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-4 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-foreground placeholder-muted-foreground text-center"
                    />
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-6 py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-colors duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                          Subscribing...
                        </div>
                      ) : (
                        <>
                          Subscribe to Newsletter
                        </>
                      )}
                    </button>
                  </form>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Weekly updates • Unsubscribe anytime • No spam ever
                  </p>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl">🚀</span>
                    </div>
                    <h3 className="font-semibold mb-2">Latest Projects</h3>
                    <p className="text-sm text-muted-foreground">
                      Get updates on the newest AI and automation experiments
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl">📚</span>
                    </div>
                    <h3 className="font-semibold mb-2">Tutorials & Guides</h3>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step tutorials to build your own AI solutions
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl">💡</span>
                    </div>
                    <h3 className="font-semibold mb-2">Industry Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Analysis of trends and emerging technologies
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-16">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                  Welcome <span className="gradient-text">Aboard!</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  You have successfully subscribed to the Sunday AI Work newsletter. 
                  Check your inbox for a confirmation email.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="/blog"
                    className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors duration-200"
                  >
                    Read the Blog
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center px-6 py-3 bg-transparent hover:bg-muted/50 text-foreground font-semibold rounded-lg border border-border transition-colors duration-200"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}