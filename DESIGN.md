# Portfolio design

Updated October 19, 2026.

## Reference

The user requested the theme and layout of [Brittany Chiang's portfolio](https://brittanychiang.com/). The live site was reviewed for its desktop split layout, dark navy palette, slate typography, teal accents, navigation indicators, project rows and hover treatment. The implementation uses the user's own content and independently written HTML, CSS and JavaScript. Brittany's biography, employment history, projects, images and source code were not reused. The footer credits the design inspiration.

## Adaptation

- A sticky identity sidebar contains Felix's introduction, in-page navigation, resume download and professional links.
- The scrolling column contains About, Experience, Projects, Learning and Credentials, and Contact.
- Mobile and tablet screens use a single column with sticky section headings and a compact navigation row.
- Three compact project illustrations describe the user's cloud, JWT assessment and reservation work. Seven additional projects retain native disclosures and filtering.
- Credentials retain verified course titles, dates and certificate links. ISC2 CC is described as a scheduled exam rather than an earned credential.
- Hover and keyboard focus receive matching card treatments. The cursor glow is limited to desktop pointers and disabled for reduced motion. Navigation follows the current reading position.
- System fonts avoid external font requests. The site has no framework, build step or runtime dependency.

## Motion update October 20

The supplied short video primarily showcases layered hero layouts, product depth and colored backlighting. The portfolio adapts that visual language through slow blue/teal ambient lighting, a soft introduction halo, a staggered entrance, one-time scroll reveals, and small project-illustration tilt and sheen effects. The existing split layout and project facts remain intact. No third-party video, product image or creator branding is embedded.

Motion is a progressive enhancement in `motion.css` and `script.js`. Content remains available without JavaScript. Keyboard focus reveals its destination immediately. A visible pause/resume control disables motion, while operating-system reduced-motion preferences disable effects automatically and are honored when changed during the session. Continuous ambient motion is disabled on small screens, and hover tilt is limited to desktop pointers.

## Verification

Browser checks passed at 320, 375, 768, 1024 and 1440 pixels, with project details both open and closed. Checks covered ten keyboard disclosures, archive counts and accessible filter state, internal anchors, current PDF and Word downloads, seven credentials and three Saylor certificate links, active navigation, desktop sidebar position, stacked mobile layout, reduced motion, content without JavaScript, and runtime errors. Motion checks also exercised reveals, pause/resume, illustration tilt and reduced-motion changes during the session. Desktop and mobile screenshots were inspected for layout and readability.
# October 20 evidence and readability refinements

Kept the established navy/slate/teal theme and sticky identity column. Replaced decorative thumbnails with labeled architecture/scope diagrams and actual local interface captures. Three dedicated case studies explain the problem, contribution, technical choices and limitations. They avoid invented project metrics and distinguish interface evidence from live service validation.

Increased navigation, tags and metadata toward 12–14px; mobile navigation, filters and disclosures have at least 44px target heights. Older Oracle credentials use a keyboard-accessible native disclosure to reduce page length. All content remains available without JavaScript. Motion keeps its existing pause and reduced-motion behavior.

Research informing the refinement: [NN/g portfolio guidance](https://www.nngroup.com/articles/ux-design-portfolios/), adapted from a UX audience to technical case studies; [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html); and [Core Web Vitals](https://web.dev/articles/vitals). Local lab measurements are separate from production field data and cannot establish a real-user Core Web Vitals pass.

Production verification on October 20, 2026: homepage, three case studies, diagram and favicon returned HTTP 200. Lighthouse 13.5.0 against the Vercel homepage scored Performance 99, Accessibility 100, Best Practices 100 and SEO 100. Mobile lab metrics: LCP 1.5 seconds, CLS 0, TBT 0 milliseconds. These are one lab run, not real-user field results or a complete accessibility assessment. The initial local audit led to underlined footer links, a favicon and a responsive hall preview image before publication.
