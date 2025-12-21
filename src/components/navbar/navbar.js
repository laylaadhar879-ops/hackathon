import './navbar.css'

/**
 * Creates the navigation bar HTML
 * @param {string} activePage - The currently active page ('home', 'recipes', 'contact', or 'recipe-detail')
 * @returns {string} The navbar HTML
 */
export function createNavbar(activePage = 'home') {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Recipe App</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${activePage === 'recipes' ? 'active' : ''}" href="/recipes.html">Recipes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${activePage === 'contact' ? 'active' : ''}" href="/contact.html">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
}

/**
 * Inserts the navbar at the beginning of the body element
 *
 * How to use:
 * 1. Import this function: import { insertNavbar } from '../../components/navbar/navbar.js'
 * 2. Call it with the current page name: insertNavbar('home')
 * 3. The navbar will appear at the top of your page
 *
 * @param {string} activePage - The currently active page ('home', 'recipes', 'contact', or 'recipe-detail')
 *
 * How it works:
 * - Creates the navbar HTML using createNavbar()
 * - Inserts it at the start of <body> using insertAdjacentHTML('afterbegin', html)
 * - 'afterbegin' means: insert right after the opening <body> tag
 * - This makes the navbar appear first, before any other content
 */
export function insertNavbar(activePage = 'home') {
  const navbarHtml = createNavbar(activePage)
  // insertAdjacentHTML inserts HTML at a specific position without replacing existing content
  // 'afterbegin' = right after the opening tag of the element (document.body)
  document.body.insertAdjacentHTML('afterbegin', navbarHtml)
}
