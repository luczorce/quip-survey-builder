export class SurveyRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      purpose: 'string',
      surveyName: 'string',
      surveyId: 'number',
      questions: 'array',
      questionOptions: quip.apps.RecordList.Type(OptionsRecord),
      answers: 'array'
    };
  }

  static getDefaultProperties() {
    return {
      questionOptions: []
    };
  }
}

export class OptionsRecord extends quip.apps.Record {
  static getProperties() {
    return {
      // this will relate to the question guid, from the Survey RootRecord
      // we use this guid to tie the options back to the specific question
      guid: 'string',
      // this will contain the data on the options available to the question
      // while the survey is being built, this is all stored in the quip records
      // it will look like [ {guid: 'number', value: 'string', helper: 'string'}, ...]
      options: 'array'
    };
  }
}