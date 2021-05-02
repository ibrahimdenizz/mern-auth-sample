import Joi from 'joi';
import React, { Fragment, useState, useEffect } from 'react';
import { editProfile } from '../../services/userService';

const Personal = ({ isEditable, setIsEditable, user, setUser }) => {
  const [newName, setNewName] = useState('');
  const [password, setPassword] = useState('');
  const [profileErrors, setProfileErrors] = useState({
    name: '',
    password: '',
    top: '',
    success: '',
  });
  useEffect(() => {
    setNewName(user?.name);
  }, [user]);

  const onEdit = async () => {
    const schema = Joi.object({
      name: Joi.string().alphanum().min(5).max(50).required(),
    });

    try {
      const { error } = schema.validate({ name: newName });
      const tempErrors = {};
      if (error) {
        error.details.forEach((err) => {
          tempErrors[err.path[0]] = err.message;
        });

        setProfileErrors({ ...profileErrors, ...tempErrors });
        return;
      }
    } catch (err) {}

    try {
      const result = await editProfile(
        { name: newName },
        { email: user?.email, password }
      );
      setProfileErrors({ ...profileErrors, success: result.success });
      setIsEditable({ ...isEditable, profile: false });
      setUser({ ...user, ...result.user });
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.status >= 400 &&
        err.response.status <= 500
      ) {
        setProfileErrors({ ...profileErrors, ...err.response.data });
      }
    }
  };

  const clearStates = () => {
    setNewName(user?.name);
    setPassword('');

    setProfileErrors({
      ...profileErrors,
      name: '',
      password: '',
      top: '',
    });
  };

  return (
    <div>
      <h3>Personal Details</h3>
      {isEditable.profile ? (
        <Fragment>
          <div className="mb-3 text-danger">{profileErrors.top}</div>

          <h4>Name</h4>
          <div className=" input-group mb-3">
            <input
              type="text"
              className={`form-control ${
                profileErrors.name === '' ? '' : 'is-invalid'
              }`}
              placeholder={user?.name}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className=" invalid-feedback">{profileErrors.name}</div>
          </div>

          <h4>Password</h4>
          <div className="input-group mb-3">
            <input
              type="password"
              className={`form-control ${
                profileErrors.password === '' ? '' : 'is-invalid'
              }`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className=" invalid-feedback">{profileErrors.password}</div>
          </div>
          <div className="mb-3">
            <button onClick={onEdit} className="btn btn-success mr-3">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditable({
                  ...isEditable,
                  profile: false,
                  email: false,
                  password: false,
                });
                clearStates();
              }}
              className="btn btn-danger"
            >
              Cancel
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className=" text-success">{profileErrors.success}</div>
          <h4>Name</h4>
          <p>{user?.name}</p>
          <button
            onClick={() => {
              setIsEditable({
                ...isEditable,
                profile: true,
                email: false,
                password: false,
              });
              clearStates();
            }}
            className="btn btn-outline-primary mb-3"
          >
            Edit Profile
          </button>
        </Fragment>
      )}
    </div>
  );
};

export default Personal;
