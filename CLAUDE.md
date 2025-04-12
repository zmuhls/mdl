# MDL Website Development Guidelines

## Project Structure
- Static HTML website with vanilla JavaScript and CSS
- Pages in `/pages/` directory
- Assets in `/assets/` (css, js, images)

## Development Commands
- No build system - direct HTML/CSS/JS editing
- Check HTML validity: `html-validator path/to/file.html`
- Test responsiveness: Use browser dev tools mobile view

## Code Style Guidelines
- HTML: 4-space indentation, semantic tags, ARIA attributes
- CSS: BEM-like naming (`block__element--modifier`), CSS variables
- JS: Module pattern (`MDL` object), camelCase for variables/functions
- File naming: Lowercase with hyphens (kebab-case)
- Responsiveness: Mobile-first with `@media` breakpoints

## Error Handling
- Defensive coding with null checks before DOM operations
- User-friendly error messages for form validation
- ARIA attributes for accessibility
- Event delegation for forms and dynamic elements

## Documentation
- Section comments in CSS/JS files
- Keep README.md updated with current project status
- Commit messages should be descriptive and concise