# Portfolio design research

Reviewed October 16, 2026. These references informed the redesign; they are examples and guidance, not evidence that a particular visual treatment guarantees hiring results.

## References and observations

- [Brittany Chiang](https://brittanychiang.com/): an immediate role statement, clear experience history, project descriptions and technology labels, with a readily available resume. Adapted the emphasis on specific contributions and readable project context.
- [Lee Robinson](https://leerob.com/): a concise identity and biography followed by selected writing. Adapted the direct introduction and restrained information hierarchy.
- [Josh W Comeau](https://www.joshwcomeau.com/): technical content with descriptive introductions and category navigation. Adapted the use of useful visual explanations rather than decorative motion.
- [NN/g portfolio guidance](https://www.nngroup.com/articles/ux-design-portfolios/): recommends selecting a few relevant projects and explaining their problems, contributions and constraints. The article concerns UX portfolios; applying that structure to cloud and security projects is a design judgment for this site.
- [NN/g credibility research](https://www.nngroup.com/articles/trustworthy-design/): discusses organized navigation, appropriate design, current content and transparent information as credibility factors. Applied through clear labels and explicit prototype status.
- [web.dev responsive design guidance](https://web.dev/articles/new-responsive): highlights responsiveness to user preferences, including reduced motion. Applied through responsive layouts and reduced-motion behavior.

## Implementation

The site uses warm neutral backgrounds, dark green accents, system typography and a consistent spacing scale. A project architecture overview makes the cloud focus concrete. All visuals are HTML, CSS or SVG; no stock imagery, generated project screenshots or external font downloads are required.

Three projects lead the page: Neubie for cloud work, the JWT assessment for security, and the hall reservation system for application integration. Their details explain problems, contributions and scope. Seven additional projects remain available in an expandable, filterable archive.

Experience, technical focus, education and Oracle credentials have distinct sections. Contact links and the existing one-page PDF and Word resume downloads remain available. Existing project facts and prototype limitations are preserved; no new certifications, employment dates or outcomes were invented.

## Verification

Checked HTTP delivery of the page assets and both resume files. Browser checks covered all ten native project disclosures, keyboard use, archive filter results and accessible state, internal anchors, and page overflow at 320, 375, 768, 1024 and 1440 pixels with details both closed and expanded. Also checked reduced motion, content and disclosures with JavaScript disabled, and JavaScript runtime errors.

Desktop and mobile screenshots were visually reviewed. Production deployment status should be verified with the hosting provider after publication.
