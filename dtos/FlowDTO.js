'use strict';

class FlowDTO {
  constructor(model) {
    this.flowId = model.flowId;
    this.name = model.name;
    this.description = model.description;
    this.flowData = model.flowData;
    this.enabled = model.enabled;
    this.updatedAt = model.updatedAt;
  }
}

module.exports = FlowDTO;
