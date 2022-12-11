const sharp = require('sharp');
const { v4: uuid } = require('uuid');
const { faker } = require('@faker-js/faker');
const ipfsClient = require('ipfs-http-client');

const auth = 'Basic ' +
  Buffer.from(process.env.INFURIA_PID + ':' + process.env.INFURIA_API).toString(
    'base64'
  );
const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
exports.client = client;
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
};
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
});
exports.toMetadata = toMetadata;
const toWebp = async (image) => await sharp(image).resize(500).webp().toBuffer();
exports.toWebp = toWebp;
