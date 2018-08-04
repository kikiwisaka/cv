import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { editEducation, getCurrentProfile } from '../../actions/profileActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class EditEducation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      school: '',
      degree: '',
      fieldofstudy: '',
      description: '',
      from: '',
      to: '',
      current: false,
      disabled: false,
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
    //get education id from url
    const uri = this.props.location.pathname;
    const lastSlashIndex = uri.lastIndexOf('/');
    const educationId = uri.substring(lastSlashIndex + 1);
    if (nextProps.profile.profile) {
      const educationList = nextProps.profile.profile.education;
      let currentEducation = {};
      for (const i in educationList) {
        switch (educationList[i]._id) {
          case educationId:
            currentEducation.school = educationList[i].school;
            currentEducation.degree = educationList[i].degree;
            currentEducation.fieldofstudy = educationList[i].fieldofstudy;
            currentEducation.description = educationList[i].description;
            let dateFrom = new Date(educationList[i].from);
            currentEducation.from = dateFrom.toISOString().substr(0, 10);
            currentEducation.to = educationList[i].to;
            let dateTo = new Date(educationList[i].to);
            currentEducation.to = dateTo.toISOString().substr(0, 10);
            break;
          default:
            break;
        }
      }
      this.setState({
        education_id: educationId,
        school: currentEducation.school,
        degree: currentEducation.degree,
        fieldofstudy: currentEducation.fieldofstudy,
        description: currentEducation.description,
        from: currentEducation.from,
        to: currentEducation.to,
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
    const educationData = {
      education_id: this.state.education_id,
      school: this.state.school,
      degree: this.state.degree,
      fieldofstudy: this.state.fieldofstudy,
      description: this.state.description,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
    }

    this.props.editEducation(educationData, this.props.history);
  }

  render() {
    const { errors } = this.state; // or const errors = this.state.errors
    return (
      <div className="add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Edit Your Education</h1>
              <p className="lead text-center">Update any school, bootcamp, etc that you have attended</p>
              <small className="d-block pb-3">* = required fileds</small>
              <form onSubmit={this.onSubmit}>
                <h6>School or Bootcamp</h6>
                <TextFieldGroup
                  placeholder="* School or Bootcamp"
                  name="school"
                  value={this.state.school}
                  onChange={this.onChange}
                  error={errors.school}
                />
                <h6>Degree or Certificate</h6>
                <TextFieldGroup
                  placeholder="Degree or Certificate"
                  name="degree"
                  value={this.state.degree}
                  onChange={this.onChange}
                  error={errors.degree}
                />
                <h6>File of Study</h6>
                <TextFieldGroup
                  placeholder="* Field of Study"
                  name="fieldofstudy"
                  value={this.state.fieldofstudy}
                  onChange={this.onChange}
                  error={errors.fieldofstudy}
                />
                <h6>Description</h6>
                <TextAreaFieldGroup
                  placeholder="Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                />
                <h6>From Date</h6>
                <TextFieldGroup
                  name="from"
                  type="date"
                  value={this.state.from}
                  defaultValue={this.state.from}
                  onChange={this.onChange}
                  error={errors.from}
                />
                <h6>To Date</h6>
                <TextFieldGroup
                  name="to"
                  type="date"
                  value={this.state.to}
                  onChange={this.onChange}
                  error={errors.to}
                  disabled={this.state.disabled ? 'disabled' : ''}
                />
                <div className="form-check mb-4">
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
                    Current Study
                  </label>
                </div>
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

EditEducation.propTypes = {
  editEducation: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, { editEducation, getCurrentProfile })(withRouter(EditEducation));