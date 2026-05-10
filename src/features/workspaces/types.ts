import { Models } from 'node-appwrite';

export type Workspace = Models.Document & {
  name: string;
  userId: string;
  imageUrl: string;
  inviteCode: string;
};
