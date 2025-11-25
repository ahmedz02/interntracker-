// Content script to extract job information from common job sites
// This tries to detect company and role from the page

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobInfo') {
    const jobInfo = extractJobInfo();
    sendResponse(jobInfo);
  }
  return true;
});

function extractJobInfo() {
  let company = '';
  let role = '';

  // Try to extract from common job site patterns
  const selectors = [
    // LinkedIn
    { company: '[data-test-id="job-poster"]', role: 'h1' },
    { company: '.jobs-details-top-card__company-name', role: '.jobs-details-top-card__job-title' },
    
    // Indeed
    { company: '[data-testid="job-company-name"]', role: '[data-testid="job-title"]' },
    { company: '.jobsearch-InlineCompanyRating', role: '.jobsearch-JobInfoHeader-title' },
    
    // Glassdoor
    { company: '.employerName', role: '.jobTitle' },
    
    // Generic patterns
    { company: '[class*="company"]', role: '[class*="title"]' },
    { company: '[class*="employer"]', role: '[class*="job-title"]' },
    { company: 'h2', role: 'h1' }
  ];

  for (const selector of selectors) {
    const companyEl = document.querySelector(selector.company);
    const roleEl = document.querySelector(selector.role);
    
    if (companyEl && roleEl) {
      company = companyEl.textContent.trim();
      role = roleEl.textContent.trim();
      
      // Clean up common prefixes/suffixes
      company = company.replace(/^at\s+/i, '').trim();
      role = role.replace(/^internship\s*/i, '').trim();
      
      if (company && role) {
        break;
      }
    }
  }

  // Fallback: try to get from page title
  if (!company || !role) {
    const title = document.title;
    const titleMatch = title.match(/(.+?)\s*[-|]\s*(.+)/);
    if (titleMatch) {
      if (!role) role = titleMatch[1].trim();
      if (!company) company = titleMatch[2].trim();
    }
  }

  return {
    company: company || '',
    role: role || ''
  };
}

