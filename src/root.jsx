import quip from "quip";
import App from "./App.jsx";

class SurveyRecord extends quip.apps.RootRecord {
  static getProperties() {
    return {
      purpose: 'string',
      questions: 'array',
      surveyName: 'string',
      surveyId: 'number'
    }
  }
}

quip.apps.registerClass(SurveyRecord, "survey-record");

quip.apps.initialize({
  initializationCallback: function(rootNode) {
    let rootRecord = quip.apps.getRootRecord();
    ReactDOM.render(<App record={rootRecord} />, rootNode);
  },
});
