-- FNG now operates across several countries rather than a set of Saudi
-- cities, and the lead forms collect the visitor's country separately from
-- their city. Safe to re-run; src/lib/inquiries.ts tolerates the column being
-- absent (it folds the country into `city`) until this has been applied.
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS country TEXT;
