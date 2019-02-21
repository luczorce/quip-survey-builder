const uuidv1 = require('uuid/v1');

import { qatypes } from './enums.js';

export class Question {
  constructor(type, extraData = {}) {
    this.type = type;
    
    this.question = extraData.question || '';
    this.helper = extraData.helper     || '';
    this.guid = extraData.guid         || uuidv1();
    this.errors = extraData.errors     || [];
    this.id = extraData.id             || null;

    if (type === qatypes.numberInput) {
      this.min = extraData.min || null;
      this.max = extraData.max || null;
    }

    if (type === qatypes.header) {
      this.value = extraData.value || '';

      delete this.question;
      delete this.helper;
    }

    // NOTE consider adding dirty, 
    // for when local updates aren't reflected on the server?
  }
}

export class OptionList {
  constructor(questionGuid, options = []) {
    this.guid = questionGuid;
    this.options = options;
  }
}

export class Option {
  constructor(data = {}) {
    this.guid = data.guid     || uuidv1();
    this.value = data.value   || '';
    this.helper = data.helper || '';
  }
}
