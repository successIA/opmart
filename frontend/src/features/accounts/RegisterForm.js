import * as React from "react";
import { Alert, Button, Grow } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../components/TextField";
import { useRegisterMutation } from "./api";
import PasswordField from "../../components/PasswordField";

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Enter your email"),
  password: Yup.string()
    .required("Enter your password")
    .min(8, "Must be at least 8 characters")
    .max(128, "Maximum of 128 characters"),
  first_name: Yup.string()
    .required("Enter your first name")
    .min(2, "Must be at least 2 characters")
    .max(30, "Maximum of 30 characters"),
  last_name: Yup.string()
    .min(2, "Must be at least 2 characters")
    .max(30, "Maximum of 30 characters"),
});

function RegisterForm({ onSuccess }) {
  const { mutate, isLoading, error } = useRegisterMutation();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    setFieldError,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (data) => {
      mutate(data, {
        onSuccess: onSuccess,
        onError: handleServerErrors,
      });
    },
  });

  const handleServerErrors = (error) => {
    const fields = ["email", "password"];
    fields.forEach((field) => {
      if (error[field]) {
        setFieldError(field, error[field].join(" "));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error?.detail && (
        <Grow in timeout={100}>
          <Alert severity="error" sx={{ mb: 1 }}>
            {error?.detail}
          </Alert>
        </Grow>
      )}
      <TextField
        label="Email"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
        margin="dense"
        fullWidth
        autoFocus
      />
      <PasswordField
        name="password"
        label="Password"
        margin="dense"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.password}
        error={touched.password && Boolean(errors.password)}
        helperText={touched.password && errors.password}
        fullWidth
      />
      <TextField
        label="First name"
        name="first_name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.first_name}
        error={touched.first_name && Boolean(errors.first_name)}
        helperText={touched.first_name && errors.first_name}
        margin="dense"
        fullWidth
      />
      <TextField
        label="Last name (optional)"
        name="last_name"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.last_name}
        error={touched.last_name && Boolean(errors.last_name)}
        helperText={touched.last_name && errors.last_name}
        margin="dense"
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disableElevation
        size="large"
        disabled={isLoading}
        fullWidth
        sx={{ mt: 2, fontWeight: 600 }}
      >
        Register
      </Button>
    </form>
  );
}

export default RegisterForm;
