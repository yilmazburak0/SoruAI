import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  userName: yup
    .string()
    .required('Kullanıcı adı gereklidir'),
  password: yup
    .string()
    .min(5, 'Şifre en az 5 karakter olmalıdır')
    .required('Şifre gereklidir'),
});

export const validateLoginForm = async (formData) => {
  try {
    await loginSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    const errors = {};
    err.inner.forEach((e) => {
      errors[e.path] = e.message;
    });
    return { isValid: false, errors };
  }
};