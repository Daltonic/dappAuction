const express = require('express')
require('dotenv').config()
const fs = require('fs').promises
const { faker } = require('@faker-js/faker')
const { v4: uuid } = require('uuid')
const ipfsClient = require('ipfs-http-client')
const app = express()

let metadataURI
const auth =
  'Basic ' +
  Buffer.from(process.env.INFURIA_PID + ':' + process.env.INFURIA_API).toString(
    'base64',
  )

const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

const attributes = {
  weapon: [
    'Stick',
    'Knife',
    'Blade',
    'Club',
    'Ax',
    'Sword',
    'Spear',
    'Halberd',
  ],
  environment: [
    'Space',
    'Sky',
    'Deserts',
    'Forests',
    'Grasslands',
    'Mountains',
    'Oceans',
    'Rainforests',
  ],
  rarity: Array.from(Array(6).keys()),
}

const toMetadata = ({ id, name, description, price, image }) => ({
  id,
  name,
  description,
  price,
  image,
  demand: faker.random.numeric({ min: 10, max: 100 }),
  attributes: [
    {
      trait_type: 'Environment',
      value: attributes.environment.sort(() => 0.5 - Math.random())[0],
    },
    {
      trait_type: 'Weapon',
      value: attributes.weapon.sort(() => 0.5 - Math.random())[0],
    },
    {
      trait_type: 'Rarity',
      value: attributes.rarity.sort(() => 0.5 - Math.random())[0],
    },
    {
      display_type: 'date',
      trait_type: 'Created',
      value: Date.now(),
    },
    {
      display_type: 'number',
      trait_type: 'generation',
      value: 1,
    },
  ],
})

app.use(express.json())

app.post('/process', (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const price = req.body.price
  const image = req.body.image

  if (!name || !description || !price || !image) {
    return res
      .status(400)
      .send('name, description, and price must not be empty')
  }

  const params = {
    id: uuid(),
    name,
    description,
    price,
    image,
  }

  return res.status(201).json({ params })

  // fs.writeFile('token.json', JSON.stringify(toMetadata(params)))
  //   .then(() => {
  //     fs.readFile('token.json')
  //       .then(async (data) => {
  //         const created = await client.add(data)
  //         metadataURI = `https://ipfs.io/ipfs/${created.path}`
  //         console.log(metadataURI)
  //         return res.status(201).json({ metadataURI })
  //       })
  //       .catch((error) => console.log(error))
  //   })
  //   .catch((error) => console.log(error))
})

app.listen(9000, () => {
  console.log('Listen on the port 9000...')
})
