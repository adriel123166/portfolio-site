# Felix Adriel portfolio

Static portfolio website for Felix Adriel A. Hate. Open `index.html` in a browser or serve this directory with a static HTTP server. No build step is required.

The downloadable `Felix-Adriel-Hate-Resume.pdf` and `Felix-Adriel-Hate-Resume.docx` contain the updated resume and selected projects. They use the corrected `Felix_Adriel_Hate_Resume` sources supplied by the user. The original files are preserved. `Felix-Adriel-Hate-Portfolio.docx` is a compatibility copy of the corrected Word resume.

## October 2026 update

- Added Neubie, CondoConnect (formerly DormAssist), Sibol House, Photobooth Event Automation and H2-dO.
- Updated Neubie from the older Lex description to the Bedrock and S3 Vectors architecture documented in its source repository.
- Distinguished prototype, research and pending deployment work from implemented features, and credited the PhotoboothProject foundation.
- Preserved the existing three portfolio projects alongside the new work.
- Added navigation, a document download, keyboard controls and narrow-screen layout improvements.
- Replaced the earlier CV source with the corrected resume, retaining Oracle credentials, education, the JWT lab assessment and NEU hall reservation project.
- Emphasized cloud infrastructure and cybersecurity, with networking as a supporting foundation, and added the current Networking Intern role at SSS Main Branch.

Project descriptions were checked against the local project documentation and source, the corrected DOCX and PDF resume, and the related H2-dO and Photobooth chat history. No new public project URLs were assumed.

Browser verification passed at desktop, 375px and 320px widths, including project disclosures and keyboard interaction. The resume was condensed to one page; the PDF page count and rendered layout were checked. The Word copy uses the same condensed content and compact formatting and passed content and package checks, but its visual pagination remains unverified: LibreOffice is unavailable and the installed Word background renderer stalled.

The site is published from this Git repository through its connected hosting provider. A successful Git push and a successful production deployment are separate steps; verify the hosting deployment after pushing.

## Professional redesign

The site now uses `index.html`, `styles.css` and `script.js`, with no build step or external font dependency. Three detailed projects lead the page, followed by a filterable archive containing the remaining seven projects. Native disclosures work without JavaScript. Experience, technical focus, credentials and contact sections use a restrained neutral and green design.

See [design research and validation](DESIGN.md) for references and the reasoning behind the layout. Browser checks passed at 320, 375, 768, 1024 and 1440 pixels, including expanded project details, keyboard controls, filters, reduced motion, no-JavaScript content and HTTP resume downloads.
