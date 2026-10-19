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

## Verification

Browser checks passed at 320, 375, 768, 1024 and 1440 pixels, with project details both open and closed. Checks covered ten keyboard disclosures, archive counts and accessible filter state, internal anchors, current PDF and Word downloads, seven credentials and three Saylor certificate links, active navigation, desktop sidebar position, stacked mobile layout, reduced motion, content without JavaScript, and runtime errors. Desktop and mobile screenshots were inspected for layout and readability.
