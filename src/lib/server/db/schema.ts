import { relations } from "drizzle-orm";
import {
	bigint,
	boolean,
	mysqlEnum,
	mysqlTable,
	primaryKey,
	varchar,
} from "drizzle-orm/mysql-core";
import { foodTypes } from "../../data/foods";

export const matcher = mysqlTable("matcher", {
	id: varchar("id", {
		length: 63,
	})
		.notNull()
		.primaryKey(),
	finished: boolean("finished").notNull().default(false),
	createdBy: varchar("created_by", {
		length: 63,
	}).notNull(),
	createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const matcherRelation = relations(matcher, ({ many }) => ({
	matcherSession: many(matcherSession),
}));

export const matcherSession = mysqlTable(
	"matcher_session",
	{
		sessionId: varchar("id", {
			length: 64,
		}).notNull(),
		matcherId: varchar("matcher_id", {
			length: 32,
		}).notNull(),
		finished: boolean("finished").notNull().default(false),
		createdAt: bigint("created_at", { mode: "number" }).notNull(),
		updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.sessionId, table.matcherId] }),
	}),
);

export const matcherSessionRelation = relations(matcherSession, ({ one, many }) => ({
	matcher: one(matcher, {
		fields: [matcherSession.matcherId],
		references: [matcher.id],
	}),
	comparison: many(comparison),
}));

export const comparison = mysqlTable(
	"comparison",
	{
		matcherId: varchar("matcher_id", {
			length: 32,
		}).notNull(),
		sessionId: varchar("session_id", {
			length: 64,
		}).notNull(),
		previous: mysqlEnum("previous", foodTypes).notNull(),
		current: mysqlEnum("current", foodTypes).notNull(),
		winner: mysqlEnum("winner", ["previous", "current"]).notNull(),
		createdAt: bigint("created_at", { mode: "number" }).notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.matcherId, table.sessionId, table.previous] }),
	}),
);

export const comparisonRelation = relations(comparison, ({ one }) => ({
	matcher: one(matcherSession, {
		fields: [comparison.matcherId, comparison.sessionId],
		references: [matcherSession.matcherId, matcherSession.sessionId],
	}),
}));
