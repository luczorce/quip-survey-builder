import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";
import GlobalStyle from '../App.less';

export default class StackRankedAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    options: React.PropTypes.array,
    optionHelpers: React.PropTypes.array,
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
    let value = this.props.answer.answer;

    if (event.target.checked) {
      value.push(event.target.name);
    } else {
      let index = value.indexOf(event.target.name);
      if (index > -1) {
        value.splice(index, 1);
      }
    }

    // this.setState({error: null});
    // this.logDocumentActivity();
    // this.storeAnswer(value);
    // this.props.update(this.props.answer.id, qatypes.ranked, value);
  }

  logDocumentActivity = () => {
    quip.apps.sendMessage(`updated the answer to the question: ${this.props.question}`);
  }

  storeAnswer = (value) => {
    // updateAnswer(this.props.answer.id, qatypes.ranked, value)
    //   .then(response => {
    //     if (!response.ok) {
    //       console.error('something went wrong with updating the answer');
    //       console.error(response);
    //       this.setState({error: 'this answer did not update'});
    //     }
    //   });
  }

  render() {
    const options = this.props.options.map((option, index) => {
      let helper;

      if (this.props.optionHelpers[index] && this.props.optionHelpers[index].length) {
        helper = <span className={Style.surveyOptionHelper}>{this.props.optionHelpers[index]}</span>
      }
      
      return <li>
        <span>{option}</span>
        {helper}
      </li>;
    });

    let questionHelper;
    let error;

    if (this.props.helper && this.props.helper.length) {
      questionHelper = <p className={Style.surveyHelper}>{this.props.helper}</p>;
    }

    if (this.state.error !== null && this.state.error.length) {
      error = <p className={GlobalStyle.errorMessage}>{this.state.error}</p>;
    }

    return <div key={this.props.answer.id} className={Style.answerRanked}>
      {error}
      <p className={Style.surveyQuestion}>{this.props.question}</p>
      {questionHelper}
      <ol className={Style.options}>{options}</ol>
    </div>;
  }
}