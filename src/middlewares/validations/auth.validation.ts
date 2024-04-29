import z from "zod";

export const signUpSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Please provide a name to sign up.",
        invalid_type_error: "Name must be a string.",
      })
      .min(5, { message: "Name must have at least 5 characters." })
      .max(50, { message: "Name must have at most 50 characters." })
      .trim(),
    imageUrl: z
      .string({
        required_error: "Please provide an image URL to sign up.",
        invalid_type_error: "Image URL must be a string.",
      })
      .url({ message: "Please provide a valid image URL." })
      .trim(),
    email: z
      .string({
        required_error: "Please provide an email to sign up.",
        invalid_type_error: "Email must be a string.",
      })
      .email({ message: "Please provide a valid email." })
      .trim(),
    username: z
      .string({
        required_error: "Please provide a username to sign up.",
        invalid_type_error: "Username must be a string.",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "Username must contain only letters, numbers, and underscores.",
      })
      .min(4, { message: "Username must have at least 4 characters." })
      .max(20, { message: "Username must have at most 20 characters." })
      .trim(),
    password: z
      .string({
        required_error: "Please provide a password to sign up.",
        invalid_type_error: "Password must be a string.",
      })
      .min(8, { message: "Password must have at least 8 characters." })
      .max(50, { message: "Password must have at most 50 characters." }),
  }),
});

export const verifyEmailAndOtpSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Please provide an email to verify.",
        invalid_type_error: "Email must be a string.",
      })
      .email({ message: "Please provide a valid email." })
      .trim(),
    otp: z
      .string({
        required_error: "Please provide an OTP to verify.",
        invalid_type_error: "OTP must be a string.",
      })
      .min(6, { message: "OTP must have at least 6 characters." })
      .max(6, { message: "OTP must have at most 6 characters." }),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Please provide an email to resend OTP.",
        invalid_type_error: "Email must be a string.",
      })
      .email({ message: "Please provide a valid email." })
      .trim(),
  }),
});

export const signInSchema = z.object({
  body: z.object({
    usernameOrEmail: z
      .string({
        required_error: "Please provide a username or email to sign in.",
        invalid_type_error: "Username or email must be a string.",
      })
      .refine(
        (data) => {
          return data.includes("@") || data.includes(".")
            ? z
                .string()
                .email({ message: "Please provide a valid email." })
                .parse(data)
            : z
                .string()
                .min(4, {
                  message: "Username must have at least 4 characters.",
                })
                .max(20, {
                  message: "Username must have at most 20 characters.",
                })
                .parse(data);
        },
        {
          message: "Please provide a valid username or email.",
        }
      ),
    password: z
      .string({
        required_error: "Please provide a password to sign in.",
        invalid_type_error: "Password must be a string.",
      })
      .min(8, { message: "Password must have at least 8 characters." })
      .max(50, { message: "Password must have at most 50 characters." }),
  }),
});
