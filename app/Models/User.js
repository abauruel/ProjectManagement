'use strict'

const Model = use('Model')

const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  teamJoins () {
    return this.hasMany('App/Models/UserTeam')
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  teams () {
    return this.belongsToMany('App/Models/Team').pivotModel(
      'App/Models/UserTeam'
    )
  }

  async is (expression) {
    const team = await this.teamJoins()
      .where('team_id', this.CurrentTeam)
      .first()
    return team.is(expression)
  }

  async can (expression) {
    console.log(this.CurrentTeam)
    const team = await this.teamJoins()
      .where('team_id', this.CurrentTeam)
      .first()

    return team.can(expression)
  }

  async scope (required) {
    const team = await this.teamJoins()
      .where('team_id', this.CurrentTeam)
      .first()
    return team.scope(required)
  }
}

module.exports = User
