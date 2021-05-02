import React, { useState, useContext } from 'react';
import Email from './Email';
import Password from './Password';
import Personal from './Personal';
import { UserContext } from '../../contexts/UserContext';

const User = () => {
  const [user, setUser] = useContext(UserContext);
  const [isEditable, setIsEditable] = useState({
    profile: false,
    email: false,
    password: false,
  });

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div>
        <Personal
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          user={user}
          setUser={setUser}
        />

        <Email
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          user={user}
        />

        <Password
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          user={user}
        />
      </div>
    </div>
  );
};

export default User;
