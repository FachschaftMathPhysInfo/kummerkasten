import {User, UserRole} from "@/lib/graph/generated/graphql";
import {randomUUID} from "node:crypto";

const now = new Date()

export const defaultUser: User = {
  firstname: 'Maxi',
  lastname: 'Musterperson',
  id: randomUUID(),
  lastLogin: now,
  lastModified: now,
  createdAt: now,
  mail: 'max.musterperson@mail.com',
  role: UserRole.User,
  password: 'invalid',
  sid: "invalid sid"
}
