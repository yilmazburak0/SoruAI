import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  userName: yup
    .string()
    .required('Kullanıcı adı gereklidir')
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır'),
  firstName: yup
    .string()
    .required('Ad gereklidir')
    .min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: yup
    .string()
    .required('Soyad gereklidir')
    .min(2, 'Soyad en az 2 karakter olmalıdır'),
  password: yup
    .string()
    .min(5, 'Şifre en az 5 karakter olmalıdır')
    .required('Şifre gereklidir'),
});

export const validateRegisterForm = async (formData) => {
  try {
    await registerSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    const errors = {};
    err.inner.forEach((e) => {
      errors[e.path] = e.message;
    });
    return { isValid: false, errors };
  }
};