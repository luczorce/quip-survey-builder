import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class CheckboxAnswer extends React.Component {
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
    let value = this.props.answer.answer;

    if (event.target.checked) {
      value.push(event.target.name);
    } else {
      let index = value.indexOf(event.target.name);
      if (index > -1) {
        value.splice(index, 1);
      }
    }

    this.storeAnswer(value);
    this.props.update(this.props.answer.id, qatypes.checkbox, value);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.checkbox, value)
      .then(response => {
        if (!response.ok) {
          console.log('something went wrong with updating the answer');
        }
      });
  }

  render() {
    const options = this.props.options.map((option, index) => {
      let checked = this.props.answer.answer.includes(option);
      let helper;

      if (this.props.optionHelpers[index] && this.props.optionHelpers[index].length) {
        helper = <span className={Style.surveyOptionHelper}>{this.props.optionHelpers[index]}</span>
      }
      
      return <label className={Style.formAnswerOption}>
        <input type="checkbox" checked={checked} name={option} onChange={this.answerUpdate} />
        <span>{option}</span>
        {helper}
      </label>;
    });

    const optionGridStyle = options.length > 4 ? Style.checkboxGridColumns : Style.checkboxGrid;

    let questionHelper;

    if (this.props.helper.length) {
      questionHelper = <p className={Style.surveyHelper}>{this.props.helper}</p>;
    }

    return <div key={this.props.answer.id} className={Style.answerCheckbox}>
      <p className={Style.surveyQuestion}>{this.props.question}</p>
      {questionHelper}
      <div className={optionGridStyle}>{options}</div>
    </div>;
  }
}