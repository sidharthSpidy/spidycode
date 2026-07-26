import { relations, sql } from "drizzle-orm";
import { boolean, check, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const roadmapDifficulty = pgEnum("roadmap_difficulty", ["beginner", "intermediate", "advanced"]);
export const projectStatus = pgEnum("project_status", ["not_started", "in_progress", "submitted", "approved", "needs_changes"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: varchar("username", { length: 30 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  avatarUrl: text("avatar_url"),
  bio: varchar("bio", { length: 280 }),
  githubUsername: varchar("github_username", { length: 39 }),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("profiles_username_unique").on(table.username), check("profiles_xp_non_negative", sql`${table.xp} >= 0`)]);

export const roadmaps = pgTable("roadmaps", { id: uuid("id").primaryKey().defaultRandom(), slug: varchar("slug", { length: 80 }).notNull().unique(), title: varchar("title", { length: 100 }).notNull(), description: text("description").notNull(), difficulty: roadmapDifficulty("difficulty").notNull(), icon: varchar("icon", { length: 50 }).notNull(), isPublished: boolean("is_published").notNull().default(false), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });
export const levels = pgTable("levels", { id: uuid("id").primaryKey().defaultRandom(), roadmapId: uuid("roadmap_id").notNull().references(() => roadmaps.id, { onDelete: "cascade" }), title: varchar("title", { length: 120 }).notNull(), description: text("description").notNull(), xpReward: integer("xp_reward").notNull(), position: integer("position").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() }, (table) => [uniqueIndex("levels_roadmap_position_unique").on(table.roadmapId, table.position)]);
export const projects = pgTable("projects", { id: uuid("id").primaryKey().defaultRandom(), userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }), levelId: uuid("level_id").notNull().references(() => levels.id), title: varchar("title", { length: 140 }).notNull(), description: text("description").notNull(), githubRepo: text("github_repo"), aiScore: integer("ai_score"), status: projectStatus("status").notNull().default("not_started"), completedAt: timestamp("completed_at", { withTimezone: true }), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow() }, (table) => [check("projects_ai_score_range", sql`${table.aiScore} between 0 and 100`)]);
export const userRoadmaps = pgTable("user_roadmaps", { userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }), roadmapId: uuid("roadmap_id").notNull().references(() => roadmaps.id, { onDelete: "cascade" }), startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow() }, (table) => [primaryKey({ columns: [table.userId, table.roadmapId] })]);
export const userLevelProgress = pgTable("user_level_progress", { userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }), levelId: uuid("level_id").notNull().references(() => levels.id, { onDelete: "cascade" }), completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow() }, (table) => [primaryKey({ columns: [table.userId, table.levelId] })]);
export const achievementDefinitions = pgTable("achievement_definitions", { id: varchar("id", { length: 60 }).primaryKey(), title: varchar("title", { length: 100 }).notNull(), description: varchar("description", { length: 180 }).notNull(), icon: varchar("icon", { length: 32 }).notNull(), threshold: integer("threshold").notNull() });
export const userAchievements = pgTable("user_achievements", { userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }), achievementId: varchar("achievement_id", { length: 60 }).notNull().references(() => achievementDefinitions.id, { onDelete: "cascade" }), earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow() }, (table) => [primaryKey({ columns: [table.userId, table.achievementId] })]);
export const aiReviews = pgTable("ai_reviews", { id: uuid("id").primaryKey().defaultRandom(), projectId: uuid("project_id").notNull().unique().references(() => projects.id, { onDelete: "cascade" }), model: varchar("model", { length: 100 }).notNull(), overallScore: integer("overall_score").notNull(), codeQualityScore: integer("code_quality_score").notNull(), performanceScore: integer("performance_score").notNull(), securityScore: integer("security_score").notNull(), structureScore: integer("structure_score").notNull(), strengths: jsonb("strengths").$type<string[]>().notNull(), weaknesses: jsonb("weaknesses").$type<string[]>().notNull(), suggestions: jsonb("suggestions").$type<string[]>().notNull(), createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow() });

export const roadmapRelations = relations(roadmaps, ({ many }) => ({ levels: many(levels), learners: many(userRoadmaps) }));
export const levelRelations = relations(levels, ({ one, many }) => ({ roadmap: one(roadmaps, { fields: [levels.roadmapId], references: [roadmaps.id] }), projects: many(projects) }));
export const profileRelations = relations(profiles, ({ many }) => ({ projects: many(projects), roadmaps: many(userRoadmaps) }));
