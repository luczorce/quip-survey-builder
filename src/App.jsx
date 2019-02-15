import quip from 'quip';

import Builder from './components/Builder.jsx';
import SurveyList from './components/SurveyList.jsx';
import SurveyDeleter from './components/SurveyDeleter.jsx';
import SurveyForm from './components/SurveyForm.jsx';
import ErrorMessage from './components/ErrorMessage.jsx';

import {
  createAnswer,
  getSavedSurveys, 
  getSurveyQuestions
} from './util/survey-communication.js';
import { optionTypes, purposes, qatypes } from './util/enums.js';

import Style from "./App.less";

export default class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      answers: props.record.get('answers') || [],
      availableSurveys: [],
      options: props.record.get('questionOptions').getRecords().map(r => r.getData()),
      purpose: props.record.get('purpose') || null,
      questions: props.record.get('questions') || [],
      surveyName: props.record.get('surveyName') || '',
      surveyId: props.record.get('surveyId') || null,
    };
  }

  componentDidMount() {
    if (this.props.record.get('purpose') === purposes.loading) {
      const id = this.props.record.get('surveyId');
      
      if (id) {
        this.loadSingleSurvey(id);
      } else {
        this.loadSurveyForList();
      }
    } else if (this.props.record.get('purpose') === purposes.deleting) {
      this.loadSurveyForDeleting();
    }
  }

  changePurposeFromBuildToEdit = (surveyId) => {
    this.props.record.set('surveyId', surveyId);
    this.props.record.set('purpose', purposes.editing);
    
    this.setState({
      purpose: purposes.editing,
      surveyId: surveyId
    });
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
          if (question.question_type === qatypes.header) {
            return false;
          } else {
            answerPromises.push(createAnswer(question, quipDocumentId));
          }
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

  loadSurveyForDeleting = () => {
    this.loadSurveyOptions(purposes.deleting);
  }

  loadSurveyForList = () => {
    this.loadSurveyOptions(purposes.loading);
  }

  loadSurveyOptions = (purpose) => {
    const { record } = this.props;
    
    getSavedSurveys().then(response => {
      if (!response.ok) {
        console.log('there was an error loading the surveys');
        return false;
      }

      record.set('purpose', purpose);
      this.setState({
        purpose: purpose,
        availableSurveys: response.data
      });
    });
  }

  startBuildingSurvey = () => {
    const { record } = this.props;
    
    record.set('purpose', purposes.building);
    this.setState({purpose: purposes.building});
  }

  updateAnswerState = (id, type, value) => {
    let answers = this.state.answers;
    let index = answers.findIndex(a => (a.id === id && a.answer_type === type));

    if (index === -1) return;

    answers[index].answer = value;
    this.props.record.set('answers', answers);
    this.setState({answers: answers});
  }

  updateOptionsState = (optionList, optionalIndex) => {
    const { record } = this.props;
    let optionListRecord = record.get('questionOptions');
    
    if (optionalIndex !== null) {
      const oldRecord = optionListRecord.get(optionalIndex);
      optionListRecord.remove(oldRecord);
      optionListRecord.add(optionList, optionalIndex);
    } else {
      optionListRecord.add(optionList);
    }
    
    const options = optionListRecord.getRecords().map(record => record.getData());
    this.setState({options: options});
  }

  updateQuestionsState = (questions) => {
    const { record } = this.props;

    record.set('questions', questions);
    this.setState({questions: questions});
  }

  updateSurveyNameState = (name) => {
    const { record } = this.props;

    record.set('surveyName', name);
    this.setState({
      surveyName: name
    });
  }

  render() {
    let canvas;

    if (this.state.purpose === purposes.building || this.state.purpose === purposes.editing) {
      canvas = <Builder questions={this.state.questions} 
        options={this.state.options} 
        purpose={this.state.purpose} 
        surveyId={this.state.surveyId} 
        surveyName={this.state.surveyName} 
        updateOptions={this.updateOptionsState} 
        updateQuestions={this.updateQuestionsState} 
        updateSurveyName={this.updateSurveyNameState} 
        onSurveySaved={this.changePurposeFromBuildToEdit} />;
    } else if (this.state.purpose === purposes.loading) {
      if (this.props.record.get('surveyId')) {
        canvas = <SurveyForm questions={this.state.questions} answers={this.state.answers} updateAnswer={this.updateAnswerState} />;
      } else {
        canvas = <SurveyList surveys={this.state.availableSurveys} loadSurvey={this.loadSingleSurvey} />;
      }
    } else if (this.state.purpose === purposes.deleting) {
      canvas = <SurveyDeleter surveys={this.state.availableSurveys} />;
    } else {
      // TODO add an "update a survey" option
      canvas = <nav className={Style.flexirow}>
        <quip.apps.ui.Button type="button" onClick={this.startBuildingSurvey} text="build a survey" />
        <quip.apps.ui.Button type="button" onClick={this.loadSurveyForList} text="load a survey" />
        <quip.apps.ui.Button type="button" onClick={this.loadSurveyForDeleting} text="delete surveys" />
      </nav>;
    }

    return <div>{ canvas }</div>;
  }
}
