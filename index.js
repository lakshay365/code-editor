const express = require('express')
const mongoose = require('mongoose')

const keys = require('./config/keys')

require('./models/file')

const defaultContent =
  "\n// Please click on 'Options' on the bottom-right corner.\n\n"

mongoose.connect(keys.mongoURI)

mongoose.connection
  .once('open', () => {
    console.log('Connected to mongodb')
  })
  .on('error', err => console.warn('Warning', err))

const File = mongoose.model('file')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const filenameRequired = (req, res, next) => {
  if (!req.body.filename) return res.send({ error: 'Filename required!' })
  else next()
}

const createIfNotAvailable = (req, res, next) => {
  const filename = req.body.filename

  File.findOne({ name: filename })
    .then(file => {
      if (file) return file
      else {
        const f = new File({ name: filename, content: '' })
        return f.save()
      }
    })
    .then(file => next())
    .catch(err => console.error(err))
}

app.post('/api/create', filenameRequired, (req, res) => {
  const filename = req.body.filename

  File.findOne({ name: filename })
    .then(file => {
      if (file) return file
      else {
        const f = new File({ name: filename, content: '' })
        return f.save()
      }
    })
    .then(file => {
      res.send(file)
    })
    .catch(err => console.error(err))
})

app.post('/api/query', (req, res) => {
  File.find({})
    .select('name -_id')
    .sort('name')
    .exec()
    .then(names => res.send(names))
    .catch(err => console.error(err))
})

app.post('/api/push', filenameRequired, createIfNotAvailable, (req, res) => {
  console.log(req)

  const filename = req.body.filename
  const content = req.body.content || ''

  File.findOne({ name: filename })
    .then(file => {
      file.content = content
      return file.save()
    })
    .then(file => res.send(file))
    .catch(err => console.error(err))
})

app.post('/api/pull', filenameRequired, createIfNotAvailable, (req, res) => {
  const filename = req.body.filename

  File.findOne({ name: filename })
    .then(file => {
      res.send({ name: file.name, content: file.content || defaultContent })
    })
    .catch(err => console.error(err))
})

app.post('/api/drop', (req, res) => {
  File.remove({})
    .then(() => res.send('Done!'))
    .catch(err => console.error(err))
})

app.get('*', (req, res) => {
  res.redirect('https://itians.xyz')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('Listening on port', PORT)
})
