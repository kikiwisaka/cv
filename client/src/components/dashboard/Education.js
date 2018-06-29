import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {
  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }
  onEditClick(id) {
    console.log('deleye');
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
          <button onClick={this.onEditClick.bind(this, edu._id)} className="btn btn-warning mr-2">Edit</button>
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