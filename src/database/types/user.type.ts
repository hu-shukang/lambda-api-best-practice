import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface UserTbl {
  id: ColumnType<string, string, never>;
  name: string;
  address: string;
  email: ColumnType<string, string, never>;
  createdAt: ColumnType<Date, Date | null, never>;
  updatedAt: ColumnType<Date | null, Date | null, Date>;
}

export type User = Selectable<UserTbl>;
export type UserCreateInput = Insertable<UserTbl>;
export type UserUpdateInput = Updateable<UserTbl>;
