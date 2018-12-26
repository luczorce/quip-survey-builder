export default class TextInput extends React.Component {
  static propTypes = {
    question: React.PropTypes.string,
    index: React.PropTypes.number,
    guid: React.PropTypes.number,
    updated: React.PropTypes.func,
    deleted: React.PropTypes.func
  }

  deleteQuestion = () => {
    this.props.deleted(this.props.guid);
  }

  questionValueUpdate = (event) => {
    let updatedQuestion = {
      index: this.props.index, 
      question: event.target.value,
      guid: this.props.guid,
      type: 'textInput'
    };

    this.updateQuestion(updatedQuestion);
  }

  updateQuestion(updatedQuestion) {
    this.props.updated(updatedQuestion);
  }

  render() {
    return <li key={this.props.guid}>
      <p>
        <em>text input</em>
        <button type="button" onClick={this.deleteQuestion}>delete question</button>
      </p>
      
      <label>
        <span>question</span>
        <input type="text" value={this.props.question} placeholder="(Who did you talk to last?)" onChange={this.questionValueUpdate} />
      </label>
      
      <div>index: {this.props.index + 1}</div>
    </li>;
  }
}