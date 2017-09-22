import Sequelize from 'sequelize'

const sequelize = new Sequelize('sqlite://:memory')

const skill = sequelize.define('skill', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  shortName: {
    type: Sequelize.STRING
  },
  longName: {
    type: Sequelize.STRING
  }
})

async function populateDB () {
  await skill.sync().then(() => {
    return skill.create({
      id: 1,
      shortName: 'RCO',
      longName: 'Restitution de connaissance'
    })
  })
  await skill.findAll().then(skills => {
    console.log(skills) // eslint-disable-line no-console
  })
}
populateDB()
