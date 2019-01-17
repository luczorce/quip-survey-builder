import { debounce } from 'throttle-debounce';
import { updateAnswer } from '../util/survey-communication.js';
import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class SelectAnswer extends React.Component {
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
    this.props.update(this.props.answer.id, qatypes.select, value);
  }

  storeAnswer = (value) => {
    updateAnswer(this.props.answer.id, qatypes.select, value)
      .then(response => {
        if (!response.ok) {
          console.log('something went wrong with updating the answer');
        }
      });
  }

  render() {
    const options = this.props.options.map((option, index) => {
      let selected = Boolean(option === this.props.answer.answer);
      let helper = this.props.optionHelpers[index];
      
      return <option value={option} selected={selected}>{option} ({helper})</option>;
    });

    return <div key={this.props.answer.id} className={Style.answerSelect}>
      <label className={Style.formAnswerSelect}>
        <p className={Style.surveyQuestion}>{this.props.question}</p>
        { this.props.helper.length && <p className={Style.surveyHelper}>{this.props.helper}</p> }

        <select onChange={this.answerUpdate}>
          <option>--</option>
          {options}
        </select>
      </label>
    </div>;
  }
}