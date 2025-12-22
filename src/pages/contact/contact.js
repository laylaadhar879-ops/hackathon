import './style.css'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

const form = document.querySelector('#contactForm')

if (form && window.Pageclip) {
  window.Pageclip.form(form, {
    onSubmit: function(event) {
      // Clear previous errors
      document.querySelectorAll('[id$="-error"]').forEach(el => el.textContent = '')

      const formData = {
        name: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        message: document.querySelector('#message').value
      }

      try {
        contactSchema.parse(formData)
        // Validation passed - allow Pageclip to handle the submission
        return true
      } catch (error) {
        // Validation failed - prevent submission and show errors
        if (error.errors) {
          error.errors.forEach(err => {
            const errorElement = document.querySelector(`#${err.path[0]}-error`)
            if (errorElement) errorElement.textContent = err.message
          })
        }
        return false // Prevent submission
      }
    },
    onResponse: function(error, response) {
      if (error) {
        console.error('Form submission error:', error)
      }
    }
  })
}
