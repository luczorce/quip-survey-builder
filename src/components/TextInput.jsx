import Style from "./Form.less";

export default class TextInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    guid: React.PropTypes.number,
    updated: React.PropTypes.func,
    deleted: React.PropTypes.func,
    lock: React.PropTypes.bool
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = {
      question: event.target.value,
      guid: this.props.guid,
      type: 'textInput'
    };

    this.props.updated(updatedQuestion);
  }

  render() {
    return <li key={this.props.guid} className={Style.formSection}>
      <p>
        <em>text input</em>
        <button type="button" onClick={this.deleteQuestion} className={Style.sectionDeleter} disabled={this.props.lock}>delete question</button>
      </p>
      
      <label className={Style.formInput}>
        <span>question</span>
        <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} disabled={this.props.lock} />
      </label>
    </li>;
  }
}