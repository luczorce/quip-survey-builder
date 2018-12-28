import Style from "./App.less";
import FormStyle from "./components/Form.less";
import Builder from './components/Builder.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';
import { saveSurveyName, saveSurveyQuestions } from './survey-communication.js';

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      // can be either building or loading
      currentUse: props.record.get('purpose') || null,
      questions: props.record.get('questions') || [],
      surveyName: props.record.get('surveyName') || '',
      saveSurveyDisabled: !props.record.get('surveyName').length
    };

    // TODO see props.record.get('surveyId'), if it is present then this survey has been saved
  }

  loadSurveyOptions = () => {
    const { record } = this.props;
    
    record.set('purpose', 'loading');
    this.setState({currentUse: 'loading'});
  }

  saveSurvey = () => {
    this.setState({saveSurveyDisabled: true}, () => {
      let hasErrors = false;

      saveSurveyName(this.state.surveyName)
        .then(response => {
          if (!response.ok) {
            hasErrors = true;
          }

          return response.json();
        })
        .then(response => {
          if (hasErrors) {
            this.setState({
              surveyErrors: response,
              saveSurveyDisabled: false
            });
          } else {
            this.props.record.set('surveyId', response.id);
            this.saveQuestions(response.id);
          }
        });
    });
  }

  saveQuestions = (surveyId) => {
    let questionPromises = [];

    this.state.questions.forEach((question, index) => {
      questionPromises.push(saveSurveyQuestions(surveyId, question, index));
    });

    Promise.all(questionPromises)
      .then(responses => {
      // TODO check for any errors?
      // TODO how to update the save button... should be update survey now?
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

    record.set('surveyName', name);
    this.setState({
      surveyName: name,
      saveSurveyDisabled: !name.length
    });
  }

  render() {
    let header, canvas;

    if (this.state.currentUse === 'building') {
      header = <header className={Style.buildingHeader}>
        <label className={FormStyle.formInput}>
          <span>survey name</span>
          <input type="text" value={this.state.surveyName} onInput={this.updateSurveyName} />
        </label>

        <button type="button" onClick={this.saveSurvey} disabled={this.state.saveSurveyDisabled}>save survey</button>
      </header>;

      canvas = <div>
        { this.state.surveyErrors && <ErrorMessage type="newSurvey" error={this.state.surveyErrors} />}
        <Builder questions={this.state.questions} updateQuestions={this.updateQuestions}/>
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
