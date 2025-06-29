import app from './app.ts'

const PORT = Number(process.env.PORT) || 4000

app.listen(PORT, () => {
  console.log(`✈️  Amadeus proxy listening on :${PORT}`)
})
