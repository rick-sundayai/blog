---
name: document-generator
description: Generate various document types including presentations, spreadsheets, reports, and PDFs using project patterns and web technologies
tools: [Read, Write, Edit, Bash]
---

# Document Generator

This skill helps generate various types of documents and presentations using web technologies and project patterns, providing functionality similar to document processing plugins.

## Instructions

When creating documents:

1. **Document Types Supported**:
   - HTML presentations (reveal.js style)
   - CSV/JSON data exports for spreadsheet use
   - Markdown reports convertible to PDF
   - HTML dashboards and reports
   - API documentation
   - Technical specifications

2. **Follow Project Conventions**:
   - Use TypeScript for any data processing scripts
   - Follow the established folder structure
   - Use Tailwind CSS for styling HTML documents
   - Maintain consistent branding and theme

3. **Output Formats**:
   - **Presentations**: HTML with CSS animations and transitions
   - **Data Reports**: JSON/CSV with optional HTML visualization
   - **Documentation**: Markdown with proper formatting
   - **Dashboards**: React components or static HTML

## Document Templates

### Presentation Template (HTML)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #191D24; color: #F5F5F5; }
        .slide { min-height: 100vh; padding: 2rem; }
        .primary { color: #34D399; }
    </style>
</head>
<body>
    <div class="slide flex flex-col justify-center items-center">
        <h1 class="text-6xl font-bold primary mb-8">{{TITLE}}</h1>
        <p class="text-xl text-center max-w-4xl">{{SUBTITLE}}</p>
    </div>
    <!-- Additional slides -->
</body>
</html>
```

### Data Export Template (TypeScript)
```typescript
interface DataExport {
  filename: string;
  format: 'json' | 'csv';
  data: Record<string, any>[];
}

export function exportData(data: any[], format: 'json' | 'csv' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  if (format === 'csv') {
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    return csv;
  }
  
  return '';
}
```

### Report Template (Markdown)
```markdown
# {{TITLE}}

**Generated**: {{DATE}}  
**Project**: {{PROJECT_NAME}}

## Executive Summary
{{SUMMARY}}

## Data Analysis
{{DATA_SECTION}}

## Recommendations
{{RECOMMENDATIONS}}

---
*Generated using Claude Skills*
```

## Usage Examples

- **"Create a presentation about our authentication system"**: Generates HTML presentation with project styling
- **"Export user data as CSV"**: Creates data export functionality with proper formatting
- **"Generate a security audit report"**: Creates comprehensive markdown report
- **"Build a dashboard showing user metrics"**: Creates HTML dashboard with charts
- **"Create API documentation"**: Generates formatted API docs

## File Organization

- **Presentations**: `docs/presentations/`
- **Reports**: `docs/reports/`
- **Data Exports**: `docs/exports/`
- **Dashboards**: `docs/dashboards/`
- **Scripts**: `scripts/document-generation/`

## Advanced Features

### Chart Generation
```javascript
// Using Chart.js for data visualization
function createChart(data, type = 'line') {
  return `
    <canvas id="chart"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      new Chart(document.getElementById('chart'), {
        type: '${type}',
        data: ${JSON.stringify(data)}
      });
    </script>
  `;
}
```

### PDF Generation
```bash
# Convert HTML to PDF using headless Chrome
npx puppeteer-core --print-to-pdf document.html
```

This skill provides comprehensive document generation capabilities without requiring external plugins.