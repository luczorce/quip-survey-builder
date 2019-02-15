import quip from 'quip';
import App from './App.jsx';
import { SurveyRecord, OptionsRecord } from 'util/records.js'

quip.apps.registerClass(OptionsRecord, 'options-record');
quip.apps.registerClass(SurveyRecord, 'survey-record');

quip.apps.initialize({
  initializationCallback: function(rootNode) {
    let rootRecord = quip.apps.getRootRecord();
    ReactDOM.render(<App record={rootRecord} />, rootNode);
  }
});
