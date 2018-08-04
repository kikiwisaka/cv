import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profileActions';
import Link from '../../../node_modules/react-router-dom/Link';

class Experience extends Component {
  onDeleteClick(id) {
    this.props.deleteExperience(id);
  }

  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="LL">{exp.from}</Moment> -
          {exp.to === null ? (
            ' Now'
          ) : (
              <Moment format="LL">{exp.to}</Moment>
            )}
        </td>
        <td>
          <Link to={`/experience/${exp._id}`}>
            <i className="far fa-edit text-info mr-1"></i>
          </Link>
          <button onClick={this.onDeleteClick.bind(this, exp._id)} className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th></th>
            </tr>
            {experience}
          </thead>
        </table>
      </div>
    )
  }
}

Experience.proptypes = {
  deleteExperience: PropTypes.func.isRequired
}

export default connect(null, { deleteExperience })(Experience);