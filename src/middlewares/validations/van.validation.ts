import z from "zod";

const vanIdSchema = z.object({
  params: z.object({
    vanId: z
      .string({
        required_error: "Please provide a van ID.",
        invalid_type_error: "Van ID must be a string.",
      })
      .trim()
      .uuid({ message: "Please provide a valid van ID." }),
  }),
});

const hostIdSchema = z.object({
  params: z.object({
    hostId: z
      .string({
        required_error: "Please provide a host ID.",
        invalid_type_error: "Host ID must be a string.",
      })
      .trim()
      .uuid({ message: "Please provide a valid host ID." }),
  }),
});

export const getVanSchema = vanIdSchema;

export const getHostVansSchema = hostIdSchema;

export const getHostVanSchema = z.object({
  params: vanIdSchema.shape.params.merge(hostIdSchema.shape.params),
});

export const createVanSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Please provide a name for the van.",
        invalid_type_error: "Name must be a string.",
      })
      .trim()
      .min(5, { message: "Name must have at least 5 characters." })
      .max(50, { message: "Name must have at most 50 characters." }),
    description: z
      .string({
        required_error: "Please provide a description for the van.",
        invalid_type_error: "Description must be a string.",
      })
      .trim()
      .min(10, { message: "Description must have at least 10 characters." })
      .max(500, { message: "Description must have at most 500 characters." }),
    price: z
      .number({
        required_error: "Please provide a price for the van.",
        invalid_type_error: "Price must be a number.",
      })
      .min(0, { message: "Price must be at least 0." }),
    type: z
      .string({
        required_error: "Please provide a type for the van.",
        invalid_type_error: "Type must be a string.",
      })
      .trim()
      .min(3, { message: "Type must have at least 3 characters." })
      .max(20, { message: "Type must have at most 20 characters." }),
    imageUrl: z
      .string({
        required_error: "Please provide an image URL for the van.",
        invalid_type_error: "Image URL must be a string.",
      })
      .trim()
      .url({ message: "Please provide a valid image URL." }),
    hostId: hostIdSchema.shape.params.shape.hostId,
  }),
});
