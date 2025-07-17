import {User, UserRole} from "@/lib/graph/generated/graphql";

const now = new Date()

export const defaultUser: User = {
  firstname: 'Maxi',
  lastname: 'Musterperson',
  id: "invalid ID",
  lastLogin: now,
  lastModified: now,
  createdAt: now,
  mail: 'max.musterperson@mail.com',
  role: UserRole.User,
  password: 'invalid',
  sid: "invalid sid"
}
