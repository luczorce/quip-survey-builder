export class Question {
  constructor(type, extraData = {}) {
    this.type = type;
    
    this.question = extraData.question || '';
    this.helper = extraData.helper     || '';
    this.guid = extraData.guid         || Date.now();
    this.errors = extraData.errors     || [];
    this.id = extraData.id             || null;

    // NOTE consider adding dirty, 
    // for when local updates aren't reflected on the server?
  }
}

export class QuestionOptionList {
  constructor(questionGuid) {
    this.options = [];
    this.guid = questionGuid;
  }
}
