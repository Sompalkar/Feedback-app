-- Drop tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS feedback_reactions CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS board_categories CASCADE;
DROP TABLE IF EXISTS board_settings CASCADE;
DROP TABLE IF EXISTS boards CASCADE;

-- Create boards table first (since other tables depend on it)
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create board_categories table
CREATE TABLE board_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint for category names per board
ALTER TABLE board_categories ADD CONSTRAINT unique_category_name_per_board 
UNIQUE (board_id, name);

-- Create feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES board_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  author_name TEXT,
  status TEXT DEFAULT 'open' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback_reactions table
CREATE TABLE feedback_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  count INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (feedback_id, emoji)
);

-- Create board_settings table
CREATE TABLE board_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  allow_public_feedback BOOLEAN DEFAULT true,
  allow_anonymous_feedback BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (board_id)
);

-- Enable RLS and create policies
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_settings ENABLE ROW LEVEL SECURITY;

-- Boards policies
CREATE POLICY "Boards are viewable by everyone" ON boards
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own boards" ON boards
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own boards" ON boards
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own boards" ON boards
  FOR DELETE USING (auth.uid() = owner_id);

-- Board categories policies
CREATE POLICY "Categories are viewable by everyone" ON board_categories
  FOR SELECT USING (true);

CREATE POLICY "Board owners can insert categories" ON board_categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_categories.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

CREATE POLICY "Board owners can update categories" ON board_categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_categories.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

CREATE POLICY "Board owners can delete categories" ON board_categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_categories.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Feedback policies
CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = feedback.board_id 
      AND (
        boards.owner_id = auth.uid() 
        OR EXISTS (
          SELECT 1 FROM board_settings 
          WHERE board_settings.board_id = boards.id 
          AND board_settings.allow_public_feedback = true
        )
      )
    )
  );

CREATE POLICY "Board owners can view feedback" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = feedback.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Feedback reactions policies
CREATE POLICY "Anyone can view reactions" ON feedback_reactions
  FOR SELECT USING (true);

CREATE POLICY "Board owners can manage reactions" ON feedback_reactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = feedback_reactions.feedback_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Board settings policies
CREATE POLICY "Board owners can manage settings" ON board_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM boards 
      WHERE boards.id = board_settings.board_id 
      AND boards.owner_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_boards_owner_id ON boards(owner_id);
CREATE INDEX idx_boards_slug ON boards(slug);
CREATE INDEX idx_board_categories_board_id ON board_categories(board_id);
CREATE INDEX idx_feedback_board_id ON feedback(board_id);
CREATE INDEX idx_feedback_category_id ON feedback(category_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_reactions_feedback_id ON feedback_reactions(feedback_id);

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE boards TO authenticated;
GRANT ALL PRIVILEGES ON TABLE board_categories TO authenticated;
GRANT ALL PRIVILEGES ON TABLE feedback TO authenticated;
GRANT ALL PRIVILEGES ON TABLE feedback_reactions TO authenticated;
GRANT ALL PRIVILEGES ON TABLE board_settings TO authenticated;