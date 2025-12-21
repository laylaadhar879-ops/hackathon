import 'bootstrap/dist/css/bootstrap.min.css'
import '../../styles/global.css'
import './style.css'
import { insertNavbar } from '../../components/navbar/navbar.js'
import { z } from 'zod'

// Insert the navbar at the top of the page
insertNavbar('contact')

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

document.querySelector('#contactForm').addEventListener('submit', (e) => {
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
})
