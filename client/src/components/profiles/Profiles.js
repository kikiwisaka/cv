import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../common/Spinner';
import { getProfiles } from '../../actions/profileActions';
import ProfileItem from './ProfileItem';

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    const { isAuthenticated } = this.props.auth;
    console.log(isAuthenticated);
    let profileItem;
    if (profiles === null || loading) {
      profileItem = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItem = profiles.map(profile => (
          <ProfileItem key={profile._id} profile={profile} isAuthenticated={isAuthenticated} />
        ))
      } else {
        profileItem = <h4>No profile found....</h4>
      }
    }
    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center"></h1>
              {profileItem}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getProfiles })(Profiles);