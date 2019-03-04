import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";
import GlobalStyle from '../App.less';

export default class TextareaAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    answer: React.PropTypes.object,
    update: React.PropTypes.func
  }

  constructor(props) {
    super();

    this.state = {
      error: null
    };
  }

  componentDidMount() {
    this.storeAnswer = debounce(1000, this.storeAnswer);
    this.logDocumentActivity = debounce(5000, this.logDocumentActivity);
  }

  answerUpdate = (event) => {
    this.setState({error: null});
    this.storeAnswer(event.target.value);
    this.logDocumentActivity();
    this.props.update(this.props.answer.id, qatypes.textarea, event.target.value);
  }

  logDocumentActivity = () => {
    quip.apps.sendMessage(`updated the answer to the question: ${this.props.question}`);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.textarea, value)
      .then(response => {
        if (!response.ok) {
          console.error('something went wrong with updating the answer');
          console.error(response);
          this.setState({error: 'this answer did not update'});
        }
      });
  }

  render() {
    let helper;
    let error;

    if (this.props.helper && this.props.helper.length) {
      helper = <p className={Style.surveyHelper}>{this.props.helper}</p>;
    }

    if (this.state.error !== null && this.state.error.length) {
      error = <p className={GlobalStyle.errorMessage}>{this.state.error}</p>;
    }

    return <div key={this.props.answer.id} className={Style.answerTextarea}>
      {error}
      <label className={Style.formAnswerTextarea}>
        <p className={Style.surveyQuestion}>{this.props.question}</p>
        {helper}
        <textarea value={this.props.answer ? this.props.answer.answer : ''} onChange={this.answerUpdate} />
      </label>
    </div>;
  }
}