import app    from './src/app'
import { config } from './src/config'

const PORT = config.PORT || 4000

app.listen(PORT, () => {
  console.log(`✅ Good Shepherd SMS API running on http://localhost:${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/health`)
})