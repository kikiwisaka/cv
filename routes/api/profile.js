const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile @desc    Get user profile @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile
    .findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res
          .status('404')
          .json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile @desc    Create or edit user profile @access
// Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid)
    return res.status(400).json(errors);

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle)
    profileFields.handle = req.body.handle;
  if (req.body.company)
    profileFields.company = req.body.company;
  if (req.body.website)
    profileFields.website = req.body.website;
  if (req.body.location)
    profileFields.location = req.body.location;
  if (req.body.status)
    profileFields.status = req.body.status;
  if (req.body.bio)
    profileFields.bio = req.body.bio;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;

  // Skills need to split into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req
      .body
      .skills
      .split(',');
  }
  // Social
  profileFields.social = {};
  if (req.body.linkedin)
    profileFields.social.linkedin = req.body.linkedin;
  if (req.body.youtube)
    profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter)
    profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook)
    profileFields.social.facebook = req.body.facebook;
  if (req.body.instagram)
    profileFields.social.instagram = req.body.instagram;

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create Check if handle exists
        Profile
          .findOne({ handle: profileFields.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // Save
            new Profile(profileFields)
              .save()
              .then(profile => {
                res.json(profile);
              })
          });
      }
    })
});

// @route   GET api/profile/handle/:handle @desc    Get profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile
    .findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.nopfile = 'There is no profile for this user';
        res
          .status(404)
          .json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile
    .findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.nopfile = 'There is no profile for this user';
        res
          .status(404)
          .json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile' }));
});

// @route   GET api/profile/all @desc    Get all profiles @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile
    .find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.nopfile = 'There are no profile';
        res
          .status(404)
          .json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profiles: 'There are no profile' }));
});

// @route   POST api/profile/experience @desc    Add experience into profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);
  if (!isValid)
    return res.status(400).json(errors);

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      // Add to experience array
      profile
        .experience
        .unshift(newExp);
      profile
        .save()
        .then(profile => res.json(profile));
    })
});

// @route PUT api/profile/experience/:experience_id
// @desc Edit experience based on profile
// @access Private
router.put('/experience/:experience_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceInput(req.body);
  if (!isValid)
    return res.status(400).json(errors);

  const expeValue = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description
  }
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile
        .experience
        .map(item => item.id)
        .indexOf(req.params.experience_id);
      //check exsiting data
      if (removeIndex != -1) {
        //remove old value from array
        profile.experience.splice(removeIndex, 1);
        //add new value into array
        profile
          .experience
          .unshift(expeValue);
        //sorting by from (join date)
        profile.experience.sort((a, b) => new Date(b.from) - new Date(a.from));
        profile
          .save()
          .then(profile => res.json(profile));
      } else {
        return res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/experience/:experience_id @desc    Delete
// experience into profile @access  Private
router.delete('/experience/:experience_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      // Get remove index
      const removeIndex = profile
        .experience
        .map(item => item.id)
        .indexOf(req.params.experience_id);
      // Splice out of array
      profile
        .experience
        .splice(removeIndex, 1);
      // Save
      profile
        .save()
        .then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile/education @desc    Add education into profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);
  if (!isValid)
    return res.status(400).json(errors);

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        description: req.body.description,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current
      }
      // Add to experience array
      profile
        .education
        .unshift(newEdu);
      profile
        .save()
        .then(profile => res.json(profile));
    })
});

// @route PUT api/profile/education/:education_id
// @desc Edit education based on profile
// @access Private
router.put('/education/:education_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);
  if (!isValid)
    return res.status(400).json(errors);
  const eduValue = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    description: req.body.description,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current
  }
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      const removeIndex = profile
        .education
        .map(item => item.id)
        .indexOf(req.params.education_id);
      //check exsiting data
      if (removeIndex != -1) {
        //remove old value from array
        profile.education.splice(removeIndex, 1);
        //add new value into array
        profile
          .education
          .unshift(eduValue);
        profile
          .save()
          .then(profile => res.json(profile));
      } else {
        return res.status(404).json(errors);
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile/education/:education_id 
// @desc    Delete experience into profile 
// @access  Private
router.delete('/education/:education_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      // Get remove index
      const removeIndex = profile
        .education
        .map(item => item.id)
        .indexOf(req.params.education_id);
      // Splice out of array
      profile
        .education
        .splice(removeIndex, 1);
      // Save
      profile
        .save()
        .then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

// @route   DELETE api/profile
// @desc    Delete user and profile 
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
      User.findOneAndRemove({ _id: req.user.id })
        .then(() =>
          res.json({
            success: true
          })
        );
    })
});

module.exports = router;