import { qatypes } from '../util/enums.js';
import Style from "./Form.less";

export default class NumberInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    guid: React.PropTypes.number,
    updated: React.PropTypes.func,
    deleted: React.PropTypes.func,
    lock: React.PropTypes.bool
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid);
  }

  maxValueUpdate = (event) => {
    let max = null;
    
    if (event.target.value >= 0) {
      max = event.target.value
    }

    let updatedQuestion = {
      question: this.props.question,
      min: this.props.min,
      max: max,
      guid: this.props.guid,
      type: qatypes.numberInput
    };

    this.props.updated(updatedQuestion);
  }

  minValueUpdate = (event) => {
    let min = null;
    
    if (event.target.value >= 0) {
      min = event.target.value
    }
    let updatedQuestion = {
      question: this.props.question,
      max: this.props.max,
      min: min,
      guid: this.props.guid,
      type: qatypes.numberInput
    };

    this.props.updated(updatedQuestion);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = {
      question: event.target.value,
      min: this.props.min,
      max: this.props.max,
      guid: this.props.guid,
      type: qatypes.numberInput
    };

    this.props.updated(updatedQuestion);
  }

  render() {
    return <li key={this.props.guid} className={Style.formSection}>
      <p className={Style.sectionDescription}>
        number input <em>(for number-only answers)</em>
        <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter} disabled={this.props.lock}>delete question</button>
      </p>
      
      <label className={Style.formInput}>
        <span>question</span>
        <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} disabled={this.props.lock} />
      </label>

      <label className={Style.formInput}>
        <span>minimum value (leave blank for no minimum)</span>
        <input type="number" value={this.props.min} onChange={this.minValueUpdate} disabled={this.props.lock} />
      </label>

      <label className={Style.formInput}>
        <span>maximum value (leave blank for no maximum)</span>
        <input type="number" value={this.props.max} onChange={this.maxValueUpdate} disabled={this.props.lock} />
      </label>
    </li>;
  }
}