import quip from 'quip';
import App from './App.jsx';

class OptionsRecord extends quip.apps.Record {
  static getProperties() {
    return {
      // this will relate to the question guid, from the Survey RootRecord
      // we use this guid to tie the options back to the specific question
      guid: 'number',
      // this will contain the data on the options available to the question
      // while the survey is being built, this is all stored in the quip records
      // it will look like [ {guid: 'number', value: 'string', helper: 'string'}, ...]
      options: 'array'
    };
  }
}

quip.apps.registerClass(OptionsRecord, 'options-record');

class SurveyRecord extends quip.apps.RootRecord {
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

quip.apps.registerClass(SurveyRecord, 'survey-record');

quip.apps.initialize({
  initializationCallback: function(rootNode) {
    let rootRecord = quip.apps.getRootRecord();
    ReactDOM.render(<App record={rootRecord} />, rootNode);
  }
});
