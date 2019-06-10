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

  answerUpdate = (answer) => {
    this.setState({error: null});
    this.logDocumentActivity();
    this.storeAnswer(answer);
    this.props.update(this.props.answer.id, qatypes.ranked, answer);
  }

  logDocumentActivity = () => {
    quip.apps.sendMessage(`updated the answer to the question: ${this.props.question}`);
  }

  moveOptionDown = (event) => {
    const target = Number(event.currentTarget.dataset.index);
    let answer = this.props.answer.answer;
    let moving = answer[target];
    
    // remove it from the array first
    answer.splice(target, 1);
    // add it back in it's (new) spot
    answer.splice(target + 1, 0, moving);

    this.answerUpdate(answer);
  }

  moveOptionUp = (event) => {
    const target = Number(event.currentTarget.dataset.index);
    let answer = this.props.answer.answer;
    let moving = answer[target];

    // remove it from the array first
    answer.splice(target, 1);
    // add it back in it's new spot
    answer.splice(target - 1, 0, moving);

    this.answerUpdate(answer);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.ranked, value)
      .then(response => {
        if (!response.ok) {
          console.error('something went wrong with updating the answer');
          console.error(response);
          this.setState({error: 'this answer did not update'});
        }
      });
  }

  render() {   
    const options = this.props.answer.answer.map((option, index) => {
      const key = option.replace(' ', '-');
      let helper;

      if (this.props.optionHelpers[index] && this.props.optionHelpers[index].length) {
        helper = <span className={Style.surveyOptionHelper}>{this.props.optionHelpers[index]}</span>
      }

      return <li className={Style.rankOption} key={key}>
        <span>{option}</span>
        {helper}

        <div className={Style.rankedControls}>
          <button type="button" onClick={this.moveOptionUp} data-index={index} title="move option up ranking"><UpArrowIcon /></button>
          <button type="button" onClick={this.moveOptionDown} data-index={index} title="move option down ranking"><DownArrowIcon /></button>
        </div>
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

function DownArrowIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a6a6a6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
}

function UpArrowIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a6a6a6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
}