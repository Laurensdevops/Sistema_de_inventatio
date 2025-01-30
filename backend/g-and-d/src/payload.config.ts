// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import  Users  from './collections/Users'
import { Media } from './collections/Media'
import  Products  from './collections/Products'
import  Categories  from './collections/Categories'
import  InventoryMovements  from './collections/InventoryMovements'

import productEndpoints from "./endpoints/products";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: "http://localhost:3000", // Asegúrate de que esta URL sea la correcta
  csrf: [
    'http://localhost:3001'
  ],
  cors: [
     'http://localhost:3001'
   ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, Categories, InventoryMovements], 
  endpoints: [...productEndpoints],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
