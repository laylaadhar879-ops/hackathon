import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div class="container mt-5">
    <div class="p-5 mb-4 bg-primary text-white rounded-3">
      <h1 class="display-4">Bootstrap is Working!</h1>
      <p class="lead">This blue background and styling is from Bootstrap CSS</p>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-body bg-success text-white">
            <h5 class="card-title">Success Color</h5>
            <p class="card-text">Green background</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body bg-warning">
            <h5 class="card-title">Warning Color</h5>
            <p class="card-text">Yellow background</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-body bg-danger text-white">
            <h5 class="card-title">Danger Color</h5>
            <p class="card-text">Red background</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <button id="counter" type="button" class="btn btn-lg btn-primary"></button>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
