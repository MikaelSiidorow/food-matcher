import { relations } from "drizzle-orm";
import { boolean, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";

export const matcher = mysqlTable("matcher", {
	id: varchar("id", {
		length: 63,
	})
		.notNull()
		.primaryKey(),
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
		matcherId: varchar("matcherId", {
			length: 32,
		}).notNull(),
		finished: boolean("finished").notNull().default(false),
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
		matcherId: varchar("matcherId", {
			length: 32,
		}).notNull(),
		sessionId: varchar("sessionId", {
			length: 64,
		}).notNull(),
		winner: varchar("winner", {
			length: 255,
		}).notNull(),
		loser: varchar("loser", {
			length: 255,
		}).notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.matcherId, table.sessionId, table.winner, table.loser] }),
	}),
);

export const comparisonRelation = relations(comparison, ({ one }) => ({
	matcher: one(matcherSession, {
		fields: [comparison.matcherId, comparison.sessionId],
		references: [matcherSession.matcherId, matcherSession.sessionId],
	}),
}));
