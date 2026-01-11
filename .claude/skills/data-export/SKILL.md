---
name: data-export
description: Export and analyze data from the Supabase database in various formats for reporting and analysis
tools: [Read, Write, Edit, Bash]
---

# Data Export and Analysis

This skill helps export user data and analytics from the Supabase database into various formats for analysis, reporting, and business intelligence.

## Instructions

When working with data exports:

1. **Database Connectivity**:
   - Use the existing Supabase configuration from `src/lib/supabase/`
   - Ensure proper Row Level Security (RLS) compliance
   - Use service role key for administrative data exports (when appropriate)
   - Always respect user privacy and data protection regulations

2. **Export Formats**:
   - JSON for API consumption
   - CSV for spreadsheet analysis
   - SQL for database imports
   - HTML tables for reports
   - Charts and visualizations using Chart.js

3. **Data Types to Export**:
   - User profiles and statistics
   - Authentication logs
   - Usage metrics
   - Performance analytics
   - Error logs and debugging data

## Export Templates

### User Analytics Export
```typescript
import { createClient } from '@/lib/supabase/server'

interface UserAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  usersByDate: { date: string; count: number }[];
}

export async function exportUserAnalytics(): Promise<UserAnalytics> {
  const supabase = createClient()
  
  // Total users
  const { count: totalUsers } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
  
  // New users this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  
  const { count: newUsersThisMonth } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString())
  
  return {
    totalUsers: totalUsers || 0,
    newUsersThisMonth: newUsersThisMonth || 0,
    activeUsers: 0, // Implement based on your activity definition
    usersByDate: [] // Implement date-based aggregation
  }
}
```

### CSV Export Function
```typescript
export function generateCSV(data: Record<string, any>[], filename: string): void {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if necessary
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')
  
  // Save to file
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

### Report Generation Template
```typescript
interface ReportData {
  title: string;
  period: string;
  metrics: Record<string, number>;
  trends: Array<{ metric: string; change: number; period: string }>;
}

export function generateHTMLReport(data: ReportData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { background: #191D24; color: #F5F5F5; }
    </style>
</head>
<body class="p-8">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-4xl font-bold text-green-400 mb-8">${data.title}</h1>
        <p class="text-xl mb-8">Period: ${data.period}</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            ${Object.entries(data.metrics).map(([key, value]) => `
                <div class="bg-gray-800 p-6 rounded-lg border border-gray-600">
                    <h3 class="text-lg font-medium text-green-400">${key}</h3>
                    <p class="text-3xl font-bold">${value}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="bg-gray-800 p-6 rounded-lg border border-gray-600">
            <canvas id="trendsChart" width="400" height="200"></canvas>
        </div>
    </div>
    
    <script>
        // Add chart initialization
        const ctx = document.getElementById('trendsChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(data.trends.map(t => t.period))},
                datasets: [{
                    label: 'Growth Trend',
                    data: ${JSON.stringify(data.trends.map(t => t.change))},
                    borderColor: '#34D399',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#F5F5F5' } }
                },
                scales: {
                    x: { ticks: { color: '#F5F5F5' } },
                    y: { ticks: { color: '#F5F5F5' } }
                }
            }
        });
    </script>
</body>
</html>
  `
}
```

## Usage Examples

- **"Export all user data to CSV"**: Creates a CSV file with user profile information
- **"Generate monthly analytics report"**: Creates HTML report with charts and metrics
- **"Export authentication logs for security audit"**: Generates security-focused data export
- **"Create user growth dashboard"**: Builds interactive dashboard showing user metrics
- **"Export data for GDPR compliance"**: Creates user-specific data export for privacy requests

## Security Considerations

1. **Data Privacy**: Always anonymize sensitive data in exports
2. **Access Control**: Ensure proper authentication before allowing exports
3. **Audit Logging**: Log all data export operations
4. **Rate Limiting**: Implement limits on export frequency
5. **Encryption**: Encrypt sensitive exports at rest

## File Organization

- **Export Scripts**: `scripts/exports/`
- **Generated Reports**: `docs/reports/analytics/`
- **Data Files**: `docs/exports/` (gitignored)
- **Templates**: `.claude/skills/data-export/templates/`

## API Integration

```typescript
// API route for secure data exports
// app/api/admin/export/route.ts
export async function POST(request: Request) {
  // Verify admin privileges
  // Generate export based on request parameters
  // Return secure download link or data
}
```

This skill provides comprehensive data export and analytics capabilities for your authentication system.