'use strict';

class UserDTO {
  constructor(model) {
    this.id = model.id;
    this.email = model.email;
  }
}

module.exports = UserDTO;
