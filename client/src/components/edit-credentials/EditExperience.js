import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { editExperience, getCurrentProfile } from '../../actions/profileActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class EditExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company: '',
      title: '',
      location: '',
      from: '',
      to: '',
      current: false,
      description: '',
      errors: {}
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
    //get experience id from url
    const uri = this.props.location.pathname;
    const lastSlashIndex = uri.lastIndexOf('/');
    const experienceId = uri.substring(lastSlashIndex + 1);
    if (nextProps.profile.profile) {
      const experienceList = nextProps.profile.profile.experience;
      let currentExperience = {};
      for (const i in experienceList) {
        switch (experienceList[i]._id) {
          case experienceId:
            currentExperience.company = experienceList[i].company;
            currentExperience.title = experienceList[i].title;
            currentExperience.location = experienceList[i].location;
            let dateFrom = new Date(experienceList[i].from);
            currentExperience.from = dateFrom.toISOString().substr(0, 10);
            let dateTo = new Date(experienceList[i].to);
            currentExperience.to = dateTo.toISOString().substr(0, 10);
            currentExperience.current = experienceList[i].current;
            currentExperience.description = experienceList[i].description;
            break;
          default:
            break;
        }
      }
      this.setState({
        experience_id: experienceId,
        company: currentExperience.company,
        title: currentExperience.title,
        location: currentExperience.location,
        from: currentExperience.from,
        to: currentExperience.to,
        current: currentExperience.current,
        description: currentExperience.description
      });
    }
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => { });
  }
  onSubmit(e) {
    e.preventDefault();
    const experienceData = {
      experience_id: this.state.experience_id,
      company: this.state.company,
      title: this.state.title,
      location: this.state.location,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description
    }
    this.props.editExperience(experienceData, this.props.history);
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="edit-experience">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Edit Your Experience</h1>
              <p className="lead text-center">
                Update any company, title, etc that you have
              </p>
              <small className="d-block pb-3">* = required fileds</small>
              <form onSubmit={this.onSubmit}>
                <h6>Company</h6>
                <TextFieldGroup
                  placeholder="* Compay"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.school}
                />
                <h6>Title</h6>
                <TextFieldGroup
                  placeholder="* Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
                <h6>Location</h6>
                <TextFieldGroup
                  placeholder="* Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                />
                <h6>From</h6>
                <TextFieldGroup
                  placeholder="* From"
                  name="from"
                  type="date"
                  value={this.state.from}
                  onChange={this.onChange}
                  error={errors.from}
                />
                <h6>To</h6>
                <TextFieldGroup
                  placeholder="* To"
                  name="to"
                  type="date"
                  value={this.state.to}
                  onChange={this.onChange}
                  error={errors.to}
                />
                <h6>Description</h6>
                <TextAreaFieldGroup
                  placeholder="Job Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                />
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="current"
                  value={this.state.current}
                  checked={this.state.current}
                  onChange={this.onCheck}
                  id="current"
                />
                <label htmlFor="current" className="form-check-label">
                  Current Job
                </label>
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EditExperience.propTypes = {
  editExperience: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, { editExperience, getCurrentProfile })(withRouter(EditExperience));