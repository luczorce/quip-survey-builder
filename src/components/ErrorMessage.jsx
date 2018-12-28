import Style from "../App.less";

export default class ErrorMessage extends React.Component {
  static propTypes = {
    type: React.PropTypes.string,
    error: React.PropTypes.object
  }

  determineOpener = () => {
    let opener;

    switch (this.props.type) {
      case 'newSurvey':
        opener = 'survey wasn\'t saved: ';
        break;
      default:
        opener = 'there was an issue';
    }

    return opener;
  }

  generateError = () => {
    if (!this.props.error) {
      return '';
    }

    let error;

    if (typeof this.props.error === 'string') {
      error = this.props.error;
    } else {
      let errorParts = [];

      Object.keys(this.props.error).forEach(key => {
        errorParts.push(`${key} ${this.props.error[key].join(', ')}`);
      });

      error = errorParts.join('; ');
    }

    return error;
  }

  render() {
    let opener = this.determineOpener();
    let error = this.generateError();
    return <p className={Style.errorMessage}>{opener} {error}</p>;
  }
}