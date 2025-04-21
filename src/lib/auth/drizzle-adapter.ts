/**
 * @File: src/lib/auth/drizzle-adapter.ts
 */

import { PrismaClient } from "@prisma/client";
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

const prisma = new PrismaClient();

export function PrismaAdapter(): Adapter {
  return {
    async createUser(userData: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const user = await prisma.user.create({
        data: userData,
      });
      return user;
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      return prisma.user.findUnique({ where: { id } });
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      return prisma.user.findUnique({ where: { email } });
    },

    async getUserByAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<AdapterUser | null> {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });
      return account?.user || null;
    },

    async updateUser(
      user: Partial<AdapterUser> & { id: string }
    ): Promise<AdapterUser> {
      return prisma.user.update({ where: { id: user.id }, data: user });
    },

    async deleteUser(userId: string): Promise<void> {
      await prisma.user.delete({ where: { id: userId } });
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      await prisma.account.create({ data: account });
    },

    async unlinkAccount({
      providerAccountId,
      provider,
    }: {
      providerAccountId: string;
      provider: string;
    }): Promise<void> {
      await prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
    },

    async createSession(session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }): Promise<AdapterSession> {
      return prisma.session.create({ data: session });
    },

    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!session) return null;
      return { session, user: session.user };
    },

    async updateSession(
      session: Partial<AdapterSession> & { sessionToken: string }
    ): Promise<AdapterSession | null> {
      return prisma.session.update({
        where: { sessionToken: session.sessionToken },
        data: session,
      });
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await prisma.session.delete({ where: { sessionToken } });
    },

    async createVerificationToken(
      verificationToken: VerificationToken
    ): Promise<VerificationToken> {
      return prisma.verificationToken.create({ data: verificationToken });
    },

    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }): Promise<VerificationToken | null> {
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { identifier_token: { identifier, token } },
      });
      if (!verificationToken) return null;
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token } },
      });
      return verificationToken;
    },
  };
}
