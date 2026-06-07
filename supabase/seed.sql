-- Replace this value with the authenticated user's UUID from Supabase Auth.
-- The app enforces RLS, so demo data must belong to the signed-in user.
with demo_user as (
  select '00000000-0000-0000-0000-000000000000'::uuid as user_id
),
inserted_employees as (
  insert into public.employees (user_id, full_name, role, team, start_date, status, notes)
  select user_id, 'Maya Johnson', 'Support Specialist', 'Client Operations', '2024-03-11', 'Active', 'Strong customer empathy. Prefers direct written expectations.'
  from demo_user
  union all
  select user_id, 'Daniel Lee', 'QA Analyst', 'Quality', '2023-10-02', 'Active', 'Watch recurring handoff gaps after schedule changes.'
  from demo_user
  union all
  select user_id, 'Priya Shah', 'Senior Coordinator', 'Client Operations', '2022-08-15', 'Active', 'Often mentors newer teammates.'
  from demo_user
  returning id, user_id, full_name
),
inserted_notes as (
  insert into public.notes (
    user_id,
    employee_id,
    note_date,
    category,
    observation,
    expected_behavior,
    impact,
    feedback_given,
    employee_response,
    next_step,
    follow_up_date,
    severity,
    visibility
  )
  select
    user_id,
    id,
    current_date - interval '8 days',
    'Positive Feedback',
    'Maya de-escalated a client call by summarizing the issue and confirming the resolution steps before ending the call.',
    'Client-facing issues should be summarized clearly before closure.',
    'The client sent a positive reply and the ticket did not reopen.',
    'Recognition shared in 1:1.',
    'Maya said the call recap template helped.',
    'Ask Maya to share the recap example with the team.',
    current_date + interval '3 days',
    'Low',
    'Manager-ready summary'
  from inserted_employees
  where full_name = 'Maya Johnson'
  union all
  select
    user_id,
    id,
    current_date - interval '3 days',
    'Attendance / PTO',
    'Daniel was out for approved PTO on Monday. The QA handoff was not posted until after the daily queue review.',
    'Approved PTO should include a handoff note before the queue review when owned checks are due.',
    'Two checks were reassigned during the review, which added delay for the backup reviewer.',
    'Reviewed handoff expectations on return.',
    'Daniel acknowledged the miss and said he would draft handoffs the prior afternoon.',
    'Confirm handoff is posted before next planned PTO.',
    current_date + interval '7 days',
    'Medium',
    'Private note'
  from inserted_employees
  where full_name = 'Daniel Lee'
  returning id, user_id, employee_id, category, next_step, follow_up_date
)
insert into public.follow_ups (user_id, employee_id, note_id, follow_up_date, next_step, status)
select user_id, employee_id, id, follow_up_date::date, next_step, 'Open'
from inserted_notes
where follow_up_date is not null;

insert into public.weekly_reviews (
  user_id,
  review_week_start,
  review_week_end,
  team_impact_notes,
  feedback_given,
  expectation_acknowledged,
  repeated_patterns,
  next_week_priorities
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  current_date - extract(dow from current_date)::int + 1,
  current_date - extract(dow from current_date)::int + 7,
  'Queue load was higher than expected after one PTO day and one client escalation.',
  'Feedback was given on handoff expectations and call recap quality.',
  'Both employees acknowledged the expectations discussed.',
  'Handoff timing may be a repeated pattern for Daniel. Positive call handling is a strength pattern for Maya.',
  'Follow up on PTO handoff quality and ask Maya to share her client recap example.';
