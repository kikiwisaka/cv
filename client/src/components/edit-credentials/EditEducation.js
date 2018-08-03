import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { editEducation, getCurrentProfile } from '../../actions/profileActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from '../../validation/is-empty';
// import { getUrlHashSplit } from '../common/CommonFunction';


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
            currentEducation.from = educationList[i].from;
            currentEducation.to = educationList[i].to;
            break;
          default:
            break;
        }
      }
      this.setState({
        school: currentEducation.school,
        degree: currentEducation.degree,
        fieldofstudy: currentEducation.fieldofstudy,
        description: currentEducation.description,
        from: currentEducation.from,
        to: currentEducation.to,
      });
    }
  }
  onSubmit(e) {
    console.log('aaaaaaa');
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