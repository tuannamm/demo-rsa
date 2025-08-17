import React, { useState } from 'react';

function PasswordInput({ value, onChange, placeholder, id }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="password-container">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <i
        className={`password-toggle fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
        onClick={togglePasswordVisibility}
      />
    </div>
  );
}

export default PasswordInput;