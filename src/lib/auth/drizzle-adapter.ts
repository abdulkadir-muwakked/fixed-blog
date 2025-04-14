/**
 * @File: src/lib/auth/drizzle-adapter.ts
 */

import { and, eq } from "drizzle-orm";
import type { Adapter, AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import { db } from "@/lib/db"; // تأكد من استخدام المسار الصحيح
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { createId } from "@/lib/utils";

export function DrizzleAdapter(client: typeof db): Adapter {
  return {
    async createUser(userData: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const id = createId();
      await client.insert(users).values({
        id,
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name,
        image: userData.image,
      });

      const [user] = await client
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);

      return user;
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => res[0] || null);

      return user;
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((res) => res[0] || null);

      return user;
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<AdapterUser | null> {
      const account = await db
        .select()
        .from(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        )
        .then((res) => res[0]);

      if (!account) {
        return null;
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, account.userId))
        .then((res) => res[0]);

      return user || null;
    },

    async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      await db
        .update(users)
        .set({
          name: user.name,
          email: user.email,
          image: user.image,
          emailVerified: user.emailVerified,
        })
        .where(eq(users.id, user.id));

      const updatedUser = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .then((res) => res[0]);

      return updatedUser;
    },

    async deleteUser(userId: string): Promise<void> {
      await db.delete(users).where(eq(users.id, userId));
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      await db.insert(accounts).values({
        id: createId(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      });
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<void> {
      await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        );
    },

    async createSession(session: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
      await db.insert(sessions).values({
        id: createId(),
        userId: session.userId,
        sessionToken: session.sessionToken,
        expires: session.expires,
      });

      const createdSession = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, session.sessionToken))
        .then((res) => res[0]);

      return createdSession;
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .then((res) => res[0]);

      if (!session) {
        return null;
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, session.userId))
        .then((res) => res[0]);

      if (!user) {
        return null;
      }

      return {
        session,
        user,
      };
    },

    async updateSession(session: Partial<AdapterSession> & { sessionToken: string }): Promise<AdapterSession | null> {
      await db
        .update(sessions)
        .set({
          expires: session.expires,
        })
        .where(eq(sessions.sessionToken, session.sessionToken));

      const updatedSession = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, session.sessionToken))
        .then((res) => res[0] || null);

      return updatedSession;
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
    },

    async createVerificationToken(verificationToken: VerificationToken): Promise<VerificationToken> {
      await db.insert(verificationTokens).values({
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: verificationToken.expires,
      });

      const token = await db
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, verificationToken.identifier),
            eq(verificationTokens.token, verificationToken.token)
          )
        )
        .then((res) => res[0]);

      return token;
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }): Promise<VerificationToken | null> {
      const verificationToken = await db
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, token)
          )
        )
        .then((res) => res[0] || null);

      if (!verificationToken) {
        return null;
      }

      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, token)
          )
        );

      return verificationToken;
    },
  };
}
