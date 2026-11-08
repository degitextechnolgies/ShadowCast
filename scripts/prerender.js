import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

function prerender() {
  const indexHtmlPath = path.join(distDir, 'index.html')
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html does not exist. Run vite build first.')
    process.exit(1)
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8')

  // 1. Generate 404.html for Cloudflare Workers & CDNs
  const html404 = baseHtml
    .replace(
      /<title>.*?<\/title>/,
      '<title>404 Page Not Found — ShadowCast</title>'
    )
    .replace(
      /<meta name="description" content=".*?" \/>/,
      '<meta name="description" content="The requested resource or page could not be located on the ShadowCast network." />'
    )
    .replace(
      /<meta name="robots" content=".*?" \/>/,
      '<meta name="robots" content="noindex, nofollow" />'
    )

  fs.writeFileSync(path.join(distDir, '404.html'), html404, 'utf-8')
  console.log('✓ Generated dist/404.html')

  // 2. Generate static directory for /login
  const loginDir = path.join(distDir, 'login')
  if (!fs.existsSync(loginDir)) fs.mkdirSync(loginDir, { recursive: true })
  const loginHtml = baseHtml
    .replace(
      /<title>.*?<\/title>/,
      '<title>Sign In — ShadowCast Pilot Hub</title>'
    )
    .replace(
      /<meta name="description" content=".*?" \/>/,
      '<meta name="description" content="Sign in to your ShadowCast pilot account to manage paired devices and stream settings." />'
    )
    .replace(
      /<meta name="robots" content=".*?" \/>/,
      '<meta name="robots" content="noindex, nofollow" />'
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      '<link rel="canonical" href="https://shadowcast.in/login" />'
    )
  fs.writeFileSync(path.join(loginDir, 'index.html'), loginHtml, 'utf-8')
  console.log('✓ Generated dist/login/index.html (noindex)')

  // 3. Generate static directory for /register
  const registerDir = path.join(distDir, 'register')
  if (!fs.existsSync(registerDir)) fs.mkdirSync(registerDir, { recursive: true })
  const registerHtml = baseHtml
    .replace(
      /<title>.*?<\/title>/,
      '<title>Create Pilot Account — ShadowCast</title>'
    )
    .replace(
      /<meta name="description" content=".*?" \/>/,
      '<meta name="description" content="Register for ShadowCast to unlock wireless AirPlay 2 and USB screen mirroring." />'
    )
    .replace(
      /<meta name="robots" content=".*?" \/>/,
      '<meta name="robots" content="noindex, nofollow" />'
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      '<link rel="canonical" href="https://shadowcast.in/register" />'
    )
  fs.writeFileSync(path.join(registerDir, 'index.html'), registerHtml, 'utf-8')
  console.log('✓ Generated dist/register/index.html (noindex)')

  console.log('✨ Technical SEO Prerendering successfully completed!')
}

prerender()
