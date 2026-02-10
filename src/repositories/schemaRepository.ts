import { execute } from "./db";

const createSchema = async (): Promise<void> => {
	await execute("PRAGMA foreign_keys = ON");

	const sqlStart = [
		`CREATE TABLE IF NOT EXISTS \`influencers\` (
            \`id\` INTEGER PRIMARY KEY,
            \`name\` TEXT,
            \`igUsername\` TEXT,
            \`email\` TEXT,
            \`passwordHash\` TEXT
         )`,
		`CREATE TABLE IF NOT EXISTS \`companies\` (
            \`id\` INTEGER PRIMARY KEY,
            \`name\` TEXT,
            \`CVR\` INT,
            \`email\` TEXT,
            \`passwordHash\` TEXT
         )`,
		`CREATE TABLE IF NOT EXISTS \`conversations\` (
            \`id\` INTEGER PRIMARY KEY,
            \`company_id\` INTEGER NOT NULL,
            \`influencer_id\` INTEGER NOT NULL,
            \`created_at\` TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(\`company_id\`, \`influencer_id\`),
            FOREIGN KEY(\`company_id\`) REFERENCES \`companies\`(\`id\`),
            FOREIGN KEY(\`influencer_id\`) REFERENCES \`influencers\`(\`id\`)
         )`,
		`CREATE TABLE IF NOT EXISTS \`messages\` (
            \`id\` INTEGER PRIMARY KEY,
            \`text\` TEXT NOT NULL
         )`,
		`CREATE TABLE IF NOT EXISTS \`attachments\` (
            \`id\` INTEGER PRIMARY KEY,
            \`url\` TEXT NOT NULL,
            \`mime_type\` TEXT,
            \`file_name\` TEXT,
            \`size_bytes\` INTEGER
         )`,
		`CREATE TABLE IF NOT EXISTS \`posted_contents\` (
            \`id\` INTEGER PRIMARY KEY,
            \`platform\` TEXT,
            \`url\` TEXT NOT NULL,
            \`title\` TEXT,
            \`caption\` TEXT
         )`,
		`CREATE TABLE IF NOT EXISTS \`transfers\` (
            \`id\` INTEGER PRIMARY KEY,
            \`amount\` INTEGER NOT NULL,
            \`currency\` TEXT NOT NULL,
            \`state\` TEXT NOT NULL,
            \`reference\` TEXT
         )`,
		`CREATE TABLE IF NOT EXISTS \`chat_items\` (
            \`id\` INTEGER PRIMARY KEY,
            \`conversation_id\` INTEGER NOT NULL,
            \`type\` TEXT NOT NULL,
            \`sender_type\` TEXT NOT NULL,
            \`sender_id\` INTEGER NOT NULL,
            \`message_id\` INTEGER,
            \`attachment_id\` INTEGER,
            \`post_id\` INTEGER,
            \`transfer_id\` INTEGER,
            \`created_at\` TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(\`conversation_id\`) REFERENCES \`conversations\`(\`id\`),
            FOREIGN KEY(\`message_id\`) REFERENCES \`messages\`(\`id\`),
            FOREIGN KEY(\`attachment_id\`) REFERENCES \`attachments\`(\`id\`),
            FOREIGN KEY(\`post_id\`) REFERENCES \`posted_contents\`(\`id\`),
            FOREIGN KEY(\`transfer_id\`) REFERENCES \`transfers\`(\`id\`)
         )`,
		`CREATE INDEX IF NOT EXISTS \`idx_chat_items_conversation_created\` ON \`chat_items\`(\`conversation_id\`, \`created_at\`, \`id\`)`,
		`CREATE INDEX IF NOT EXISTS \`idx_conversations_company\` ON \`conversations\`(\`company_id\`)`,
		`CREATE INDEX IF NOT EXISTS \`idx_conversations_influencer\` ON \`conversations\`(\`influencer_id\`)`,
	];

	for (const statement of sqlStart) {
		await execute(statement);
	}
};

export { createSchema };
