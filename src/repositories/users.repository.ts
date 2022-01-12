import db from "../db";
import User from "../models/user.model";
import DataBaseError from "../models/errors/database.error.model";

class UserRepository {
  async findAllUsers(): Promise<User[]> {
    try {
      const queryUsers = "SELECT uuid, username FROM aplication_users";
      const { rows } = await db.query<User>(queryUsers);

      return rows || [];
    } catch (error) {
      throw new DataBaseError("Ocorreu um erro na consulta", error);
    }
  }

  async findUsersById(uuid: string): Promise<User> {
    try {
      const queryUser =
        "SELECT uuid, username FROM aplication_users WHERE uuid = $1";

      const values = [uuid];
      const { rows } = await db.query<User>(queryUser, values);
      const [user] = rows;

      return user;
    } catch (error) {
      throw new DataBaseError("Ocorreu um erro na consulta por ID ", error);
    }
  }

  async findByUsernameandPassword(username: string, password: string): Promise<User | null> {
    try {
      const script = `
        SELECT uuid, username FROM aplication_users 
        WHERE username = $1 AND password = crypt($2, 'my_salt')
      `;
  
      const values = [username, password];
      const { rows } = await db.query<User>(script, values);
      const [user] = rows;
  
      return user || null;
    } catch (error) {
      throw new DataBaseError("Ocorreu um erro na consulta por usarname e password", error);
    }
  }

  async insertUser(user: User): Promise<string> {
    try {
      const script = `
        INSERT INTO aplication_users(username, password) 
        VALUES($1,crypt($2, 'my_salt'))
        RETURNING uuid`;

      const values = [user.username, user.password];
      const { rows } = await db.query<{ uuid: string }>(script, values);
      const [newUser] = rows;

      return newUser.uuid;
    } catch (error) {
      throw new DataBaseError(
        "Ocorreu um erro na criação do novo usúario ",
        error
      );
    }
  }

  async userUpdate(user: User): Promise<void> {
    try {
      const script = `
        UPDATE aplication_users SET username = $1, password = crypt($2, 'my_salt')
        WHERE uuid = $3`;
      const values = [user.username, user.password, user.uuid];

      await db.query(script, values);
    } catch (error) {
      throw new DataBaseError(
        "Ocorreu um erro na atualização do usúario ",
        error
      );
    }
  }

  async deleteUser(uuid: string): Promise<void> {
    try {
      const script = `DELETE FROM aplication_users WHERE uuid = $1`;
      const values = [uuid];

      await db.query(script, values);
    } catch (error) {
      throw new DataBaseError("Ocorreu um erro na exclusão do usúario", error);
    }
  }
}

export default new UserRepository();
