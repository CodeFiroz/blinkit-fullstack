export const validateFields = (data, rules) => {
  const errors = {};

  for (const field in rules) {
    const value = data[field];
    const rule = rules[field];

    if (rule.required && (value === undefined || value === null || value === "")) {
      errors[field] = `${field} is required.`;
      continue;
    }

    if (rule.type && value !== undefined && value !== null && value !== "") {
      if (rule.type === 'number' && typeof value !== 'number') {
        if (isNaN(Number(value))) {
          errors[field] = `${field} must be a number.`;
        }
      }

      if (rule.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = `${field} must be a valid email.`;
        }
      }

      if (rule.type === 'string' && typeof value !== 'string') {
        errors[field] = `${field} must be a string.`;
      }

      if (rule.type === 'boolean' && typeof value !== 'boolean') {
        errors[field] = `${field} must be a boolean.`;
      }
    }

    if (rule.enum && !rule.enum.includes(value)) {
      errors[field] = `${field} must be one of: ${rule.enum.join(', ')}`;
    }

    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters long.`;
    }

    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      errors[field] = `${field} must be at most ${rule.maxLength} characters long.`;
    }
  }

  return Object.keys(errors).length ? errors : null;
};


/*

Ussage ::

  const errors = validateFields(req.body, {
    name: { required: true, type: 'string' },
    email: { required: true, type: 'email' },
    password: { required: true, minLength: 6 },
    role: { enum: ['customer', 'vendor', 'admin'] }
  });

  if (errors) {
    return res.status(400).json({ errors });
  }

*/