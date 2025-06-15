-- Add email notifications settings
CREATE TABLE IF NOT EXISTS board_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  notification_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE board_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Board owners can manage settings" ON board_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM boards 
    WHERE boards.id = board_settings.board_id 
    AND boards.owner_id = auth.uid()
  )
);
