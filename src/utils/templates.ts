export interface TemplateItem {
  id: string;
  title: string;
  category: 'Business' | 'Academic' | 'Personal' | 'Legal & Finance';
  description: string;
  previewSnippet: string;
  contentHtml: string;
  suggestedFont: string;
}

export const DOCUMENT_TEMPLATES: TemplateItem[] = [
  {
    id: 'blank',
    title: 'Blank Document',
    category: 'Personal',
    description: 'Start fresh with a clean, unformatted canvas.',
    previewSnippet: 'Start typing your document...',
    suggestedFont: '"Plus Jakarta Sans", sans-serif',
    contentHtml: `
      <h1 style="font-size: 26pt; font-weight: 700; color: #1E293B; margin-bottom: 12pt; line-height: 1.2;">Document Title</h1>
      <p style="font-size: 11pt; color: #475569; margin-bottom: 14pt; line-height: 1.6;">Start drafting your thoughts, reports, or articles here. Select text to format fonts, apply vibrant Office colors, or insert tables, images, and signatures.</p>
    `
  },
  {
    id: 'executive_report',
    title: 'Executive Business Report',
    category: 'Business',
    description: 'Corporate quarterly briefing with key performance metrics, findings, and strategic outlook.',
    previewSnippet: 'Q3 Financial Performance & Market Strategic Review',
    suggestedFont: '"DM Sans", sans-serif',
    contentHtml: `
      <div style="border-bottom: 3px solid #1F497D; padding-bottom: 8pt; margin-bottom: 18pt;">
        <p style="font-size: 10pt; text-transform: uppercase; letter-spacing: 0.1em; color: #1F497D; font-weight: 600; margin: 0 0 4pt 0;">Quarterly Intelligence Briefing</p>
        <h1 style="font-size: 26pt; font-weight: 700; color: #0F172A; margin: 0 0 6pt 0; line-height: 1.2;">Enterprise Growth & Strategic Operations Report</h1>
        <p style="font-size: 11pt; color: #64748B; margin: 0;">Prepared for: Executive Committee &middot; October 2026 &middot; Confidential</p>
      </div>

      <h2 style="font-size: 16pt; font-weight: 600; color: #1F497D; margin-top: 16pt; margin-bottom: 8pt; border-bottom: 1px solid #E2E8F0; padding-bottom: 4pt;">1. Executive Summary</h2>
      <p style="font-size: 11pt; line-height: 1.65; color: #334155; margin-bottom: 12pt;">
        During the preceding fiscal cycle, the organization achieved a <strong>24.6% expansion</strong> in recurring enterprise engagements, outperforming quarterly targets by $3.4M. Operational restructuring across northern logistics hubs delivered immediate margin optimization of 310 basis points.
      </p>

      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12pt 16pt; margin: 14pt 0 16pt 0;">
        <p style="font-size: 10pt; font-weight: 600; color: #1E293B; margin: 0 0 6pt 0;">Core Operating Highlights:</p>
        <ul style="margin: 0; padding-left: 18pt; font-size: 10.5pt; color: #475569; line-height: 1.6;">
          <li>Consolidated operating revenues reached $48.2M (+18.4% YoY).</li>
          <li>Enterprise customer retention stabilized at 96.8% with zero churn in top-50 accounts.</li>
          <li>Completed initial rollout of automated workflow pipelines with 99.98% SLA compliance.</li>
        </ul>
      </div>

      <h2 style="font-size: 16pt; font-weight: 600; color: #1F497D; margin-top: 20pt; margin-bottom: 8pt; border-bottom: 1px solid #E2E8F0; padding-bottom: 4pt;">2. Financial Performance Matrix</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 12pt 0 18pt 0; font-size: 10.5pt;">
        <thead>
          <tr style="background-color: #1F497D; color: #FFFFFF; text-align: left;">
            <th style="padding: 8pt 10pt; border: 1px solid #17365D;">Segment</th>
            <th style="padding: 8pt 10pt; border: 1px solid #17365D;">Q2 Target</th>
            <th style="padding: 8pt 10pt; border: 1px solid #17365D;">Q2 Actual</th>
            <th style="padding: 8pt 10pt; border: 1px solid #17365D;">Variance</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background-color: #FFFFFF;">
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; font-weight: 500;">Core Cloud Solutions</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0;">$22,500,000</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; font-weight: 600; color: #0F766E;">$25,410,000</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; color: #047857;">+12.9%</td>
          </tr>
          <tr style="background-color: #F8FAFC;">
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; font-weight: 500;">Enterprise Professional Services</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0;">$14,200,000</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; font-weight: 600; color: #0F766E;">$14,890,000</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; color: #047857;">+4.8%</td>
          </tr>
          <tr style="background-color: #FFFFFF;">
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; font-weight: 500;">Infrastructure Licensing</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0;">$8,100,000</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; font-weight: 600; color: #0F766E;">$7,900,000</td>
            <td style="padding: 8pt 10pt; border: 1px solid #E2E8F0; color: #B45309;">-2.4%</td>
          </tr>
        </tbody>
      </table>

      <h2 style="font-size: 16pt; font-weight: 600; color: #1F497D; margin-top: 18pt; margin-bottom: 8pt; border-bottom: 1px solid #E2E8F0; padding-bottom: 4pt;">3. Conclusion & Next Quarter Directives</h2>
      <p style="font-size: 11pt; line-height: 1.65; color: #334155; margin-bottom: 16pt;">
        Leadership confirms resource mobilization for APAC deployment commencing November 1st. Priority capital expenditures will be deployed toward latency reduction and team capacity scaling.
      </p>
    `
  },
  {
    id: 'modern_resume',
    title: 'Modern Executive CV / Resume',
    category: 'Personal',
    description: 'Polished, high-impact curriculum vitae with typographic hierarchy and clean skill matrices.',
    previewSnippet: 'Senior Technical Lead & Systems Architect',
    suggestedFont: '"Plus Jakarta Sans", sans-serif',
    contentHtml: `
      <div style="border-bottom: 2px solid #0F172A; padding-bottom: 10pt; margin-bottom: 14pt;">
        <h1 style="font-size: 24pt; font-weight: 700; color: #0F172A; margin: 0 0 4pt 0;">ALEXANDRA CHEN</h1>
        <p style="font-size: 12pt; font-weight: 500; color: #475569; margin: 0 0 6pt 0;">Principal Software Architect &middot; Distributed Systems Lead</p>
        <p style="font-size: 9.5pt; color: #64748B; margin: 0;">
          San Francisco, CA &middot; alexandra.chen@example.com &middot; +1 (415) 892-0193 &middot; linkedin.com/in/alexandrachen
        </p>
      </div>

      <h2 style="font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0F172A; border-bottom: 1px solid #CBD5E1; padding-bottom: 3pt; margin-top: 12pt; margin-bottom: 8pt;">Professional Summary</h2>
      <p style="font-size: 10.5pt; line-height: 1.6; color: #334155; margin-bottom: 12pt;">
        Architect with 11+ years leading high-throughput distributed architectures, real-time sync systems, and developer platforms. Built mission-critical services handling 180M+ daily requests at 99.995% uptime while mentoring cross-functional engineering organizations.
      </p>

      <h2 style="font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0F172A; border-bottom: 1px solid #CBD5E1; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 8pt;">Experience</h2>

      <div style="margin-bottom: 10pt;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2pt;">
          <strong style="font-size: 11pt; color: #0F172A;">Principal Architect &middot; CloudScale Systems</strong>
          <span style="font-size: 9.5pt; color: #64748B;">2022 &ndash; Present</span>
        </div>
        <ul style="margin: 4pt 0 0 0; padding-left: 16pt; font-size: 10pt; color: #475569; line-height: 1.55;">
          <li>Architected multi-tenant streaming data platform handling 450,000 events/sec with sub-40ms latency.</li>
          <li>Reduced global AWS compute expenditure by $1.8M annually through targeted memory optimization.</li>
          <li>Led technical review council overseeing 8 squad architectures across North America and Europe.</li>
        </ul>
      </div>

      <div style="margin-bottom: 10pt;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2pt;">
          <strong style="font-size: 11pt; color: #0F172A;">Lead Staff Engineer &middot; Nexus Data Labs</strong>
          <span style="font-size: 9.5pt; color: #64748B;">2018 &ndash; 2022</span>
        </div>
        <ul style="margin: 4pt 0 0 0; padding-left: 16pt; font-size: 10pt; color: #475569; line-height: 1.55;">
          <li>Designed and launched enterprise document collaborative engine supporting 2M active monthly seats.</li>
          <li>Spearheaded zero-downtime database migration for 4.2TB mission-critical PostgreSQL cluster.</li>
        </ul>
      </div>

      <h2 style="font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0F172A; border-bottom: 1px solid #CBD5E1; padding-bottom: 3pt; margin-top: 14pt; margin-bottom: 8pt;">Education & Skills</h2>
      <p style="font-size: 10pt; line-height: 1.6; color: #334155; margin: 0 0 4pt 0;">
        <strong>B.S. in Computer Science</strong> &middot; University of California, Berkeley (2015) &middot; Honors in Distributed Systems
      </p>
      <p style="font-size: 9.5pt; color: #475569; margin: 0;">
        <strong>Core Technologies:</strong> TypeScript, Go, Rust, PostgreSQL, Kubernetes, Redis, Distributed Consensus, WebAssembly.
      </p>
    `
  },
  {
    id: 'project_proposal',
    title: 'Project Proposal & Scope of Work',
    category: 'Business',
    description: 'Detailed client proposal specifying milestones, investment, and operational scope.',
    previewSnippet: 'Interactive Web Platform Modernization Scope',
    suggestedFont: '"Outfit", sans-serif',
    contentHtml: `
      <div style="text-align: center; margin-bottom: 24pt; border-bottom: 1px solid #CBD5E1; padding-bottom: 16pt;">
        <h1 style="font-size: 26pt; font-weight: 700; color: #0F172A; margin: 0 0 8pt 0;">Project Scope & Proposal</h1>
        <p style="font-size: 12pt; color: #475569; margin: 0 0 4pt 0;">Next-Generation Document Management Platform Modernization</p>
        <p style="font-size: 10pt; color: #94A3B8; margin: 0;">Client: Horizon Media Group &middot; Date: October 19, 2026</p>
      </div>

      <h2 style="font-size: 15pt; font-weight: 600; color: #0F172A; margin-top: 14pt; margin-bottom: 8pt;">1. Objective & Background</h2>
      <p style="font-size: 11pt; line-height: 1.65; color: #334155; margin-bottom: 12pt;">
        Horizon Media requires an upgraded digital document and PDF editing environment designed to unify publishing workflows, streamline compliance reviews, and eliminate third-party per-seat licensing bottlenecks.
      </p>

      <h2 style="font-size: 15pt; font-weight: 600; color: #0F172A; margin-top: 16pt; margin-bottom: 8pt;">2. Proposed Deliverables & Timeline</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 10pt 0 16pt 0; font-size: 10.5pt;">
        <thead>
          <tr style="background-color: #F1F5F9; color: #0F172A; text-align: left;">
            <th style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Phase</th>
            <th style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Milestone Scope</th>
            <th style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Duration</th>
            <th style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1; font-weight: 600;">Phase I</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Architecture, UI Ribbon System & Rich Canvas</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Weeks 1&ndash;3</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1; color: #059669; font-weight: 500;">Approved</td>
          </tr>
          <tr>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1; font-weight: 600;">Phase II</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">PDF Studio, Direct Annotation & Signatures</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Weeks 4&ndash;6</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1; color: #D97706; font-weight: 500;">In Progress</td>
          </tr>
          <tr>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1; font-weight: 600;">Phase III</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Multi-Format Converter (PDF, DOCX, Markdown, HTML)</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1;">Weeks 7&ndash;8</td>
            <td style="padding: 8pt 10pt; border: 1px solid #CBD5E1; color: #64748B;">Scheduled</td>
          </tr>
        </tbody>
      </table>

      <h2 style="font-size: 15pt; font-weight: 600; color: #0F172A; margin-top: 16pt; margin-bottom: 8pt;">3. Signoff & Authorization</h2>
      <p style="font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 18pt;">
        By signing below, the participating parties authorize execution of this scope under agreed commercial terms.
      </p>

      <div style="display: flex; justify-content: space-between; margin-top: 24pt; padding-top: 16pt; border-top: 1px solid #E2E8F0;">
        <div style="width: 45%;">
          <div style="border-bottom: 1px solid #0F172A; padding-bottom: 24pt; margin-bottom: 4pt;"></div>
          <p style="font-size: 10pt; font-weight: 600; color: #0F172A; margin: 0;">Authorized Client Representative</p>
          <p style="font-size: 9pt; color: #64748B; margin: 2pt 0 0 0;">Date: ________________________</p>
        </div>
        <div style="width: 45%;">
          <div style="border-bottom: 1px solid #0F172A; padding-bottom: 24pt; margin-bottom: 4pt;"></div>
          <p style="font-size: 10pt; font-weight: 600; color: #0F172A; margin: 0;">Lead Contractor Representative</p>
          <p style="font-size: 9pt; color: #64748B; margin: 2pt 0 0 0;">Date: ________________________</p>
        </div>
      </div>
    `
  },
  {
    id: 'formal_invoice',
    title: 'Professional Invoice & Billing Statement',
    category: 'Legal & Finance',
    description: 'Clean invoice with itemized balance calculation, bank details, and digital sign-off.',
    previewSnippet: 'INVOICE #INV-2026-0891 &middot; Due Upon Receipt',
    suggestedFont: '"Plus Jakarta Sans", sans-serif',
    contentHtml: `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20pt; border-bottom: 2px solid #0F172A; padding-bottom: 12pt;">
        <div>
          <h1 style="font-size: 26pt; font-weight: 800; color: #0F172A; margin: 0;">INVOICE</h1>
          <p style="font-size: 11pt; color: #64748B; margin: 4pt 0 0 0;">Invoice #INV-2026-0891</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 11pt; font-weight: 700; color: #0F172A; margin: 0;">DOCUCRAFT DESIGN LABS</p>
          <p style="font-size: 9.5pt; color: #64748B; margin: 2pt 0 0 0;">500 Howard Street, Suite 400<br/>San Francisco, CA 94105<br/>billing@docucraft.io</p>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 18pt; font-size: 10.5pt;">
        <div>
          <strong style="color: #64748B; text-transform: uppercase; font-size: 9pt;">Billed To:</strong>
          <p style="color: #0F172A; font-weight: 600; margin: 4pt 0 2pt 0;">Apex Vanguard Enterprises</p>
          <p style="color: #475569; margin: 0; line-height: 1.5;">Attn: Financial Controller<br/>742 Evergreen Terrace<br/>New York, NY 10001</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 2pt 0;"><strong>Invoice Date:</strong> Oct 19, 2026</p>
          <p style="margin: 2pt 0;"><strong>Payment Terms:</strong> Net 30</p>
          <p style="margin: 2pt 0; color: #B91C1C; font-weight: 600;"><strong>Due Date:</strong> Nov 18, 2026</p>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 18pt; font-size: 10.5pt;">
        <thead>
          <tr style="background-color: #0F172A; color: #FFFFFF; text-align: left;">
            <th style="padding: 8pt 10pt; width: 50%;">Service Description</th>
            <th style="padding: 8pt 10pt; text-align: center;">Hours / Units</th>
            <th style="padding: 8pt 10pt; text-align: right;">Rate</th>
            <th style="padding: 8pt 10pt; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0;">
              <strong>Enterprise Software Architecture & System Design</strong><br/>
              <span style="font-size: 9pt; color: #64748B;">Core infrastructure blueprint & security hardening</span>
            </td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: center;">40 hrs</td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: right;">$175.00</td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: 600;">$7,000.00</td>
          </tr>
          <tr>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0;">
              <strong>Full-Stack Document Suite & PDF Studio Engineering</strong><br/>
              <span style="font-size: 9pt; color: #64748B;">Client-side annotation engine, typography palette, and multi-format converters</span>
            </td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: center;">65 hrs</td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: right;">$160.00</td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: 600;">$10,400.00</td>
          </tr>
          <tr>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0;">
              <strong>QA Test Automation & Production Deployment</strong><br/>
              <span style="font-size: 9pt; color: #64748B;">Cross-browser verification and cloud deployment</span>
            </td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: center;">20 hrs</td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: right;">$150.00</td>
            <td style="padding: 8pt 10pt; border-bottom: 1px solid #E2E8F0; text-align: right; font-weight: 600;">$3,000.00</td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 24pt;">
        <div style="width: 260px; font-size: 11pt;">
          <div style="display: flex; justify-content: space-between; padding: 4pt 0;">
            <span style="color: #64748B;">Subtotal:</span>
            <span>$20,400.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 4pt 0;">
            <span style="color: #64748B;">Tax (0% B2B Service):</span>
            <span>$0.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8pt 0; border-top: 2px solid #0F172A; font-weight: 700; font-size: 13pt; color: #0F172A;">
            <span>Total Due:</span>
            <span>$20,400.00 USD</span>
          </div>
        </div>
      </div>

      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12pt; font-size: 9.5pt; color: #475569;">
        <strong>Remittance Instructions:</strong> Wire Transfer to First National Bank &middot; Routing: 121000358 &middot; Account: 9840291048 &middot; SWIFT: FNBKUS33
      </div>
    `
  }
];
