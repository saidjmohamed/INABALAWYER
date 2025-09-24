import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dalilsgwgmvxmjhjhckj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGlsc2d3Z212eG1qaGpoY2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMzM5MzksImV4cCI6MjA3MTgwOTkzOX0.iIgt3NrNX_rfVqL1N2RfF_a95oUEqG3O-DoMu6PASWo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)