import './style.css'
import 'bootstrap'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

function initializeForm() {
  const form = document.querySelector('#contactForm')

  if (form) {
    // Add validation before Pageclip processes the form
    form.addEventListener('submit', function(event) {
      // Clear previous errors
      document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '')

      const formData = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        subject: document.querySelector('#subject').value,
        message: document.querySelector('#message').value
      }

      try {
        contactSchema.parse(formData)
        // Validation passed - allow form to proceed to Pageclip
      } catch (error) {
        // Validation failed - prevent submission and show errors
        event.preventDefault()
        event.stopPropagation()

        if (error.issues) {
          error.issues.forEach(err => {
            const errorElement = document.querySelector(`#${err.path[0]}-error`)
            if (errorElement) errorElement.textContent = err.message
          })
        }
      }
    }, true) // Use capture phase to run before Pageclip

    // Initialize Pageclip
    if (window.Pageclip) {
      window.Pageclip.form(form, {
        onResponse: function(error, response) {
          if (error) {
            console.error('Form submission error:', error)
          } else {
            console.log('Form submitted successfully:', response)
          }
        }
      })
    } else {
      console.error('Pageclip not loaded')
    }
  }
}

// Wait for Pageclip to be available
if (window.Pageclip) {
  initializeForm()
} else {
  window.addEventListener('load', initializeForm)
}
