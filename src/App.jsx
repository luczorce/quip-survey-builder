import quip from 'quip';

import Builder from './components/Builder.jsx';
import SurveyList from './components/SurveyList.jsx';
import SurveyForm from './components/SurveyForm.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';

import Style from "./App.less";

import {
  createAnswer,
  getSavedSurveys, 
  getSurveyQuestions, 
  saveSurveyName, 
  saveSurveyQuestion 
} from './util/survey-communication.js';
import { qatypes, purposes } from './util/enums.js';

export default class App extends React.Component {
  constructor(props) {
    super();

    let saveSurveyDisabled = true;

    if (props.record.get('surveyName') && !props.record.get('surveyId')) {
      saveSurveyDisabled = false;
    }

    this.state = {
      purpose: props.record.get('purpose') || null,
      questions: props.record.get('questions') || [],
      surveyName: props.record.get('surveyName') || '',
      saveSurveyDisabled: saveSurveyDisabled,
      availableSurveys: [],
      answers: props.record.get('answers') || [],
      surveyErrors: null
    };
  }

  componentDidMount() {
    if (this.props.record.get('purpose') === purposes.loading) {
      const id = this.props.record.get('surveyId');
      
      if (id) {
        this.loadSingleSurvey(id);
      } else {
        this.loadSurveyOptions();
      }
    }
  }

  loadSingleSurvey = (surveyId) => {
    if (surveyId === null) return false;

    const { record } = this.props;

    if (!record.get('surveyId')) {
      let questions, answers;
      
      getSurveyQuestions(surveyId).then(questionResponse => {
        if (!questionResponse.ok) {
          console.log('there was an error loading the questions');
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
        answers = answerResponse.map(a => a.data);
        
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

      record.set('purpose', purposes.loading);
      this.setState({
        purpose: purposes.loading,
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
    });
  }

  startBuildingSurvey = () => {
    const { record } = this.props;
    
    record.set('purpose', purposes.building);
    this.setState({purpose: purposes.building});
  }

  updateAnswerState = (id, type, value) => {
    let answers = this.state.answers;
    let index = answers.findIndex(a => a.id === id);

    if (index === -1) return;

    // TODO if (type === qatypes.textInput)
    answers[index].answer = value;
    this.props.record.set('answers', answers);
    this.setState({answers: answers});
  }

  updateQuestionsState = (questions) => {
    const { record } = this.props;

    record.set('questions', questions);
    this.setState({questions: questions});
  }

  updateSurveyNameState = (name) => {
    const { record } = this.props;
    const shouldDisable = record.get('surveyId') || !name.length;

    record.set('surveyName', name);
    this.setState({
      surveyName: name,
      saveSurveyDisabled: shouldDisable
    });
  }

  render() {
    let canvas;

    if (this.state.purpose === purposes.building) {
      canvas = <Builder questions={this.state.questions} 
        lockQuestions={this.props.record.get('surveyId')} 
        surveyName={this.state.surveyName} 
        disableSave={this.state.saveSurveyDisabled} 
        updateQuestions={this.updateQuestionsState} 
        updateSurveyName={this.updateSurveyNameState} 
        saveSurvey={this.saveSurvey} />;
    } else if (this.state.purpose === purposes.loading) {
      if (this.props.record.get('surveyId')) {
        canvas = <SurveyForm questions={this.state.questions} answers={this.state.answers} updateAnswer={this.updateAnswerState} />;
      } else {
        canvas = <SurveyList surveys={this.state.availableSurveys} loadSurvey={this.loadSingleSurvey} />;
      }
    } else {
      canvas = <nav className={Style.flexirow}>
        <quip.apps.ui.Button type="button" onClick={this.startBuildingSurvey} text="build a survey" />
        <quip.apps.ui.Button type="button" onClick={this.loadSurveyOptions} text="load a survey" />
      </nav>;
    }

    return <div>{ canvas }</div>;
  }
}
