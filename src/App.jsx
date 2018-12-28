import Style from "./App.less";
import FormStyle from "./components/Form.less";
import Builder from './components/Builder.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import { saveSurveyName, saveSurveyQuestions } from './survey-communication.js';

export default class App extends React.Component {
  constructor(props) {
    super();

    let saveSurveyDisabled = true;

    if (props.record.get('surveyName') && !props.record.get('surveyId')) {
      saveSurveyDisabled = false;
    }

    this.state = {
      // can be either building or loading
      currentUse: props.record.get('purpose') || null,
      questions: props.record.get('questions') || [],
      surveyName: props.record.get('surveyName') || '',
      saveSurveyDisabled: saveSurveyDisabled
    };
  }

  loadSurveyOptions = () => {
    const { record } = this.props;
    
    record.set('purpose', 'loading');
    this.setState({currentUse: 'loading'});
  }

  saveSurvey = () => {
    this.setState({saveSurveyDisabled: true}, () => {
      saveSurveyName(this.state.surveyName, null)
        .then(response => {
          if (!response.ok) {
            this.setState({surveyErrors: response});
          } else {
            this.props.record.set('surveyId', response.data.id);
            this.saveQuestions(response.data.id);
            this.forceUpdate();
          }
        });
    });
  }

  saveQuestions = (surveyId) => {
    let questionPromises = [];

    this.state.questions.forEach((question, index) => {
      questionPromises.push(saveSurveyQuestions(surveyId, question, index));
    });

    Promise.all(questionPromises).then(responses => {
      if (responses.some(r => !r.ok)) {
        // TODO how to announce for errors, and help user around this?
        console.log('found some errors');
      }
      // TODO how to update the save button
    });
  }

  startBuildingSurvey = () => {
    const { record } = this.props;
    
    record.set('purpose', 'building');
    this.setState({currentUse: 'building'});
  }

  updateQuestions = (questions) => {
    const { record } = this.props;

    record.set('questions', questions);
    this.setState({questions: questions});
  }

  updateSurveyName = (event) => {
    const name = event.target.value;
    const { record } = this.props;
    const shouldDisable = record.get('surveyId') || !name.length;

    record.set('surveyName', name);
    this.setState({
      surveyName: name,
      saveSurveyDisabled: shouldDisable
    });
  }

  render() {
    let header, canvas;

    if (this.state.currentUse === 'building') {
      header = <header className={Style.buildingHeader}>
        <label className={FormStyle.formInput}>
          <span>survey name</span>
          <input type="text" value={this.state.surveyName} onInput={this.updateSurveyName} disabled={this.props.record.get('surveyId')} />
        </label>

        <quip.apps.ui.Button 
          type="button" 
          onClick={this.saveSurvey} 
          primary="true"
          disabled={this.state.saveSurveyDisabled} 
          text={this.props.record.get('surveyId') ? 'survey saved' : 'save survey'} />
      </header>;

      canvas = <div>
        { this.state.surveyErrors && <ErrorMessage type="newSurvey" error={this.state.surveyErrors} />}
        <Builder questions={this.state.questions} updateQuestions={this.updateQuestions} lockQuestions={this.props.record.get('surveyId')} />
      </div>;
    } else if (this.state.currentUse === 'loading') {
      canvas = <div>retrieve a bear</div>;
    } else {
      header = <nav className={Style.flexirow}>
        <button type="button" onClick={this.startBuildingSurvey}>build a survey</button>
        <button type="button" onClick={this.loadSurveyOptions} disabled>load a survey</button>
      </nav>;
    }

    return <div>
      { header }
      { canvas }
    </div>;
  }
}
