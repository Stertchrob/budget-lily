-- Run this if you have an existing statement_uploads table without the name column
ALTER TABLE statement_uploads ADD COLUMN IF NOT EXISTS name text;
UPDATE statement_uploads SET name = file_name WHERE name IS NULL;

-- Add category_edited to transactions for edit highlighting
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category_edited boolean DEFAULT false;
