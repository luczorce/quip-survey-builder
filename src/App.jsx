import quip from 'quip';

import Builder from './components/Builder.jsx';
import SurveyList from './components/SurveyList.jsx';
import SurveyForm from './components/SurveyForm.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';

import Style from "./App.less";
import FormStyle from "./components/Form.less";

import {
  createAnswer,
  getSavedSurveys, 
  getSurveyQuestions, 
  saveSurveyName, 
  saveSurveyQuestion 
} from './survey-communication.js';

export default class App extends React.Component {
  constructor(props) {
    super();

    let saveSurveyDisabled = true;

    if (props.record.get('surveyName') && !props.record.get('surveyId')) {
      saveSurveyDisabled = false;
    }

    this.state = {
      currentUse: props.record.get('purpose') || null, // can be either building or loading
      questions: props.record.get('questions') || [],
      surveyName: props.record.get('surveyName') || '',
      saveSurveyDisabled: saveSurveyDisabled,
      availableSurveys: [],
      answers: []
    };
  }

  componentDidMount() {
    if (this.props.record.get('purpose') === 'loading') {
      const id = this.props.record.get('surveyId');
      
      if (id) {
        console.log('looking for a survey');
        this.loadSingleSurvey(id);
      } else {
        this.loadSurveyOptions();
      }
    }
  }

  loadSingleSurvey = (surveyId) => {
    if (surveyId === null) return false;

    const { record } = this.props;

    if (record.get('surveyId') && record.get('questions') && record.get('answers')) {
      console.log('got saved questions and answers here');
    } else {
      let questions, answers;

      // now with all the questions
      // create the answers, based on the type of question and the quip id
      // or load the answers, if we have them stored in the record 
      // finally update the record
      
      // this.setState({
      //   questions: questionResponse.data
      // });
      
      getSurveyQuestions(surveyId).then(questionResponse => {
        if (!questionResponse.ok) {
          console.log('there was an error loading the surveys');
          return Promise.reject();
        }

        let answerPromises = [];
        let quipDocumentId = quip.apps.getThreadId();

        questions = questionResponse.data;
        record.set('questions', questions);

        questions.forEach((question, index) => {
          answerPromises.push(createAnswer(question, quipDocumentId));
        });

        return Promise.all(answerPromises);
      }).then(answerResponse => {
        console.log(answerResponse);
        answers = answerResponse.map(a => a.data);
        console.log(answers);
        
        if (answerResponse.some(a => !a.ok)) {
          console.log('there are some errors with the answers');
          return Promise.reject();
        } else {
          record.set('answers', answers);
        }
      }).then(() => {
        record.set('surveyId', Number(surveyId));
        this.setState({
          questions,
          answers
        });
      });
    }
  }

  loadSurveyOptions = () => {
    const { record } = this.props;
    
    getSavedSurveys().then(response => {
      if (!response.ok) {
        console.log('there was an error loading the surveys');
        return false;
      }

      record.set('purpose', 'loading');
      this.setState({
        currentUse: 'loading',
        availableSurveys: response.data
      });
    });
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
      questionPromises.push(saveSurveyQuestion(surveyId, question, index));
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
      if (this.props.record.get('surveyId')) {
        canvas = <SurveyForm questions={this.state.questions} answers={this.state.answers} />;
      } else {
        canvas = <SurveyList surveys={this.state.availableSurveys} loadSurvey={this.loadSingleSurvey} />;
      }
    } else {
      header = <nav className={Style.flexirow}>
        <quip.apps.ui.Button type="button" onClick={this.startBuildingSurvey} text="build a survey" />
        <quip.apps.ui.Button type="button" onClick={this.loadSurveyOptions} text="load a survey" />
      </nav>;
    }

    return <div>
      { header }
      { canvas }
    </div>;
  }
}
