module.exports = class IRepo {
  constructor (model) {
    this.model = model;
  }
  findOneByField (value, field) {
    return this.model.findOne({ where: { [field]: value } })
  }
  findOneByMultipleFields (where) {
    return this.model.findOne({ where })
  }
  findAll () {
    return this.model.findAll({})
  }
  countAll () {
    return this.model.count({})
  }
  findAllByField (value, field) {
    return this.model.findAll({ where: { [field]: value } })
  }
  findAllByMultipleFields (where) {
    return this.model.findAll({ where })
  }
  updateOneById (id, body) {
    return this.model.update({ ...body.dataValues }, { where: { id } })
  }
  create (obj) {
    return this.model.create(obj)
  }
  delete (obj) {
    obj.destroy()
    return obj
      .set('isDeleted', true)
      .save()
      .finally(() => {})
  }
}
