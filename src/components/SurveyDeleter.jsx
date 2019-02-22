import { deleteSurvey } from '../util/survey-communication.js';
import Style from './Form.less';
import GlobalStyle from '../App.less';

export default class SurveyList extends React.Component {
  static propTypes = {
    surveys: React.PropTypes.array
  };

  constructor(props) {
    super();

    this.state = {
      deleteMe: [],
      hasFinished: false,
      withErrors: false
    }
  }

  choppingBlockUpdate = (event) => {
    let choppingBlock = this.state.deleteMe;

    if (event.target.checked) {

      this.setState({
        deleteMe: choppingBlock.concat(event.target.name)
      });
    } else {
      let index = choppingBlock.indexOf(event.target.name);
      
      if (index > -1) {
        choppingBlock.splice(index, 1);
      }

      this.setState({deleteMe: choppingBlock});
    }
  }

  deleteSelectedSurveys = () => {
    const deletePromises = this.state.deleteMe.map(id => {
      return deleteSurvey(id);
    });

    Promise.all(deletePromises).then(responses => {
      this.setState({
        hasFinished: true,
        withErrors: responses.some(r => !r.ok)
      });
    });
  }

  render() {
    let options;
    let instructions;
    let content;
    const optionGridStyle = this.props.surveys.length > 4 ? Style.checkboxGridColumns : Style.checkboxGrid;
    
    options = this.props.surveys.map(s => {
      return <label className={Style.formAnswerOption}>
        <input type="checkbox" disabled={this.state.hasFinished} name={s.id} onChange={this.choppingBlockUpdate} />
        <span>{s.name}</span>
      </label>;
    });

    if (this.state.hasFinished) {
      if (this.state.withErrors) {
        instructions = <p className={GlobalStyle.errorMessage}>There were some errors with deleting. Reload the page and try again. :(</p>;
      } else {
        instructions = <p className={GlobalStyle.notificationMessage}>The surveys were deleted. Feel free to reload or delete this live app.</p>;
      }
    } else if (this.props.surveys.length) {
      instructions = <div>
        <p>Choose all the questions you would like to delete.</p>
        <p><em><strong>Beware!</strong> You cannot undo this action.</em></p>
      </div>;
    }

    if (!this.props.surveys.length) {
      content = <p>There are no surveys to delete...</p>;
    } else {
      content = <div>
        <div className={optionGridStyle}>{options}</div>
        <p>
          <quip.apps.ui.Button type="button" onClick={this.deleteSelectedSurveys} text="delete selected surveys" disabled={this.state.hasFinished} />
        </p>
      </div>;
    }

    return <section>
      {instructions}
      {content}
    </section>;
  }
}
