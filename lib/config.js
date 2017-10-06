const dbConfig = {
  url: process.env.DATABASE_URL || 'sqlite://:memory',
  ssl: false,
  initTimeout: 60
}

export default dbConfig
