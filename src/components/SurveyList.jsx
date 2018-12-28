import Style from '../App.less';
import FormStyle from './Form.less';

export default class SurveyList extends React.Component {
  static propTypes = {
    surveys: React.PropTypes.array,
    loadSurvey: React.PropTypes.func
  };

  choice = null;

  chooseSurvey = () => {
    this.props.loadSurvey(this.choice);
  }

  updateChoice = (event) => {
    this.choice = event.target.value;
  }

  render() {
    const options = this.props.surveys.map(s => {
      return <option key={s.id} value={s.id}>{s.name}</option>;
    });

    return <section className={Style.flexirow}>
      <label className={FormStyle.formSelect}>
        <span>choose a survey</span>
        <select onChange={this.updateChoice}>
          <option>--</option>
          {options}
        </select>
      </label>

      <quip.apps.ui.Button type="button" onClick={this.chooseSurvey} text="load survey" />
    </section>;
  }
}
