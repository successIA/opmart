import * as React from "react";
import { Alert, Button, Grow } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import TextField from "../../components/TextField";
import { useLoginMutation } from "./api";
import PasswordField from "../../components/PasswordField";

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Enter your email"),
  password: Yup.string()
    .required("Enter your password")
    .max(128, "Maximum of 128 characters"),
});

function LoginForm({ onSuccess }) {
  const { mutate, isLoading, error } = useLoginMutation();

  const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: validationSchema,
      onSubmit: (data) => {
        mutate(data, {
          onSuccess: onSuccess,
        });
      },
    });

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
        name="email"
        label="Email"
        margin="dense"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disableElevation
        disabled={isLoading}
        fullWidth
        size="large"
        sx={{ mt: 2, fontWeight: 600 }}
      >
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
