import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';
import Link from '../../../node_modules/react-router-dom/Link';

class Education extends Component {
  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }

  render() {
    const education = this.props.education.map(edu => (
      <tr key={edu._id}>
        <td>{edu.school}</td>
        <td>{edu.degree}</td>
        <td>
          <Moment format="LL">{edu.from}</Moment> -
          {edu.to === null ? (
            ' Now'
          ) : (
              <Moment format="LL">{edu.to}</Moment>
            )}
        </td>
        <td>
          <Link to={`/education/${edu._id}`}>
            <i className="far fa-edit text-info mr-1"></i>
          </Link>
          <button onClick={this.onDeleteClick.bind(this, edu._id)} className="btn btn-danger">Delete</button>
        </td>
      </tr>
    ))
    return (
      <div>
        <h4 className="mb-4">Education Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>School</th>
              <th>Degree</th>
              <th>Years</th>
              <th></th>
            </tr>
            {education}
          </thead>
        </table>
      </div>
    )
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
}

export default connect(null, { deleteEducation })(Education);