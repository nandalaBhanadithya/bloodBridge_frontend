-- BloodBridge Supabase Database Schema
-- This script sets up the database tables, functions, and policies for BloodBridge

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'Bridge Donor', 'Emergency Donor', 'Guest', 'Patient', 'Volunteer');
CREATE TYPE onboarding_status AS ENUM ('pending_verification', 'approved', 'rejected');
CREATE TYPE donor_status AS ENUM ('active', 'inactive', 'held', 'disbanded');
CREATE TYPE bridge_status AS ENUM ('active', 'inactive', 'completed');
CREATE TYPE event_status AS ENUM ('pending', 'approved', 'rejected', 'completed');
CREATE TYPE event_type AS ENUM ('initial_meeting', 'follow_up', 'community_event', 'integration_event');

-- Patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    hospital_preference TEXT,
    frequency_in_days INTEGER CHECK (frequency_in_days >= 14),
    onboarding_status onboarding_status DEFAULT 'pending_verification',
    rejection_reason TEXT,
    medical_report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donors table
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    blood_group TEXT NOT NULL,
    status donor_status DEFAULT 'active',
    hold_reason TEXT,
    disband_reason_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bridges table
CREATE TABLE bridges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    blood_group TEXT NOT NULL,
    frequency_in_days INTEGER CHECK (frequency_in_days >= 14),
    status bridge_status DEFAULT 'active',
    hospital TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bridge-Donor assignments
CREATE TABLE bridge_donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bridge_id UUID REFERENCES bridges(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bridge_id, donor_id)
);

-- Blood inventory
CREATE TABLE blood_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bridge_id UUID REFERENCES bridges(id) ON DELETE CASCADE,
    blood_group TEXT NOT NULL,
    units INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bridge_id, blood_group)
);

-- Activities/Events
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type event_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    status event_status DEFAULT 'pending',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity RSVPs
CREATE TABLE activity_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    response TEXT CHECK (response IN ('yes', 'no', 'maybe')),
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(activity_id, user_id)
);

-- Integration events
CREATE TABLE integration_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    bridge_id UUID REFERENCES bridges(id) ON DELETE CASCADE,
    event_type TEXT DEFAULT 'initial_meeting',
    deadline TIMESTAMP WITH TIME ZONE,
    status event_status DEFAULT 'pending',
    requested_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting requests
CREATE TABLE meeting_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID,
    requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    requested_date TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    status event_status DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Volunteer invites
CREATE TABLE volunteer_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    invite_token TEXT NOT NULL UNIQUE,
    created_by UUID REFERENCES auth.users(id),
    used BOOLEAN DEFAULT FALSE,
    used_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE
);

-- Failure reports
CREATE TABLE failure_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_status ON patients(onboarding_status);
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_donors_status ON donors(status);
CREATE INDEX idx_bridges_patient_id ON bridges(patient_id);
CREATE INDEX idx_bridge_donors_bridge_id ON bridge_donors(bridge_id);
CREATE INDEX idx_bridge_donors_donor_id ON bridge_donors(donor_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activity_rsvps_activity_id ON activity_rsvps(activity_id);
CREATE INDEX idx_integration_events_donor_id ON integration_events(donor_id);
CREATE INDEX idx_integration_events_bridge_id ON integration_events(bridge_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bridges_updated_at BEFORE UPDATE ON bridges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_inventory_updated_at BEFORE UPDATE ON blood_inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_events_updated_at BEFORE UPDATE ON integration_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meeting_requests_updated_at BEFORE UPDATE ON meeting_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_failure_reports_updated_at BEFORE UPDATE ON failure_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridges ENABLE ROW LEVEL SECURITY;
ALTER TABLE bridge_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE failure_reports ENABLE ROW LEVEL SECURITY;

-- Patients policies
CREATE POLICY "Users can view their own patient data" ON patients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all patients" ON patients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Users can insert their own patient data" ON patients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patient data" ON patients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all patients" ON patients
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Donors policies
CREATE POLICY "Users can view their own donor data" ON donors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all donors" ON donors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Users can insert their own donor data" ON donors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all donors" ON donors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Bridges policies
CREATE POLICY "Users can view bridges for their patients" ON bridges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = bridges.patient_id
            AND patients.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all bridges" ON bridges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can insert bridges" ON bridges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update bridges" ON bridges
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Activities policies
CREATE POLICY "Authenticated users can view activities" ON activities
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert activities" ON activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update activities" ON activities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Activity RSVPs policies
CREATE POLICY "Users can insert their own RSVPs" ON activity_rsvps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs" ON activity_rsvps
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view RSVPs" ON activity_rsvps
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Integration events policies
CREATE POLICY "Donors can view their integration events" ON integration_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM donors
            WHERE donors.id = integration_events.donor_id
            AND donors.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all integration events" ON integration_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can insert integration events" ON integration_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update integration events" ON integration_events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Failure reports policies
CREATE POLICY "Admins can view failure reports" ON failure_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can insert failure reports" ON failure_reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update failure reports" ON failure_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Volunteer invites policies
CREATE POLICY "Admins can view volunteer invites" ON volunteer_invites
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can insert volunteer invites" ON volunteer_invites
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into appropriate table based on role
    IF NEW.raw_user_meta_data->>'role' = 'Patient' THEN
        INSERT INTO patients (user_id, full_name, blood_group, hospital_preference, frequency_in_days)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'blood_group', ''),
            COALESCE(NEW.raw_user_meta_data->>'hospital_preference', ''),
            (NEW.raw_user_meta_data->>'frequency_in_days')::INTEGER
        );
    ELSIF NEW.raw_user_meta_data->>'role' IN ('Bridge Donor', 'Emergency Donor', 'Guest') THEN
        INSERT INTO donors (user_id, blood_group)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'blood_group', '')
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to get user profile with role
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_role TEXT;
    patient_data JSON;
    donor_data JSON;
    result JSON;
BEGIN
    user_role := COALESCE(
        (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = user_id),
        'Patient'
    );
    
    IF user_role = 'Patient' THEN
        SELECT json_build_object(
            'id', id,
            'full_name', full_name,
            'blood_group', blood_group,
            'hospital_preference', hospital_preference,
            'frequency_in_days', frequency_in_days,
            'onboarding_status', onboarding_status
        ) INTO patient_data
        FROM patients WHERE user_id = user_id;
        
        result := json_build_object(
            'role', user_role,
            'onboarding_status', patient_data->>'onboarding_status',
            'patient_data', patient_data
        );
    ELSIF user_role IN ('Bridge Donor', 'Emergency Donor', 'Guest') THEN
        SELECT json_build_object(
            'id', id,
            'blood_group', blood_group,
            'status', status
        ) INTO donor_data
        FROM donors WHERE user_id = user_id;
        
        result := json_build_object(
            'role', user_role,
            'donor_data', donor_data
        );
    ELSE
        result := json_build_object('role', user_role);
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION get_user_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;

-- Create storage bucket for medical reports (if storage is enabled)
-- Note: This requires Supabase Storage to be enabled
-- INSERT INTO storage.buckets (id, name, public) VALUES ('medical-reports', 'medical-reports', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Create storage policies (if storage is enabled)
-- CREATE POLICY "Users can upload their own medical reports" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);
-- 
-- CREATE POLICY "Users can view their own medical reports" ON storage.objects
--     FOR SELECT USING (bucket_id = 'medical-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

COMMENT ON TABLE patients IS 'Patient information and transfusion schedules';
COMMENT ON TABLE donors IS 'Donor information and status';
COMMENT ON TABLE bridges IS 'Blood bridges connecting patients and donors';
COMMENT ON TABLE bridge_donors IS 'Assignments of donors to bridges';
COMMENT ON TABLE blood_inventory IS 'Blood stock inventory by bridge';
COMMENT ON TABLE activities IS 'Community events and activities';
COMMENT ON TABLE activity_rsvps IS 'RSVPs for activities';
COMMENT ON TABLE integration_events IS 'Integration events for donor-patient meetings';
COMMENT ON TABLE meeting_requests IS 'Meeting requests from patients/donors';
COMMENT ON TABLE volunteer_invites IS 'Invitation tokens for volunteer signup';
COMMENT ON TABLE failure_reports IS 'System failure reports and analysis';
