// export const validateLoginForm = (data) => {
//   const errors = {};
//   data.user_name = data.user_name?.trim();
//   if (!data.user_name) {
//     errors.user_name = "Email is required";
//   } else if (!/^\S+@\S+\.\S+$/.test(data.user_name)) {
//     errors.user_name = "Invalid email format.";
//   }

//   if (!data.password) {
//     errors.password = "Password is required";
//   }

//   return {
//     isValid: Object.keys(errors).length === 0,
//     errors,
//   };
// };

export const validateLoginForm = (data) => {
  const errors = {};

  const userName = data.user_name?.trim();
  const password = data.password?.trim();

  if (!userName) {
    errors.user_name = "Email address is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(userName)) {
    errors.user_name = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// export const validateForgPasswordForm = ({ email }) => {
//   if (!email) {
//     return { isValid: false, error: "Email is required" };
//   } else if (!/^\S+@\S+\.\S+$/.test(email)) {
//     return { isValid: false, error: "Invalid email format." };
//   }
//   return { isValid: true, error: "" };
// };

export const validateForgPasswordForm = ({ email }) => {
  const trimmedEmail = email?.trim();

  if (!trimmedEmail) {
    return { isValid: false, error: "Email is required" };
  } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    return { isValid: false, error: "Invalid email format." };
  }

  return { isValid: true, error: "" };
};


export const validateSetPasswordForm = ({ newPassword, confirmPassword }) => {
  const errors = {};

  if (!newPassword?.trim()) {
    errors.newPassword = "New Password is required.";
  } else if (newPassword.length < 6) {
    errors.newPassword = "Password must be a minimum of 6 characters.";
  }

  if (!confirmPassword?.trim()) {
    errors.confirmPassword = "Confirm Password is required.";
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = "Password does not match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAiConfigForm = (data) => {
  const errors = {};

  if (!data.display_name.trim()) {
    errors.display_name = "Display name is required";
  }

  if (!data.open_ai_api_key.trim()) {
    errors.open_ai_api_key = "Api key is required";
  }

  if (!data.open_ai_p_key.trim()) {
    errors.open_ai_p_key = "Product key is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
export const validateAiFunctionConfigForm = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.description.trim()) {
    errors.description = "Description is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateUpdateClientForm = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "Workspace name is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAddClientForm = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "Please enter workspace name!";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAddProjectForm = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "Project name is required";
  }

  if (!data.open_ai_config_id.trim()) {
    errors.open_ai_config_id = "Please select Open AI Config ID";
  }

  if (!data.display_name.trim()) {
    errors.display_name = "Display name is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
