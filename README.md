# Hackathon Project

A vanilla JavaScript project using Vite, Bootstrap, and Zod for form validation.

## Prerequisites

### Installing Node.js (First Time Setup)

If you don't have Node.js installed:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Run the installer and follow the prompts
4. Verify installation by opening a terminal and running:
   ```bash
   node --version
   npm --version
   ```

## Getting Started

### 1. Install Dependencies

After cloning this project, navigate to the project folder and install all required packages:

```bash
npm install
```

This will install:
- Vite (build tool)
- Bootstrap (CSS framework)
- Zod (form validation)

### 2. Run Development Server

Start the local development server:

```bash
npm run dev
```

Your app will be available at `http://localhost:5173` (or another port if 5173 is busy)

### 3. Build for Production

To create a production build:

```bash
npm run build
```

## Using Bootstrap

Bootstrap is already configured and imported in `src/main.js`.

### How to Use Bootstrap Classes

Bootstrap provides utility classes for styling. Just add them to your HTML elements:

```javascript
// Example in your JavaScript
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1 class="text-primary">Hello Bootstrap</h1>
    <button class="btn btn-success">Click Me</button>
  </div>
`
```

### Bootstrap Background Colors

Bootstrap provides several background color classes:

- `bg-primary` - Blue
- `bg-secondary` - Gray
- `bg-success` - Green
- `bg-danger` - Red
- `bg-warning` - Yellow
- `bg-info` - Light blue
- `bg-light` - Light gray
- `bg-dark` - Dark gray

```html
<div class="bg-primary text-white p-3">Blue background</div>
<div class="bg-success text-white p-3">Green background</div>
```

### Customizing Bootstrap Colors

To change Bootstrap's root colors, create or modify `src/style.css`:

```css
:root {
  --bs-primary: #your-color;
  --bs-success: #your-color;
  --bs-danger: #your-color;
}
```

Or override using custom CSS:

```css
.bg-primary {
  background-color: #your-custom-blue !important;
}
```

### Useful Bootstrap Classes

- **Spacing**: `m-3` (margin), `p-3` (padding), `mt-3` (margin-top), `mb-3` (margin-bottom)
- **Text**: `text-center`, `text-white`, `text-primary`
- **Display**: `d-flex`, `d-none`, `d-block`
- **Grid**: `container`, `row`, `col`, `col-md-6`

## Using Zod for Form Validation

Zod is a TypeScript-first schema validation library that works great with vanilla JavaScript.

### Basic Example: Contact Form

```javascript
import { z } from 'zod'

// 1. Define your validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  comment: z.string().min(10, 'Comment must be at least 10 characters')
})

// 2. Create your form
document.querySelector('#app').innerHTML = `
  <div class="container mt-5">
    <form id="contactForm">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" id="name" name="name">
        <div class="text-danger" id="name-error"></div>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" id="email" name="email">
        <div class="text-danger" id="email-error"></div>
      </div>

      <div class="mb-3">
        <label class="form-label">Comment</label>
        <textarea class="form-control" id="comment" name="comment" rows="3"></textarea>
        <div class="text-danger" id="comment-error"></div>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
`

// 3. Handle form submission with validation
document.querySelector('#contactForm').addEventListener('submit', (e) => {
  e.preventDefault()

  // Clear previous errors
  document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '')

  // Get form data
  const formData = {
    name: document.querySelector('#name').value,
    email: document.querySelector('#email').value,
    comment: document.querySelector('#comment').value
  }

  // Validate with Zod
  try {
    const validData = contactSchema.parse(formData)
    console.log('Form is valid!', validData)
    alert('Form submitted successfully!')
  } catch (error) {
    // Display validation errors
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        const field = err.path[0]
        const errorElement = document.querySelector(`#${field}-error`)
        if (errorElement) {
          errorElement.textContent = err.message
        }
      })
    }
  }
})
```

### Common Zod Validators

```javascript
z.string()              // Must be a string
z.string().min(5)       // Minimum length
z.string().max(100)     // Maximum length
z.string().email()      // Must be valid email
z.string().url()        // Must be valid URL
z.number()              // Must be a number
z.number().min(18)      // Minimum value
z.number().max(100)     // Maximum value
z.boolean()             // Must be true/false
z.date()                // Must be a date
z.enum(['option1', 'option2'])  // Must be one of these values

// Optional fields
z.string().optional()

// With custom error messages
z.string().min(2, { message: 'Too short!' })
```

## Creating Components

Components are reusable pieces of UI that you can use throughout your app.

### Step 1: Create the Components Folder

```bash
mkdir src/components
```

### Step 2: Create a Component File

Create a file like `src/components/RecipeCard.js`:

```javascript
// src/components/RecipeCard.js
export function RecipeCard(recipe) {
  return `
    <div class="card h-100">
      <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
      <div class="card-body">
        <h5 class="card-title">${recipe.name}</h5>
        <p class="card-text">${recipe.description}</p>
        <a href="#/recipe/${recipe.id}" class="btn btn-primary">View Recipe</a>
      </div>
    </div>
  `
}
```

### Step 3: Use the Component

```javascript
// In any file
import { RecipeCard } from './components/RecipeCard.js'

const recipe = {
  id: 1,
  name: 'Chocolate Cake',
  description: 'Delicious chocolate cake',
  image: '/images/cake.jpg'
}

document.querySelector('#app').innerHTML = `
  <div class="container">
    ${RecipeCard(recipe)}
  </div>
`
```

### More Component Examples

**Navbar Component** (`src/components/Navbar.js`):

```javascript
export function Navbar() {
  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#/">Recipe App</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#/">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#/contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
}
```

**Button Component** (`src/components/Button.js`):

```javascript
export function Button(text, variant = 'primary') {
  return `<button class="btn btn-${variant}">${text}</button>`
}
```

## Creating Pages

Pages are full views that users navigate to. Each page represents a different screen in your app.

Each page gets its own folder with:
- `PageName.js` - The page component
- `index.js` - For easy imports
- `PageName.css` - Page-specific styles (optional)

### Step 1: Create the Pages Folder

```bash
mkdir src/pages
```

### Step 2: Create a Page Folder and Files

**Home Page Structure**:
```
src/pages/HomePage/
├── HomePage.js      # The page component
├── index.js         # Exports the component
└── HomePage.css     # Page styles (optional)
```

Create the folder:
```bash
mkdir src/pages/HomePage
```

**Create `src/pages/HomePage/HomePage.js`**:

```javascript
// src/pages/HomePage/HomePage.js
import { RecipeCard } from '../../components/RecipeCard.js'
import './HomePage.css'

export function HomePage() {
  const html = `
    <div class="container mt-4">
      <h1 class="homepage-title">Welcome to Recipe App</h1>
      <p class="lead">Discover amazing recipes</p>

      <div class="row" id="recipe-list">
        <div class="col-12">
          <p>Loading recipes...</p>
        </div>
      </div>
    </div>
  `

  return {
    html,
    init: () => {
      // Fetch and display recipes when page loads
      fetchRecipes()
    }
  }
}

async function fetchRecipes() {
  try {
    // Example: fetch from an API
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    const data = await response.json()

    const recipeList = document.querySelector('#recipe-list')
    recipeList.innerHTML = data.meals.slice(0, 6).map(meal => `
      <div class="col-md-4 mb-4">
        ${RecipeCard({
          id: meal.idMeal,
          name: meal.strMeal,
          description: meal.strCategory,
          image: meal.strMealThumb
        })}
      </div>
    `).join('')
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
}
```

**Create `src/pages/HomePage/index.js`**:

```javascript
// src/pages/HomePage/index.js
export { HomePage } from './HomePage.js'
```

**Create `src/pages/HomePage/HomePage.css`** (optional):

```css
/* src/pages/HomePage/HomePage.css */
.homepage-title {
  color: #333;
  font-weight: bold;
  margin-bottom: 1rem;
}
```

### Recipe Detail Page

**Structure**:
```
src/pages/RecipeDetailPage/
├── RecipeDetailPage.js
├── index.js
└── RecipeDetailPage.css
```

Create the folder:
```bash
mkdir src/pages/RecipeDetailPage
```

**Create `src/pages/RecipeDetailPage/RecipeDetailPage.js`**:

```javascript
// src/pages/RecipeDetailPage/RecipeDetailPage.js
import './RecipeDetailPage.css'

export function RecipeDetailPage(recipeId) {
  const html = `
    <div class="container mt-4">
      <div id="recipe-detail">
        <p>Loading recipe...</p>
      </div>
    </div>
  `

  return {
    html,
    init: () => {
      fetchRecipeDetail(recipeId)
    }
  }
}

async function fetchRecipeDetail(id) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data = await response.json()
    const recipe = data.meals[0]

    document.querySelector('#recipe-detail').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${recipe.strMealThumb}" class="img-fluid rounded recipe-image" alt="${recipe.strMeal}">
        </div>
        <div class="col-md-6">
          <h1>${recipe.strMeal}</h1>
          <p class="lead">${recipe.strCategory} - ${recipe.strArea}</p>
          <h3>Instructions</h3>
          <p>${recipe.strInstructions}</p>
          <a href="#/" class="btn btn-secondary">Back to Home</a>
        </div>
      </div>
    `
  } catch (error) {
    console.error('Error fetching recipe:', error)
  }
}
```

**Create `src/pages/RecipeDetailPage/index.js`**:

```javascript
// src/pages/RecipeDetailPage/index.js
export { RecipeDetailPage } from './RecipeDetailPage.js'
```

**Create `src/pages/RecipeDetailPage/RecipeDetailPage.css`**:

```css
/* src/pages/RecipeDetailPage/RecipeDetailPage.css */
.recipe-image {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Contact Page

**Structure**:
```
src/pages/ContactPage/
├── ContactPage.js
├── index.js
└── ContactPage.css
```

Create the folder:
```bash
mkdir src/pages/ContactPage
```

**Create `src/pages/ContactPage/ContactPage.js`**:

```javascript
// src/pages/ContactPage/ContactPage.js
import { z } from 'zod'
import './ContactPage.css'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

export function ContactPage() {
  const html = `
    <div class="container mt-4">
      <h1>Contact Us</h1>
      <form id="contactForm" class="contact-form">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" id="name">
          <div class="text-danger" id="name-error"></div>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" id="email">
          <div class="text-danger" id="email-error"></div>
        </div>
        <div class="mb-3">
          <label class="form-label">Message</label>
          <textarea class="form-control" id="message" rows="4"></textarea>
          <div class="text-danger" id="message-error"></div>
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
      </form>
    </div>
  `

  return {
    html,
    init: () => {
      document.querySelector('#contactForm').addEventListener('submit', handleSubmit)
    }
  }
}

function handleSubmit(e) {
  e.preventDefault()

  // Clear previous errors
  document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '')

  const formData = {
    name: document.querySelector('#name').value,
    email: document.querySelector('#email').value,
    message: document.querySelector('#message').value
  }

  try {
    contactSchema.parse(formData)
    alert('Message sent successfully!')
    e.target.reset()
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        const errorElement = document.querySelector(`#${err.path[0]}-error`)
        if (errorElement) errorElement.textContent = err.message
      })
    }
  }
}
```

**Create `src/pages/ContactPage/index.js`**:

```javascript
// src/pages/ContactPage/index.js
export { ContactPage } from './ContactPage.js'
```

**Create `src/pages/ContactPage/ContactPage.css`**:

```css
/* src/pages/ContactPage/ContactPage.css */
.contact-form {
  max-width: 600px;
  margin: 0 auto;
}
```

## Setting Up Routing (Navigation Between Pages)

Routing allows users to navigate between different pages in your app. Since this is vanilla JavaScript, we use **hash-based routing** (URLs like `#/contact`).

### Step 1: Create the Router

Create `src/router.js`:

```javascript
// src/router.js
import { HomePage } from './pages/HomePage/index.js'
import { RecipeDetailPage } from './pages/RecipeDetailPage/index.js'
import { ContactPage } from './pages/ContactPage/index.js'
import { Navbar } from './components/Navbar.js'

const routes = {
  '/': HomePage,
  '/contact': ContactPage,
  '/recipe/:id': RecipeDetailPage  // Dynamic route with parameter
}

export function router() {
  // Get current hash (default to '/')
  const path = window.location.hash.slice(1) || '/'

  // Check for dynamic routes (like /recipe/123)
  let page = routes[path]
  let params = null

  // Handle dynamic routes
  if (!page) {
    // Check if it matches /recipe/:id pattern
    const recipeMatch = path.match(/^\/recipe\/(\d+)$/)
    if (recipeMatch) {
      page = RecipeDetailPage
      params = recipeMatch[1]  // The recipe ID
    }
  }

  // Default to HomePage if no match
  if (!page) {
    page = routes['/']
  }

  // Render the page
  const pageContent = params ? page(params) : page()

  // Render navbar + page
  if (pageContent.html) {
    document.querySelector('#app').innerHTML = Navbar() + pageContent.html
    // Run page initialization (event listeners, data fetching, etc.)
    if (pageContent.init) pageContent.init()
  } else {
    document.querySelector('#app').innerHTML = Navbar() + pageContent
  }
}

// Listen for hash changes
window.addEventListener('hashchange', router)

// Listen for page load
window.addEventListener('load', router)
```

### Step 2: Update main.js

```javascript
// src/main.js
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import { router } from './router.js'

// Start the router
router()
```

### Step 3: Navigate Between Pages

Use hash links in your HTML:

```html
<a href="#/">Home</a>
<a href="#/contact">Contact</a>
<a href="#/recipe/52772">View Recipe</a>
```

Or navigate from JavaScript:

```javascript
// Navigate to a different page
window.location.hash = '/contact'
```

### How It Works

1. User clicks a link like `<a href="#/contact">`
2. The URL changes to `http://localhost:5173/#/contact`
3. The router detects the hash change
4. The router loads and displays the Contact page
5. No page reload happens - it's a Single Page Application!

### Adding New Routes

To add a new page:

1. **Create the page folder and files**:
   ```bash
   mkdir src/pages/NewPage
   ```

2. **Create the page files**:
   - `src/pages/NewPage/NewPage.js` (the component)
   - `src/pages/NewPage/index.js` (export file)
   - `src/pages/NewPage/NewPage.css` (optional styles)

3. **Import it in `src/router.js`**:
   ```javascript
   import { NewPage } from './pages/NewPage/index.js'

   const routes = {
     '/': HomePage,
     '/contact': ContactPage,
     '/new': NewPage  // Your new route
   }
   ```

4. **Link to it**: `<a href="#/new">New Page</a>`

## Documentation and Spikes

### What is a Spike?

A **spike** is a time-boxed research task where you investigate a question or explore how to implement something. It helps you learn before you code.

**Examples**:
- "Which recipe API should we use?"
- "How do we upload images?"
- "Can we add user authentication?"

### Creating Documentation

The `docs/` folder is for all project documentation:

- **Spikes**: Research documents (`docs/spikes/`)
- **Technical decisions**: Why you chose an approach
- **Setup guides**: Special instructions
- **API documentation**: How your code works

### How to Write Markdown (.md files)

Markdown files are simple text files with formatting.

**Creating a new markdown file**:

In VS Code:
1. Right-click `docs/` or `docs/spikes/`
2. Select "New File"
3. Name it `my-document.md`

Or in terminal:
```bash
touch docs/my-research.md
```

**Basic markdown syntax**:

```markdown
# Main Heading

## Section Heading

**Bold text**
*Italic text*

- Bullet point
- Another point

1. Numbered item
2. Second item

[Link text](https://example.com)

\`\`\`javascript
// Code block
function hello() {
  console.log('Hello!')
}
\`\`\`
```

**Viewing markdown**:
- In VS Code: Right-click file → "Open Preview"
- Or press `Cmd+Shift+V` (Mac) / `Ctrl+Shift+V` (Windows)

### Creating a Spike Document

See `docs/spikes/example-spike.md` for a complete example.

Basic template:

```markdown
# Spike: Your Question Here

**Author**: Your Name
**Date**: 2025-12-20
**Time Box**: 2 hours

## Question/Goal
What are you trying to find out?

## Research
What did you investigate?

## Code Examples
\`\`\`javascript
// Your test code
\`\`\`

## Recommendation
What did you decide?

## Resources
- [Link 1](https://example.com)
```

## Project Structure

Here's how to organize your project:

```
hackathon/
├── docs/                           # Documentation
│   ├── spikes/                    # Research documents
│   │   ├── README.md              # Spike guide
│   │   └── example-spike.md
│   └── README.md                  # Documentation guide
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.js
│   │   ├── RecipeCard.js
│   │   └── Button.js
│   ├── pages/                     # Full page views
│   │   ├── HomePage/
│   │   │   ├── HomePage.js        # Page component
│   │   │   ├── index.js           # Export file
│   │   │   └── HomePage.css       # Page styles
│   │   ├── RecipeDetailPage/
│   │   │   ├── RecipeDetailPage.js
│   │   │   ├── index.js
│   │   │   └── RecipeDetailPage.css
│   │   └── ContactPage/
│   │       ├── ContactPage.js
│   │       ├── index.js
│   │       └── ContactPage.css
│   ├── services/                  # API calls and business logic (optional)
│   │   └── recipeAPI.js
│   ├── router.js                  # Routing logic
│   ├── main.js                    # Main entry point
│   └── style.css                  # Global CSS
├── public/                        # Static files (images, etc.)
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
└── README.md                      # This file
```

### Creating the Folder Structure

Run these commands:

```bash
mkdir src/components
mkdir src/pages
mkdir src/services
mkdir src/pages/HomePage
mkdir src/pages/RecipeDetailPage
mkdir src/pages/ContactPage
```

Or create them as you need each page.

## Learn More

- [Vite Documentation](https://vitejs.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Zod Documentation](https://zod.dev/)

## Troubleshooting

**Port already in use?**
- Vite will automatically try the next available port
- Or specify a port: `vite --port 3000`

**Dependencies not installing?**
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure you have a stable internet connection

**Changes not showing?**
- Make sure the dev server is running
- Try hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R)
