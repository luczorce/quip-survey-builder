import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class RadioAnswer extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    helper: React.PropTypes.string,
    options: React.PropTypes.array,
    optionHelpers: React.PropTypes.array,
    answer: React.PropTypes.object,
    update: React.PropTypes.func
  }

  componentDidMount() {
    this.storeAnswer = debounce(1000, this.storeAnswer);
  }

  answerUpdate = (event) => {
    const value = event.target.value;
    this.storeAnswer(value);
    this.props.update(this.props.answer.id, qatypes.radio, value);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.radio, value)
      .then(response => {
        if (!response.ok) {
          console.log('something went wrong with updating the answer');
        }
      });
  }

  render() {
    const options = this.props.options.map((option, index) => {
      let checked = Boolean(option === this.props.answer.answer);
      let helper = this.props.optionHelpers[index];
      
      return <label className={Style.formAnswerOption}>
        <input type="radio" value={option} checked={checked} name={'radio' + this.props.answer.id} onChange={this.answerUpdate} />
        <span>{option}</span>
        { helper.length && <span className={Style.surveyHelper}>{helper}</span> }
      </label>;
    });

    return <div key={this.props.answer.id} className={Style.answerRadio}>
      <p className={Style.surveyQuestion}>{this.props.question}</p>
      { this.props.helper.length && <p className={Style.surveyHelper}>{this.props.helper}</p> }

      {options}
    </div>;
  }
}