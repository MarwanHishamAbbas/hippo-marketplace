import { CollectionConfig } from "payload/types"

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<p>${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}</p>`
      },
    },
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "role",
      required: true,
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
  ],
}
