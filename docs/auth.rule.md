# Auth Module Rules

## Core Logic
- **Default Entry**: All unauthenticated users are redirected to `/login`.
- **Session Management**: Handled by Supabase Auth (`@supabase/ssr`).
- **Profile Linking**: Every `auth.users` entry must have a corresponding entry in the `profiles` table, linked by `tourlive_email`.

## Signup (Onboarding)
- **Path**: `/signup`
- **Batch-Specific Registration**: 
    - Signup is only open for the batch where `is_active = true` in the `batches` table.
    - Message: "현재 [Term]기 크루 회원가입이 진행 중입니다."
- **Duplicate Prevention**: 
    - Before signing up, check if the `tourlive_email` already exists for the *current active batch* in the `crews` table.
    - If a duplicate exists, prevent signup and show: "이미 가입된 투어라이브 계정입니다. 다시 확인해 주세요."
- **User Creation**: Uses the Supabase Service Role Key (`adminClient`) to create/link users and insert into `crews` and `profiles` tables without RLS restrictions.

## Login
- **Path**: `/login`
- **Fields**: 'TourLive Account' (Email) and 'Password'.
- **Validation**: Verifies credentials against Supabase Auth. Successfully logged-in users are redirected to `/dashboard`.

## Data Schema
- **Profiles Table**: Name, Phone, TourLive Account (Unique ID), Contact Email, Password (hashed in Auth), Activity Category, Nickname, Travel Info, Hashtags, Banner Image URL.
- **Crews Table**: Links `user_id` to `batch_id`.
