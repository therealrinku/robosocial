const db = require("./db");

const createPostsTableQuery = `
  CREATE TABLE IF NOT EXISTS posts (
    post_uid SERIAL PRIMARY KEY,
    owner_uid TEXT NOT NULL,
    image_url TEXT NOT NULL,
    status TEXT,
    posted_date TEXT NOT NULL,
    likers TEXT[],
    post_id SERIAL,
    dislikers TEXT[]
);
`;

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    uid SERIAL PRIMARY KEY,
    email TEXT,
    username TEXT,
    profile_image_url TEXT,
    joined_date TEXT,
    followers TEXT[],
    following TEXT[],
    saved_posts_uids TEXT[],
    password TEXT,
    bio TEXT
);
`;

const createNotificationsTableQuery = `
  CREATE TABLE IF NOT EXISTS notifications (
    notification_uid SERIAL PRIMARY KEY,
    notification TEXT,
    owner_uid TEXT,
    interactor_uid TEXT,
    post_uid TEXT,
    date TEXT,
    comment_uid TEXT
);
`;

const createCommentsTableQuery = `
  CREATE TABLE IF NOT EXISTS comments (
    notification_uid SERIAL PRIMARY KEY,
    comment TEXT,
    commenter_uid TEXT,
    post_uid TEXT,
    post_owner_uid TEXT,
    posted_date TEXT,
    likers TEXT[]
);
`;

async function createTables() {
  try {
    // Execute the CREATE TABLE queries
    await db.query(createPostsTableQuery);
    await db.query(createNotificationsTableQuery)
    await db.query(createUsersTableQuery)
    await db.query(createCommentsTableQuery)

    console.log('All the tables created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
  }
}

createTables();
