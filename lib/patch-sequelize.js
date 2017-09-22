import Utils from 'sequelize/lib/utils'
import queryGenerator from 'sequelize/lib/dialects/sqlite/query-generator'

const handleSequelizeMethod = queryGenerator.handleSequelizeMethod

queryGenerator.handleSequelizeMethod = function (smth, tableName, factory, options, prepend) {
  if (smth instanceof Utils.Cast && /timestamp/i.test(smth.type)) {
    smth = new Utils.Fn('datetime', [smth.val])
  }
  return handleSequelizeMethod.apply(queryGenerator, [smth, tableName, factory, options, prepend])
}
