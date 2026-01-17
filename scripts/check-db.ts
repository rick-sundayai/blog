
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = envContent.split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    acc[match[1]] = match[2]
  }
  return acc
}, {} as Record<string, string>)

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDb() {
  console.log('Checking database connection...')
  const { data, error } = await supabase
    .from('blog_categories')
    .select('count')
    .limit(1)

  if (error) {
    console.error('Error connecting to database:', error.message)
    console.error('It seems the database tables might not be set up.')
  } else {
    console.log('Successfully connected to blog_categories table!')
    console.log('Data sample:', data)
  }
}

checkDb()
