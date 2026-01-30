const { z } = require('zod');

const getUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
  }),
});

const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
  }),
});

module.exports = {
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
};
